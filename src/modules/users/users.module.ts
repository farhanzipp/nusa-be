import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import UserRepository from '../../repositories/user.repository.ts/user.repository';
import HashPassword from '../../utils/hash-password.util';


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, HashPassword],
})
export class UsersModule {}
