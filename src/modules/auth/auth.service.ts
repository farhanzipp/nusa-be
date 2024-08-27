import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/auth.dto';
import UserRepository from 'src/repositories/user.repository.ts/user.repository';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userRepository: UserRepository,
    private jwtService: JwtService
  ) {}
  async register(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if(user && (await compare(loginDto.password, user.password))) {
      const payload = { 
        username: user.username, 
        sub: {
          email: user.email
        },
      };

      return {
        ...user,
        tokens: {
          access_token: await this.jwtService.signAsync(payload, {
            expiresIn: '1h',
            secret: process.env.JWT_SECRET_KEY,
          }),
          refresh_token: await this.jwtService.signAsync(payload, {
            expiresIn: '7h',
            secret: process.env.JWT_REFRESH_TOKEN_KEY,
          })
        }
      };
    }

    throw new UnauthorizedException('Please check your login credentials');
  }

  async refreshToken(user:any) {
    const payload = {
      username: user.username,
      sub: {
        email: user.email
      },
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET_KEY,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7h',
        secret: process.env.JWT_REFRESH_TOKEN_KEY,
      })
    }
  }

}
