import {
  Controller,
  Post,
  Get,
  Req,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Req() req, @Body() dto: CreateOfferDto) {
    const user = req.user;
    return this.offersService.create(user, dto);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOfferById(@Param('id') id: string) {
    return this.offersService.findOfferById(+id);
  }
}
