import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ValidationService } from './validation/validation.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly validationService: ValidationService
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'User created.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    await this.validationService.checkUserUniqueness(
      createUserDto.username,
      createUserDto.email
    );
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get all users.' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll(); // Obtiene todos los usuarios
  }
}
