import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SessionEntity } from 'src/resources/session/session.entity';
import { SessionService } from 'src/resources/session/session.service';
import { UserEntity } from 'src/resources/user/user.entity';
import { IJwtPayload } from 'src/services/jwt/types/jwt-payload.interface';
import { IJwtTokenPair } from 'src/services/jwt/types/jwt-tokenPair.interface';
import { DeleteResult } from 'typeorm';

@Injectable()
export class JwtWrapperService {
  constructor(
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
    private jwtService: JwtService,
  ) {}

  private async generateAccessToken(payload: IJwtPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRESIN'),
    });
    return accessToken;
  }

  private async generateRefreshToken(payload: IJwtPayload): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRESIN'),
    });
    return refreshToken;
  }

  /**
   * @description create or update session, if session already exists
   */
  async generateTokenPair(user: UserEntity): Promise<IJwtTokenPair> {
    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      isActivated: user.isActivated,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    await this.saveToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: string): IJwtPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
  }
  validateRefreshToken(token: string): IJwtPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
  }

  // todo check
  private async saveToken(userId, refreshToken): Promise<SessionEntity> {
    const session = await this.sessionService.findByUserId(userId);
    if (!session) {
      return await this.sessionService.create({ userId, refreshToken });
    }
    return this.sessionService.update({ userId, refreshToken });
  }

  deleteSession(userId: number): Promise<DeleteResult> {
    return this.sessionService.deleteByUserId(userId);
  }

  findToken(refreshToken: string): Promise<SessionEntity> {
    return this.sessionService.findByRefreshToken(refreshToken);
  }
}
