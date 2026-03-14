import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MarketService } from './market.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('market')
export class MarketController {
    constructor(private readonly marketService: MarketService) { }

    @Get('items')
    getItems() {
        return this.marketService.getItems();
    }

    @Get('items/:id')
    getItem(@Param('id') id: string) {
        return this.marketService.getItem(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('items')
    createItem(@Request() req: any, @Body() body: any) {
        return this.marketService.createItem({
            title: body.title,
            description: body.description,
            price: +body.price,
            image: body.image,
            sellerId: req.user.userId
        });
    }
}
