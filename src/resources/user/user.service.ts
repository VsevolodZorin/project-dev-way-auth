import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { SessionService } from '../session/session.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private sessionService: SessionService,
  ) {}

  /**
   * @description Validate user by id. Return without password
   */
  async validateUserById(id: number): Promise<UserEntity> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async validateUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  /**
   * @description Validate user by email and password. Return without password
   */
  async validateLocalUser(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.validateUserByEmail(email);
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!user || !isCorrectPassword) {
      throw new UnprocessableEntityException('Email or password is incorrect');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.findByEmail(createUserDto.email);

    if (user) {
      throw new UnprocessableEntityException('Email already exists');
    }

    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async getProfile(id: number): Promise<UserEntity> {
    const user = await this.validateUserById(id);
    delete user.password;
    return user;
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find(); // select * from user
  }

  private findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id });
  }

  private findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.validateUserById(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<UserEntity> {
    const user = await this.validateUserById(id);
    const [deleteSessionResult, deleteUserResult] = await Promise.all([
      this.sessionService.deleteByUserId(id),
      this.userRepository.remove(user),
    ]);
    return deleteUserResult;
  }
}
