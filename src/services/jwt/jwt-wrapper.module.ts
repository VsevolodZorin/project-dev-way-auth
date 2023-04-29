import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfigFactory } from 'src/config/jwt.config';
import { SessionModule } from 'src/resources/session/sessoin.module';
import { JwtWrapperService } from 'src/services/jwt/jwt-wrapper.service';

@Module({
  imports: [
    ConfigModule,
    SessionModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfigFactory,
    }),
  ],
  providers: [JwtWrapperService],
  exports: [JwtWrapperService],
})
export class JwtWrapperModule {}
