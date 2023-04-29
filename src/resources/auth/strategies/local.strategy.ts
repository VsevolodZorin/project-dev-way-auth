import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { backendMessage } from 'src/shared/backend.messages';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // 'username' by default
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateLocalUser(email, password);

    if (!user) {
      throw new UnauthorizedException(backendMessage.EMAIL_OR_PASSWORD_WRONG);
      // throw new BadRequestException(backendMessage.EMAIL_OR_PASSWORD_WRONG);
    }

    return user;
  }
}
