import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@UseGuards(JwtAuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Get()
  findAllWishlist() {
    return this.wishlistsService.findMany();
  }

  @Get(':id')
  findWishlist(@Param('id') id: number) {
    return this.wishlistsService.findWishlistById(+id);
  }

  @Post()
  async create(@Req() req, @Body() dto: CreateWishlistDto) {
    return this.wishlistsService.create(dto, req.user);
  }

  @Patch(':id')
  async updateWishlist(
    @Body() dto: UpdateWishlistDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.wishlistsService.updateWishlist(req.user.id, dto, +id);
  }

  @Delete(':id')
  async removeWishlist(@Req() req, @Param('id') id: number) {
    return await this.wishlistsService.remove(id, req.user.id);
  }
}
