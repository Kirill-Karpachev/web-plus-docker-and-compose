import { Module } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  controllers: [OffersController],
  providers: [OffersService],
  imports: [TypeOrmModule.forFeature([Offer]), WishesModule],
  exports: [OffersService],
})
export class OffersModule {}
