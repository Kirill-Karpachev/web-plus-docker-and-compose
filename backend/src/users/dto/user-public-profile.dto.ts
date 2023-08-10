import { IsDate, IsNumber, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class UserPublicProfileDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  about: string;

  @IsString()
  avatar: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  static getUserPublicProfile(user: User): UserPublicProfileDto {
    const { id, username, about, avatar, createdAt, updatedAt } = user;
    return {
      id,
      username,
      about,
      avatar,
      createdAt,
      updatedAt,
    };
  }
}
