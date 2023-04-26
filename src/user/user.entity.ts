import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

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
    description: 'local email',
    example: 'test@gmail.com',
  })
  @Column()
  email: string;

  @ApiProperty({
    description: 'local password',
    example: '123456',
  })
  @Column()
  password: string;
}
