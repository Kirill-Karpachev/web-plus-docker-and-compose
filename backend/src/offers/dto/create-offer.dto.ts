import { IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
