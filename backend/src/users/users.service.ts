import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(emailOrUsername: string) {
        return this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername },
                    { username: emailOrUsername }
                ]
            }
        });
    }

    async findById(id: number) {
        return this.prisma.user.findUnique({
            where: { id }
        });
    }

    async create(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({
            data,
        });
    }

    async getSessionProfile(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                avatar: true,
                signature: true,
            },
        });
    }

    async getPublicProfile(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                role: true,
                avatar: true,
                signature: true,
                createdAt: true,
                _count: {
                    select: {
                        threads: true,
                        posts: true,
                        marketItems: true,
                    },
                },
                threads: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        category: { select: { name: true, icon: true } },
                        _count: { select: { posts: true } },
                    },
                },
                marketItems: {
                    take: 6,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        price: true,
                    },
                },
            },
        });
    }

    async getPrivateProfile(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
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
                    },
                },
                threads: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        category: { select: { name: true, icon: true } },
                        _count: { select: { posts: true } },
                    },
                },
                marketItems: {
                    take: 6,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        price: true,
                    },
                },
            },
        });
    }
}
