import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { JwtWrapperModule } from 'src/services/jwt/jwt-wrapper.module';
import { SessionModule } from 'src/resources/session/sessoin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtWrapperModule,
    SessionModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
