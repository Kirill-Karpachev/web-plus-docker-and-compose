import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, UpdateResult } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  findAll() {
    return this.wishesRepository.find();
  }

  async findLastWishes(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['owner'],
      take: 40,
    });

    for (const wish of wishes) {
      delete wish.owner.password;
      delete wish.owner.email;
    }

    return wishes;
  }

  async findTopWishes(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      order: {
        copied: 'DESC',
      },
      relations: ['owner'],
      take: 20,
    });

    for (const wish of wishes) {
      delete wish.owner.password;
      delete wish.owner.email;
    }

    return wishes;
  }

  async create(owner: User, dto: CreateWishDto): Promise<Wish> {
    return await this.wishesRepository.save({
      ...dto,
      owner: owner,
    });
  }

  async findWishById(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wish) throw new NotFoundException('Подарок не найден');

    delete wish.owner.password;
    delete wish.owner.email;

    return wish;
  }

  async findWishesByUserId(id: number): Promise<Wish[]> {
    return await this.wishesRepository.find({
      where: { owner: { id } },
      relations: {
        owner: {
          wishes: true,
          wishlists: true,
        },
        offers: {
          user: true,
          item: true,
        },
      },
    });
  }

  async updateWish(id: number, dto: UpdateWishDto, userId: number) {
    const wish = await this.findWishById(id);

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Это желание другого пользователя');
    }
    if (wish.raised > 0 && wish.price !== undefined) {
      throw new ConflictException('Обновление запрещено');
    }

    return await this.wishesRepository.update(id, dto);
  }

  async updateByRaised(id: number, newRaised: number): Promise<UpdateResult> {
    return await this.wishesRepository.update({ id }, { raised: newRaised });
  }

  async removeWishes(wishId: number, userId: number) {
    const wish = await this.findWishById(wishId);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Это желание другого пользователя');
    }
    if (wish.raised > 0 && wish.price !== undefined) {
      throw new ConflictException('Удаление запрещено');
    }
    await this.wishesRepository.delete(wishId);
    return wish;
  }

  findMany(items: number[]): Promise<Wish[]> {
    return this.wishesRepository.findBy({ id: In(items) });
  }

  async copyWish(wishId: number, user: User) {
    const wish = await this.findWishById(wishId);
    if (user.id === wish.owner.id) {
      throw new ForbiddenException('Желание уже есть в вашем списке');
    }
    await this.wishesRepository.update(wishId, {
      copied: (wish.copied += 1),
    });

    const wishCopy = {
      ...wish,
      raised: 0,
      owner: user.id,
      offers: [],
    };
    await this.create(user, wishCopy);
    return {};
  }
}
