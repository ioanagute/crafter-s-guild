import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MarketService {
    constructor(private prisma: PrismaService) { }

    async getItems() {
        return this.prisma.marketItem.findMany({
            include: {
                seller: { select: { username: true, avatar: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async createItem(data: Prisma.MarketItemUncheckedCreateInput) {
        return this.prisma.marketItem.create({ data });
    }

    async getItem(id: number) {
        return this.prisma.marketItem.findUnique({
            where: { id },
            include: {
                seller: { select: { username: true, avatar: true, signature: true, role: true } }
            }
        });
    }
}
