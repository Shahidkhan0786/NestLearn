import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable({})
export class AuthService {
  constructor(private user: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.user.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }
    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const user = await this.user.create(email, result);
    return user;
  }
  async signin(email: string, password: string) {
    const [user] = await this.user.find(email);
    const [salt, passwordhash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (passwordhash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
      // return user;
    }

    return user;
  }
}
