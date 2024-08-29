import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import UserRepository from 'src/repositories/user.repository.ts/user.repository';
import HashPassword from 'src/commons/utils/hash-password.util';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashPassword: HashPassword
  ) {}
  async create(createUserDto: CreateUserDto) {
    const username = await this.userRepository.findByUsername(createUserDto.username);
    if (username) {
      throw new ConflictException('Username already exists');
    }

    const email = await this.userRepository.findByEmail(createUserDto.email);
    if (email) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.hashPassword.generate(createUserDto.password);

    const newUser = await this.userRepository.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser;
  }

  async findOne(id: number) {
    return await this.userRepository.findById(id);
  }

  async findAll() {
    return await this.userRepository.getAllUsers();
  }
}
