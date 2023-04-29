import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { IJwtPayload } from './types/jwt-payload.interface';
import { IJwtTokenPair } from './types/jwt-token-pair.interface';
import { UserService } from '../user/user.service';
import { SessionService } from '../session/session.service';
import { UserEntity } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionService: SessionService,
  ) {}

  async validateLocalUser(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.usersService.findByEmail(email);
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (user && isCorrectPassword) {
      delete user.password;
      return user;
    }
    return null;
  }

  // todo check response
  async registration(dto: CreateUserDto): Promise<IJwtTokenPair> {
    const user = await this.usersService.create(dto);
    // todo
    // const activationLink = uuid(); // v34fa-asfasf-142saf-sa-asf
    // const apiUrl = this.configService.get('API_URL');
    // todo activation link on client
    // const link = `${apiUrl}/auth/activate/${activationLink}`;
    // await this.mailService.sendActivationMail(dto.email, link);

    // await this.emailActivationService.create({
    //   email: user.email,
    //   activationLink,
    // });
    const tokenPair = await this.generateTokenPair(user.id);

    return tokenPair;
  }

  async generateAccessToken(id: number): Promise<string> {
    const payload: IJwtPayload = { sub: id };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRESIN'),
    });
    return accessToken;
  }

  async generateRefreshToken(id: number): Promise<string> {
    const payload: IJwtPayload = { sub: id };

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRESIN'),
    });
    return refreshToken;
  }

  async generateTokenPair(id: number): Promise<IJwtTokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(id),
      this.generateRefreshToken(id),
    ]);
    return { accessToken, refreshToken };
  }

  async validRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const decoded = this.jwtService.verify(refreshToken);
    //todo check session
    // const session = await this.sessionService.findByRefreshToken(refreshToken);
    // if (decoded && session) {
    //   return this.usersService.findById(decoded.sub);
    // }
    // return null;
    return !!decoded;
  }

  async refreshToken(oldRefreshToken: string): Promise<IJwtTokenPair> {
    const decoded = this.jwtService.verify(oldRefreshToken);

    const { accessToken, refreshToken } = await this.generateTokenPair(
      decoded.sub,
    );

    return { accessToken, refreshToken };
  }
}
