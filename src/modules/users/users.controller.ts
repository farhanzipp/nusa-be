import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AccessTokenGuard } from 'src/commons/guards/access-token.guard';
import { Serialize } from 'src/commons/decorators/serialize.decorator';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async findAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getUserProfile(@Param('id') id: number) {
    return this.usersService.findOneById(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async updateUser(@Param('id') id: number, @Body() updateUserDto: any) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  removeUser(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }
}
