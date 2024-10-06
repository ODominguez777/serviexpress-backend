// src/users/dto/update-user-role.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/common/user-role.enum'; // Importa el enum desde utils

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole, {
    message: 'Role must be one of the following: user, admin, handyman',
  })
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRole;
}
