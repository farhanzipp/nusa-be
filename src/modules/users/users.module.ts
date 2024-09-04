import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import HashPassword from '../../commons/utils/hash-password.util';
import { JwtService } from '@nestjs/jwt';
import UserRepository from 'src/repositories/user.repository';


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService, 
    UserRepository, 
    HashPassword, 
    JwtService,
  ],
})
export class UsersModule {}
