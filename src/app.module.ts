import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfigFactory } from './config/orm.config';
import { telegramConfigFactory } from './config/telegram.config';
import { AuthModule } from './resources/auth/auth.module';
import { RoleModule } from './resources/role/role.module';
import { SessionModule } from './resources/session/sessoin.module';
import { UserModule } from './resources/user/user.module';
import { TelegramModule } from './services/telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: telegramConfigFactory,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfigFactory,
    }),
    UserModule,
    AuthModule,
    SessionModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
