import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import HashPassword from 'src/commons/utils/hash-password.util';
import { Role } from 'src/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import UserRepository from 'src/repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashPassword: HashPassword
  ) {}

  async init() {
    const user = new CreateUserDto();
    user.username = 'superadmin';
    user.email = 'superadmin@admin.com';
    user.password = await this.hashPassword.generate('superadmin');
    user.roles = [Role.SUPER_ADMIN];
    const username = await this.userRepository.findOneUserByUsername(user.username);
    if (username === null) {
      await this.userRepository.createUser(user);
    }
    console.log('superadmin created!!');
  }
  
  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userRepository.createUser({...createUserDto});
    return newUser;
  }

  async findAll() {
    return await this.userRepository.findAllUsers();
  }

  async findOneById(id: number) {
    return await this.userRepository.findOneUserById(id);
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOneUserByUsername(username);
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneUserByEmail(email);
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.updateUser(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.removeUser(id);
  }
}
