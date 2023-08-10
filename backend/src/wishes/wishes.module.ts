import { Module } from '@nestjs/common';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';

@Module({
  controllers: [WishesController],
  providers: [WishesService],
  imports: [TypeOrmModule.forFeature([Wish])],
  exports: [WishesService, WishesModule],
})
export class WishesModule {}
