import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Put,
  Patch,
  UseGuards,
  Request,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ValidationService } from './validation/validation.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { MongoIdPipe } from 'src/common/pipes/validate-mongo-id/validate-mongo-id.pipe';
import { ApiKeyGuard } from 'src/guards/api-key/api-key.guard';

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
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<{ message: string }> {
    await this.validationService.checkUserUniqueness(
      createUserDto.username,
      createUserDto.email
    );
    await this.usersService.create(createUserDto);
    return { message: 'Success' };
  }

  //  Get All Users
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Get all users.' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Activate user account
  @Get('activate-account')
  async activateAccount(
    @Query('code') code: string
  ): Promise<{ message: string }> {
    try {
      await this.usersService.activateAccount(code);
    } catch (error) {
      console.error(error);
    }
    return { message: 'Succesfull' };
  }

  // Find user by email or username
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('find')
  @ApiOperation({ summary: 'Get user by email or username' })
  @ApiResponse({ status: 200, description: 'Get user by email or username.' })
  async findUserByUsernameOrEmail(
    @Query('identifier') identifier: string
  ): Promise<Partial<User>> {
    return this.usersService.findUserByUsernameOrEmail(identifier);
  }

  // Find if user Exists
  @Get('check-email')
  @ApiOperation({ summary: 'Get if the user exists and is active' })
  @ApiResponse({
    status: 200,
    description: 'Get if the user exists and is active .',
  })
  async isEmailExists(
    @Query('email') email: string
  ): Promise<{ userExist: boolean; isUserActive: boolean }> {
    const user = await this.usersService.checkEmail(email);
    return { userExist: true, isUserActive: user.isActive };
  }

  // Find User By Id
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Get user by Id.' })
  async findUserById(@Param('id') id: string): Promise<Partial<User>> {
    return this.usersService.findUserById(id); // Obtiene todos los usuarios
  }

  // Update User Info
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Put(':id')
  @ApiOperation({ summary: 'Update user data' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req
  ): Promise<Partial<User>> {
    if (req.user.userId !== id) {
      throw new ForbiddenException('You can only update your own information');
    }
    return this.usersService.updateUser(id, updateUserDto);
  }

  // Change Password
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Patch('change-password/:id')
  @ApiOperation({ summary: 'Change Password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully.' })
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Request() req
  ): Promise<{ message: string }> {
    if (req.user.userId !== id) {
      throw new ForbiddenException('You can only uchange your own password');
    }
    await this.usersService.updatePassword(id, updatePasswordDto);
    return {
      message: 'Password updated successfully.',
    };
  }

  // Give Admin Role
  @UseGuards(ApiKeyGuard)
  @Patch('change-roles/:id')
  @ApiHeader({
    name: 'api_key',
    description: 'api_key from authorization',
    required: true,
  })
  @ApiOperation({ summary: 'Update User Role' })
  @ApiResponse({
    status: 200,
    description: 'Role Updated Successfully',
  })
  async changeRole(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ): Promise<{ message: string }> {
    await this.usersService.changeUserRole(id, updateUserRoleDto);
    return {
      message: 'Role Changed Successfully.',
    };
  }

  // Delete user
  @Delete('delete-user')
  @ApiOperation({ summary: 'Delete User' })
  @ApiResponse({ status: 200, description: 'user Deleted successfully.' })
  async deleteUser(
    @Query('email') email: string
  ): Promise<{ message: string }> {
    await this.usersService.deleteUser(email);
    return {
      message: 'User Deleted successfully.',
    };
  }
}
