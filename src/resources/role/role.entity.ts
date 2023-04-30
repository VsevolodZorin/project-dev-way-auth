import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { RolesEnum } from './types/role.enum';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
