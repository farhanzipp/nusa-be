import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

import { AccessTokenGuard } from '../../commons/guards/access-token.guard';
import { RefreshTokenGuard } from '../../commons/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    return await this.authService.login(authDto);
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  logout(@Request() req) {
    this.authService.logout(req.user['sub']);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Request() req) {
    return await this.authService.refresh(req.user.sub, req.user.refreshToken);
  }
}
