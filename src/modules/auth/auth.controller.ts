import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Serialize, SerializeInterceptor } from 'src/commons/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { LoginDto } from './dto/auth.dto';
<<<<<<< Updated upstream
import { RefreshJwtGuard } from 'src/commons/guards/refresh.guard';
=======
import { RefreshJwtGuard } from '../../commons/guards/refresh.guard';
import { JwtGuard } from 'src/commons/guards/jwt.guard';
>>>>>>> Stashed changes

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Serialize(UserDto)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Serialize(UserDto)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Get('whoami')
  @UseGuards(JwtGuard)
  async whoami(@Request() request) {
    return await this.authService.whoami(request.user);
  }

  @Post('refresh')
<<<<<<< Updated upstream
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user);
=======
  @UseGuards(RefreshJwtGuard)
  async refreshToken(@Request() request) {
    return await this.authService.refreshToken(request.user);
>>>>>>> Stashed changes
  }
}
