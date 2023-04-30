import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { RoleEntity } from 'src/resources/role/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEnum } from './types/role.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const role = await this.findByName(createRoleDto.name);
    if (role) {
      // todo check correct error
      throw new UnprocessableEntityException(
        `Role with name ${createRoleDto.name} already exists`,
      );
    }

    const newRole = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(newRole);
  }

  async findAll(): Promise<RoleEntity[]> {
    return await this.roleRepository.find();
  }

  async findById(id: number): Promise<RoleEntity> {
    return await this.roleRepository.findOneBy({ id });
  }

  async findByName(name: string): Promise<RoleEntity> {
    return await this.roleRepository.findOneBy({ name });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<RoleEntity> {
    const role = await this.findById(id);
    if (!role) {
      // todo check correct error
      throw new NotFoundException('Role not found');
    }
    return this.roleRepository.remove(role);
  }
}
