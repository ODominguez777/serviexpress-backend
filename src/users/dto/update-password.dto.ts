import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'CurrentPassword123!' })
  @IsString()
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,16}$/,
    {
      message:
        'Password must be between 8 and 16 characters long, and contain at least one letter, one number, and one special character.',
    }
  )
  currentPassword: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,16}$/,
    {
      message:
        'Password must be between 8 and 16 characters long, and contain at least one letter, one number, and one special character.',
    }
  )
  password: string;
}
