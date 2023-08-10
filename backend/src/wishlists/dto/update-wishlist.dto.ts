import {
  Length,
  IsUrl,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  @IsOptional()
  @Length(1, 250)
  name: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  image: string;

  @IsString()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];

  // @IsOptional()
  // @IsString()
  // @Length(1, 1500)
  // description: string;
}
