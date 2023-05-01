import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('sessions')
@Unique(['userId'])
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({
    description: 'Primary key. Auto incrementing int',
    example: 1,
  })
  @Column()
  userId: number;

  @ApiProperty({
    description: 'Jwt access token',
    example: 'jwt token',
  })
  @Column()
  refreshToken: string;
}
