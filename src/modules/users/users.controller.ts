import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Serialize, SerializeInterceptor } from 'src/commons/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { JwtGuard } from '../../commons/guards/jwt.guard';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('users')
@UseGuards(JwtGuard, RolesGuard)
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @Roles(Role.USER)
  async getUserProfile(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

}
