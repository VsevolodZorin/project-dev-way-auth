import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserLocalDto } from './dto/login-user-local.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/resources/user/decorators/user.decorator';
import { CreateUserDto } from 'src/resources/user/dto/create-user.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtToken } from './decorators/jwt-token.decorator';

@ApiCookieAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginUserLocalDto })
  async login(@Body() loginUserDto: LoginUserLocalDto) {
    const tokenPair = await this.authService.login(loginUserDto);
    return tokenPair;
  }

  @Post('/registration')
  @ApiBody({ type: CreateUserDto })
  async registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@User() user, @JwtToken() token: string) {
    console.log('refresh', { token });

    return this.authService.refresh(user, token);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@User('id') userId: number) {
    return this.authService.logout(userId);
  }
}
