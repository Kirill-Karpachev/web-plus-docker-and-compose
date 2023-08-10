import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER || 'student',
  password: process.env.POSTGRES_PASSWORD || 'student',
  database: process.env.POSTGRES_DB || 'nest_project',
  entities: [User, Wish, Wishlist, Offer],
  synchronize: true,
};
