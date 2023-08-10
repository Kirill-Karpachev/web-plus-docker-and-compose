import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from '../guards/local.guard';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    const userByEmail = await this.usersService.findUserByEmail(dto.email);
    const userByUsername = await this.usersService.findUserByUsername(
      dto.username,
    );

    if (userByEmail || userByUsername) {
      throw new BadRequestException('Этот пользователь уже существует');
    }

    return this.usersService.create(dto);
  }

  @UseGuards(LocalGuard)
  @HttpCode(200)
  @Post('signin')
  async signin(@Req() req: { user }) {
    return await this.authService.login(req.user);
  }
}
