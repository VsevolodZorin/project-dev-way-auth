import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { ApiBody, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtRefreshToken } from './decorators/jwt-token.decorator';
import { LoginUserLocalDto } from './dto/login-user-local.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { User } from 'src/resources/user/decorators/user.decorator';
import { CreateUserDto } from 'src/resources/user/dto/create-user.dto';

@ApiCookieAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserLocalDto })
  async login(@User('id') id) {
    const tokenPair = await this.authService.generateTokenPair(id);
    return tokenPair;
  }

  @Post('/registration')
  async registration(
    @Res() response: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const tokenPair = await this.authService.registration(createUserDto);
    // await this.telegramService.sendObject({
    //   message: 'registration local',
    //   ...createUserDto,
    // });
    return response.json({ accessToken: tokenPair.accessToken });
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Res() res, @JwtRefreshToken() oldRefreshToken) {
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
