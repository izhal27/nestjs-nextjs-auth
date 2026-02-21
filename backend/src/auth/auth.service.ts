import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../generated/prisma/client';
import { UserService } from '../user/user.service';
import { SignupDto } from './dto/signup.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.find({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async signUp(dto: SignupDto): Promise<User> {
    const user = await this.userService.find({ email: dto.email });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.userService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });
  }

  async signin(email: string, password: string): Promise<TokenResponse> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    // Store refresh token in database (recommended for production)
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<Omit<TokenResponse, 'user'>> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Verify refresh token exists in database (recommended)
      const user = await this.userService.find({ email: payload.email });
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);

      // Update refresh token in database
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    // Remove refresh token from database
    await this.userService.removeRefreshToken(userId);
  }

  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: 'refresh',
    };

    const accessTokenExpiration =
      this.configService.get<string>('JWT_EXPIRATION') || '2m';
    const refreshTokenExpiration =
      this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: accessTokenExpiration,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshTokenExpiration,
      }),
    ]);

    // Convert expiration string to seconds
    const expiresIn = this.parseExpiration(accessTokenExpiration);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  private parseExpiration(expiration: string): number {
    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // default 15 minutes

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return value * (multipliers[unit] || 60);
  }
}
