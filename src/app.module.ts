import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfigFactory } from './config/orm.config';
import { telegramConfigFactory } from './config/telegram.config';
import { TelegramModule } from './services/telegram/telegram.module';
import { UserModule } from './user/user.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
