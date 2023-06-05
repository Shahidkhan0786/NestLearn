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
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { updateUserDto } from './dtos/update-user.dto';
// import { SerializeInterceptor } from './interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { Serialize } from './interceptors/serialize.interceptor';
import { AuthService } from './auth.service';

@Controller('auth')
export class UsersController {
  constructor(private user: UsersService, private authService: AuthService) {}
  @Serialize(UserDto)
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Serialize(UserDto)
  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
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
