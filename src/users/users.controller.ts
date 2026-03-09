import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
export class UsersController {
    constructor(private prisma: PrismaService) { }

    @Get(':id/profile')
    async getProfile(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: +id },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                avatar: true,
                signature: true,
                createdAt: true,
                _count: {
                    select: {
                        threads: true,
                        posts: true,
                        marketItems: true,
                    }
                },
                threads: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        category: { select: { name: true, icon: true } },
                        _count: { select: { posts: true } }
                    }
                },
                marketItems: {
                    take: 6,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        seller: { select: { username: true } }
                    }
                }
            }
        });

        if (!user) {
            throw new NotFoundException('User not found in the Loom');
        }

        return user;
    }
}
