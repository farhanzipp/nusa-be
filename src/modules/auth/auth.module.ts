import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import HashPassword from 'src/commons/utils/hash-password.util';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import UserRepository from 'src/repositories/user.repository';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AccessTokenStrategy,
    AuthService,
    HashPassword,
    JwtService,
    RefreshTokenStrategy,
    UsersService,
    UserRepository,
  ],
})
export class AuthModule {}
