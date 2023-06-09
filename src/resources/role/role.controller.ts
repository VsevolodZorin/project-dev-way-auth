import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/resources/role/decorators/roles.decorator';
import { RoleEntity } from 'src/resources/role/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';
import { RolesEnum } from './types/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Role(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @Role(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<RoleEntity[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Role(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: string) {
    return this.roleService.validateRoleById(Number(id));
  }

  @Patch(':id')
  @Role(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(Number(id), updateRoleDto);
  }

  @Delete(':id')
  @Role(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.roleService.remove(Number(id));
  }
}
