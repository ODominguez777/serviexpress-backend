import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Sign in with a registered user' })
  @ApiResponse({ status: 201, description: 'Successfull Sign In.' })
  async login(@Body() loginDto: LoginDto) {
    console.log(loginDto);
    const validUser = await this.authService.validateUser(
      loginDto.identifier,
      loginDto.password
    );
    if (!validUser) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = {
      username: validUser.username,
      sub: validUser._id.toString(),
    };
    return this.authService.login(payload);
  }

  @Post('refresh-token')
  @ApiHeader({
    name: 'refreshToken',
    description: 'A custom token sent in the Authorization header',
    required: true,
  })
  @ApiOperation({ summary: 'Refresh the access token using a refresh token' })
  async refreshToken(@Headers('refreshToken') token: string) {
    if (!token) {
      throw new UnauthorizedException('No refresh token provided');
    }

    return this.authService.refreshToken(token);
  }
}
