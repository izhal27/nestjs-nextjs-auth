import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtStrategy } from './strategy/jwt-auth.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtStrategy)
  signin(@Body() dto: SigninDto) {
    const { email, password } = dto;
    return this.authService.signin(email, password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    console.log(
      'Refresh token at: ',
      new Date().toLocaleString('en-GB', { timeZone: 'Asia/Singapore' }),
    );
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
