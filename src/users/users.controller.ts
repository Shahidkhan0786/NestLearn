import { Body, Controller, Post,Param,Get} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private user:UsersService){}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.user.create(body.email , body.password);
  }

  @Get('/:id')
  findUser(@Param() param){
    return this.user.findOne(param.id);
  }

  findAllUsers(){

  }

  updateUser(){}

  removeUser(){}
}
