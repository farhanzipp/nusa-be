import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Serialize } from 'src/commons/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { AuthDto } from './dto/auth.dto';

import { AccessTokenGuard } from '../../commons/guards/access-token.guard';
import { RefreshTokenGuard } from '../../commons/guards/refresh-token.guard';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @Post('signin')
  async signin(@Body() authDto: AuthDto) {
    return await this.authService.signin(authDto);
  }

  @Get('logout')
  @UseGuards(AccessTokenGuard)
  logout(@Request() req) {
    this.authService.logout(req.user['sub']);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Request() req) {
    // return await this.authService.refresh(req.user.sub, req.user.refresh_token);
    return await req.user;
  }
}
