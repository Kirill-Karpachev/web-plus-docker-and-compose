import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Get('top')
  getTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateWishDto): Promise<Wish> {
    return this.wishesService.create(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findWishById(@Param('id') id: string) {
    return this.wishesService.findWishById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateWish(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateWishDto,
  ) {
    return await this.wishesService.updateWish(+id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    return this.wishesService.removeWishes(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Req() req) {
    return this.wishesService.copyWish(id, req.user);
  }
}
