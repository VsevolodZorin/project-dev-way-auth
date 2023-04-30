import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/resources/user/user.module';
import { JwtWrapperModule } from 'src/services/jwt/jwt-wrapper.module';
import { SessionModule } from '../session/sessoin.module';

@Module({
  imports: [ConfigModule, UserModule, JwtWrapperModule, SessionModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
