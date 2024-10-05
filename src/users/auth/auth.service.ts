/* eslint-disable */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users.service';
import { comparePasswords } from 'src/utils/password.util';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findUserForAuth(username);
    if (user && (await comparePasswords(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: process.env.REFRESH_JWT_EXPIRATION,
      }),
    };
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      // Verifying the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      // Generating a new access token
      const newAccessToken = this.jwtService.sign(
        { username: payload.username, sub: payload.sub },
        { expiresIn: process.env.REFRESH_JWT_EXPIRATION } // Optional: configurable via env vars or another parameter
      );

      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
