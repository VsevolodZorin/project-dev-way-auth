import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private authService: AuthService) {
    super({
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const refreshToken = request?.cookies['refreshToken'];
          if (!refreshToken) {
            return null;
          }
          return refreshToken;
        },
      ]),
    });
  }

  async validate(req: Request, payload: any) {
    if (!payload) {
      throw new BadRequestException('invalid jwt token');
    }
    const userId = payload.sub;
    const refreshToken = req?.cookies['refreshToken'];
    if (!refreshToken) {
      throw new BadRequestException('invalid refresh token');
    }

    const isValidToken = await this.authService.validRefreshToken(
      userId,
      refreshToken,
    );
    if (!isValidToken) {
      throw new BadRequestException('token expired');
    }

    return refreshToken;
  }
}
