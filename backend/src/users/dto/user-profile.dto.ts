import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class UserProfileDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  about: string;

  @IsString()
  avatar: string;

  @IsEmail()
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  static getUserProfile(user: User): UserProfileDto {
    const { id, username, about, avatar, email, createdAt, updatedAt } = user;
    return {
      id,
      username,
      about,
      avatar,
      email,
      createdAt,
      updatedAt,
    };
  }
}
