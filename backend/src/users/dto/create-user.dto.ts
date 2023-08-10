import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @Length(2, 200)
  @IsOptional()
  about: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
