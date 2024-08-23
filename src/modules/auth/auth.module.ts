import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import HashPassword from 'src/utils/hash-password.util';
import UserRepository from 'src/repositories/user.repository.ts/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    UserRepository,
    HashPassword,
  ],
})
export class AuthModule {}
