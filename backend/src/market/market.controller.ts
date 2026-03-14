import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { MarketService } from './market.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMarketItemDto } from './dto/create-market-item.dto';

@Controller('market')
export class MarketController {
    constructor(private readonly marketService: MarketService) { }

    @Get('items')
    getItems() {
        return this.marketService.getItems();
    }

    @Get('items/:id')
    getItem(@Param('id', ParseIntPipe) id: number) {
        return this.marketService.getItem(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('items')
    createItem(@Request() req: any, @Body() body: CreateMarketItemDto) {
        return this.marketService.createItem({
            title: body.title,
            description: body.description,
            price: body.price,
            image: body.image,
            sellerId: req.user.userId
        });
    }
}
