import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.findByEmail(createUserDto.email);
    if (user) {
      throw new UnprocessableEntityException('Email already exists');
    }

    const newUser = this.userRepository.create(createUserDto);

    return this.userRepository.save(newUser);
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find(); // select * from user
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id });
  }
  findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<UserEntity> {
    const user = await this.findById(id);
    return this.userRepository.remove(user);
    // return this.userRepository.delete(id); // Promise<DeleteResult>
  }
}
