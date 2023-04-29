import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/resources/user/user.service';
import { backendMessage } from 'src/shared/backend.messages';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email', // 'username' by default
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.validateLocalUser(email, password);

    if (!user) {
      throw new UnauthorizedException(backendMessage.EMAIL_OR_PASSWORD_WRONG);
      // throw new BadRequestException(backendMessage.EMAIL_OR_PASSWORD_WRONG);
    }

    return user;
  }
}
