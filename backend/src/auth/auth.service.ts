import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) throw new UnauthorizedException('Пользователь не найден');

    const correctPassword = await this.hashService.compare(
      password,
      user.password,
    );

    if (!correctPassword) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    delete user.password;
    return user;
  }

  async login(user) {
    const token = { sub: user.id };
    return { access_token: this.jwtService.sign(token) };
  }
}
