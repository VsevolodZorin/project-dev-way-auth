import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './services/telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTelegramConfig } from './config/telegram.config';

@Module({
  imports: [
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTelegramConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
