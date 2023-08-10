import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { WishesModule } from 'src/wishes/wishes.module';
import { HashModule } from 'src/hash/hash.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), WishesModule, HashModule],
  exports: [UsersService],
})
export class UsersModule {}
