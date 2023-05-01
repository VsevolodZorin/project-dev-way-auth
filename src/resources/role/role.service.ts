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

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async validateRoleById(id: number): Promise<RoleEntity> {
    const role = await this.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async validateRoleByName(name: string): Promise<RoleEntity> {
    const role = await this.findByName(name);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const role = await this.validateRoleByName(createRoleDto.name);
    if (role.name === createRoleDto.name) {
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

  private async findById(id: number): Promise<RoleEntity> {
    return await this.roleRepository.findOneBy({ id });
  }

  private async findByName(name: string): Promise<RoleEntity> {
    return await this.roleRepository.findOneBy({ name });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.validateRoleById(id);

    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<RoleEntity> {
    const role = await this.validateRoleById(id);
    return this.roleRepository.remove(role);
  }
}
