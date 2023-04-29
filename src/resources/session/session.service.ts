import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionEntity } from './session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {}

  /**
   * @description 1 user can have only 1 session. Login only 1 device. Login another device will invalidate the previous session
   */
  async create(createSessionDto: CreateSessionDto): Promise<SessionEntity> {
    const currentSession = await this.findByUserId(createSessionDto.userId);
    if (currentSession) {
      return await this.update(createSessionDto);
    }
    const newSession = this.sessionRepository.create(createSessionDto);
    return await this.sessionRepository.save(newSession);
  }

  async findByUserId(userId: number): Promise<SessionEntity> {
    return await this.sessionRepository.findOneBy({ userId });
  }

  async findByRefreshToken(refreshToken: string): Promise<SessionEntity> {
    return await this.sessionRepository.findOneBy({ refreshToken });
  }

  async update(updateSessionDto: CreateSessionDto): Promise<SessionEntity> {
    const session = await this.findByUserId(updateSessionDto.userId);
    Object.assign(session, updateSessionDto);
    return this.sessionRepository.save(session);
  }

  async delete(userId: number): Promise<DeleteResult> {
    const session = await this.findByUserId(userId);
    return this.sessionRepository.delete(session);
  }
}
