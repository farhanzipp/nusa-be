import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import HashPassword from 'src/commons/utils/hash-password.util';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly hashPassword: HashPassword,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findOneByUsername(createUserDto.username);
    
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.hashPassword.generate(createUserDto.password);
    
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword
    })

    const tokens = await this.getTokens(newUser.id, newUser.username, newUser.roles);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(authDto: AuthDto) {
    const user = await this.usersService.findOneByEmail(authDto.email);
    if(!user) throw new BadRequestException('User does not exist');

    const passwordMatched = await compare(authDto.password, user.password);
    if(!passwordMatched) throw new BadRequestException('Password is Incorrect');

    const tokens = await this.getTokens(user.id, user.username, user.roles);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    const result = {...user, ...tokens};
    return result;
  }

  async logout(userId: number) {
    return this.usersService.update(userId, {refreshToken: null});
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashPassword.generate(refreshToken);
    await this.usersService.update(userId, {refreshToken: hashedRefreshToken});
  }

  async getTokens(userId: number, username: string, roles: Role[]) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          roles,
        },
        {
          expiresIn: '1h',
          secret: process.env.JWT_SECRET_KEY
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          roles,
        },
        {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_TOKEN_KEY
        }
      )
    ])

    return {
      accessToken,
      refreshToken
    }
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.usersService.findOneById(userId);
    if(!user || !user.refreshToken) throw new UnauthorizedException('Access Denied');

    const refreshTokenMatched = await compare(refreshToken, user.refreshToken);
    if(!refreshTokenMatched) throw new UnauthorizedException('Access Denied');
    
    const tokens = await this.getTokens(user.id, user.username, user.roles);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

}
