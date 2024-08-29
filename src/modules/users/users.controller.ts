import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Serialize } from '../../commons/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { JwtGuard } from '../../commons/guards/jwt.guard';
import { RolesGuard } from '../../commons/guards/roles.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

@Controller('users')
@UseGuards(JwtGuard, RolesGuard)
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN)
  async findAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getUserProfile(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

}
