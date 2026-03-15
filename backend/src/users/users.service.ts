import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(emailOrUsername: string) {
        const normalized = emailOrUsername.trim();
        const emailMatch = await this.findByEmail(normalized);
        if (emailMatch) {
            return emailMatch;
        }

        return this.findByUsernameInsensitive(normalized);
    }

    async findById(id: number) {
        return this.prisma.user.findUnique({
            where: { id }
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() },
        });
    }

    async findByUsernameInsensitive(username: string) {
        const loweredUsername = username.trim().toLowerCase();
        const result = await this.prisma.$queryRaw<User[]>`
            SELECT * FROM "User"
            WHERE lower("username") = ${loweredUsername}
            LIMIT 1
        `;

        return result[0] ?? null;
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

    async findByVerificationTokenHash(tokenHash: string) {
        return this.prisma.user.findFirst({
            where: {
                emailVerificationTokenHash: tokenHash,
            },
        });
    }

    async updateVerification(userId: number, tokenHash: string | null, expiresAt: Date | null) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                emailVerificationTokenHash: tokenHash,
                emailVerificationExpiresAt: expiresAt,
            },
        });
    }

    async markEmailVerified(userId: number) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                emailVerifiedAt: new Date(),
                emailVerificationTokenHash: null,
                emailVerificationExpiresAt: null,
            },
        });
    }
}
