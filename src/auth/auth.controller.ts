import {
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { ApiBody, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/decorators/user.decorator';
import { AuthService } from './auth.service';
import { JwtRefreshToken } from './decorators/jwt-token.decorator';
import { LoginUserLocalDto } from './dto/login-user-local.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local.guard';

@ApiCookieAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserLocalDto })
  async login(@User('id') id, @Res() res) {
    const accessToken = await this.authService.generateAccessToken(id);
    const refreshToken = await this.authService.generateRefreshToken(id);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return res.send({ accessToken });
  }

  // @Post('/register')
  // @ApiBody({ type: CreateUserDto })
  // register(@Body() dto: CreateUserDto) {
  //   return this.authService.register(dto);
  // }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() req, @Res() res, @JwtRefreshToken() oldRefreshToken) {
    // todo check correct execution
    if (!oldRefreshToken) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken } = await this.authService.refreshToken(
      oldRefreshToken,
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return res.send({ accessToken });
  }
}
