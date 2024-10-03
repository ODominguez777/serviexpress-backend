import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user', example: 'John' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The lastname of the user', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '86660426',
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'Vegetta777',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john@doe.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Johndoesito1234#',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,16}$/,
    {
      message:
        'Password must be between 8 and 16 characters long, and contain at least one letter, one number, and one special character.',
    }
  )
  password: string;

  @ApiProperty({ description: 'Profile image url' })
  @IsNotEmpty()
  profilePicUrl: string;
}
