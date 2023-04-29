import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('sessions')
@Unique(['userId'])
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  refreshToken: string;
}
