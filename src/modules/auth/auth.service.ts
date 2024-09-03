import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import HashPassword from 'src/commons/utils/hash-password.util';
import { Role } from 'src/enums/role.enum';
import { UserEntity } from 'src/entities/user.entity';
import { JwtPayload } from 'src/commons/types/jwt-payload.type';
import { Token } from 'src/commons/types/token.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly hashPassword: HashPassword,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findOneByUsername(createUserDto.username);
    
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.hashPassword.generate(createUserDto.password);
    
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword
    })

    const tokens = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async signin(authDto: AuthDto) {
    const user = await this.usersService.findOneByEmail(authDto.email);
    if(!user) throw new BadRequestException('User does not exist');

    const passwordMatched = await compare(authDto.password, user.password);
    if(!passwordMatched) throw new BadRequestException('Password is Incorrect');

    const token = await this.getTokens(user);
    await this.updateRefreshToken(user.id, token.refresh_token);
    
    const response = {...user, token};
    return response;
  }

  async logout(userId: number) {
    return this.usersService.update(userId, {refresh: null});
  }

  async refresh(id: number, token: string): Promise<Token> {
    const user = await this.usersService.findOneById(id);
    if (!user || !user.refresh)
      throw new ForbiddenException('Security token did not match');

    const matches = await this.hashPassword.compare(token, user.refresh);
    if (!matches) throw new ForbiddenException('Security token did not match');

    const tokens = await this.getTokens(user);
    return tokens;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashPassword.generate(refreshToken);
    await this.usersService.update(userId, {refresh: hashedRefreshToken});
  }

  async getTokens(user: UserEntity): Promise<Token> {
    const jwtPayload: JwtPayload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_TIME ?? '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_TIME ?? '7d',
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

}
