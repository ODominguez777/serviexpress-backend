import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Put,
  Patch,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ValidationService } from './validation/validation.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Response } from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly validationService: ValidationService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User Created.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    await this.validationService.checkUserUniqueness(
      createUserDto.username,
      createUserDto.email
    );
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Get all users.' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('activate-account')
  async activateAccount(
    @Query('code') code: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      await this.usersService.activateAccount(code);
      res.redirect('/public/activation-success.html');
    } catch (error) {
      console.error(error);
      res.redirect('/public/activation-failed.html');
    }
  }

  @Get('find')
  @ApiOperation({ summary: 'Get user by email or username' })
  @ApiResponse({ status: 200, description: 'Get user by email or username.' })
  async findUserByUsernameOrEmail(
    @Query('identifier') identifier: string
  ): Promise<Partial<User>> {
    return this.usersService.findUserByUsernameOrEmail(identifier);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Get user by Id.' })
  async findUserById(@Param('id') id: string): Promise<Partial<User>> {
    return this.usersService.findUserById(id); // Obtiene todos los usuarios
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user data' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<Partial<User>> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Change Password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully.' })
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<void> {
    return this.usersService.updatePassword(id, updatePasswordDto);
  }
}
