import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtWrapperService } from 'src/services/jwt/jwt-wrapper.service';
import { IJwtTokenPair } from 'src/services/jwt/types/jwt-tokenPair.interface';
import { LoginUserLocalDto } from './dto/login-user-local.dto';
import { backendMessage } from 'src/shared/backend.messages';
import { IJwtPayload } from 'src/services/jwt/types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtWrapperService: JwtWrapperService,
  ) {}

  async login(loginUserLocalDto: LoginUserLocalDto): Promise<IJwtTokenPair> {
    // TODO
    // this.mailService.sendActivationMail('vsevolod.dev@gmail.com');

    const user = await this.userService.validateLocalUser(
      loginUserLocalDto.email,
      loginUserLocalDto.password,
    );

    if (!user) {
      throw new UnprocessableEntityException(
        backendMessage.UNPROCESSABLE_ENTITY,
      );
    }

    return this.jwtWrapperService.generateTokenPair(user);
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

    return tokenPair;
  }

  refresh() {
    // todo
    return 'refresh';
  }

  logout(userId: number) {
    return this.jwtWrapperService.deleteSession(userId);
  }
}
