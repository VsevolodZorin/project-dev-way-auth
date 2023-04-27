import { ApiProperty } from '@nestjs/swagger';
import { hash } from 'bcrypt';
import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
export class UserEntity {
  @ApiProperty({
    description: 'Primary key. Auto incrementing int',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'set user name or take from google account',
    example: 'testUser',
    default: 'testUser',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'local email',
    example: 'example@example.com',
    default: 'example@example.com',
  })
  @Column()
  email: string;

  @ApiProperty({
    description: 'local password',
    example: 'Password@123',
    default: 'Password@123',
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'user or admin',
    example: 'user',
    default: 'user',
  })
  @Column({ default: 'user' })
  role: string;

  @ApiProperty({
    description: 'email activation status',
    example: false,
  })
  @Column({ default: false })
  isActivated: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
