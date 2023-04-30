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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { Role } from '../role/decorators/roles.decorator';
import { RolesEnum } from '../role/types/role.enum';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@User() user): Promise<UserEntity> {
    return this.userService.validateUserById(user.id);
  }

  @Post()
  @Role(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Role(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Role(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.validateUserById(+id);
  }

  @Patch(':id')
  @Role(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Role(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.delete(+id);
  }
}
