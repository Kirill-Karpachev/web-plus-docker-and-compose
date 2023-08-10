import {
  Body,
  Patch,
  Controller,
  Get,
  Req,
  Param,
  NotFoundException,
  UseGuards,
  Post,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UserPublicProfileDto } from './dto/user-public-profile.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  async getUser(@Req() req: { user }) {
    const userProfile = await this.usersService.findUserById(req.user?.id);
    if (!userProfile) {
      throw new NotFoundException('Пользователь не найден');
    }
    return UserProfileDto.getUserProfile(userProfile);
  }

  @Patch('me')
  async updateUser(@Req() req: { user: User }, @Body() dto: UpdateUserDto) {
    return await this.usersService.updateById(req.user.id, dto);
  }

  @Get('me/wishes')
  async getUserWishes(@Req() { user }: { user: User }): Promise<Wish[]> {
    return await this.wishesService.findWishesByUserId(user.id);
  }

  @Get(':username')
  async getUserByUsername(
    @Param('username') username,
  ): Promise<UserPublicProfileDto> {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return UserPublicProfileDto.getUserPublicProfile(user);
  }

  @Get(':username/wishes')
  async findWishesByUserName(@Param('username') username: string) {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return await this.wishesService.findWishesByUserId(user.id);
  }

  @Post('find')
  public async findMany(@Body() user): Promise<User[]> {
    return this.usersService.findMany(user);
  }
}
