import {
  Body,
  Controller,
  Post,
  Param,
  Get,
  Put,
  Delete,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { updateUserDto } from './dtos/update-user.dto';
// import { SerializeInterceptor } from './interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { Serialize } from './interceptors/serialize.interceptor';

@Controller('auth')
export class UsersController {
  constructor(private user: UsersService) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.user.create(body.email, body.password);
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.user.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  findAllUsers() {}

  @Put('/update/:id')
  updateUser(@Body() body: updateUserDto, @Param('id') id: string) {
    return this.user.update(parseInt(id), body);
  }

  @Delete('/delete/:id')
  removeUser(@Param('id') id: string) {
    return this.user.remove(parseInt(id));
  }
}
