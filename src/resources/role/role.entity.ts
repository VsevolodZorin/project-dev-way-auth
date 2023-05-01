import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('roles')
export class RoleEntity {
  @ApiProperty({
    description: 'Primary key. Auto incrementing int',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'role name',
    example: 'admin or user',
  })
  @Column()
  name: string;
}
