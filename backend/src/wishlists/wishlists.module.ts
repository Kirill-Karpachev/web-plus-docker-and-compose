import { Module } from '@nestjs/common';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { UsersModule } from 'src/users/users.module';
import { WishesModule } from 'src/wishes/wishes.module';
import { Wish } from 'src/wishes/entities/wish.entity';

@Module({
  controllers: [WishlistsController],
  providers: [WishlistsService],
  imports: [
    TypeOrmModule.forFeature([Wishlist, Wish]),
    UsersModule,
    WishesModule,
  ],
  exports: [WishlistsService],
})
export class WishlistsModule {}
