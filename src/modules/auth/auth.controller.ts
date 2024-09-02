import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Serialize, SerializeInterceptor } from 'src/commons/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { AuthDto } from './dto/auth.dto';
import { RefreshJwtGuard } from '../../commons/guards/refresh.guard';
import { JwtGuard } from 'src/commons/guards/jwt.guard';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/commons/guards/access-token.guard';

@Serialize(UserDto)
@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async signin(@Body() authDto: AuthDto) {
    return await this.authService.signIn(authDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req:Request) {
    this.authService.logout(req.user['sub']);
  }
}
