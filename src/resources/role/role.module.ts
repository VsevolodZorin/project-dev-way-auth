import { Module } from '@nestjs/common';
import { RolesGuard } from 'src/resources/auth/guards/roles.guard';
import { RoleController } from './role.controller';
import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtWrapperModule } from 'src/services/jwt/jwt-wrapper.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), JwtWrapperModule],
  controllers: [RoleController],
  providers: [RoleService, RolesGuard],
  exports: [RoleService],
})
export class RoleModule {}
