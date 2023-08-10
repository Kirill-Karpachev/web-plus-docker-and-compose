import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(dto: CreateWishlistDto, user: User): Promise<Wishlist> {
    const items = await this.wishesService.findMany(dto.itemsId);

    const wishlist = this.wishlistRepository.create({
      ...dto,
      items,
      owner: user,
    });

    return await this.wishlistRepository.save(wishlist);
  }

  async findMany(): Promise<Wishlist[]> {
    return await this.wishlistRepository.find({
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  async findWishlistById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: { items: true, owner: true },
    });

    delete wishlist.owner.password;
    delete wishlist.owner.email;
    return wishlist;
  }

  async updateWishlist(
    user: User,
    dto: UpdateWishlistDto,
    wishlistId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.findWishlistById(wishlistId);
    if (user.id !== wishlist.owner.id) {
      throw new ForbiddenException('Этот список желаний другого пользователя');
    }

    const wishes = await this.wishesService.findMany(dto.itemsId);

    return await this.wishlistRepository.save({
      ...wishlist,
      name: dto.name,
      image: dto.image,
      items: wishes,
    });
  }

  async remove(wishlistId: number, userId: number) {
    const wishlist = await this.findWishlistById(wishlistId);
    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException('Этот список желаний другого пользователя');
    }
    await this.wishlistRepository.delete(wishlistId);
    return wishlist;
  }
}
