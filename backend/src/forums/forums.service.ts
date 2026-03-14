import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ForumsService {
    constructor(private prisma: PrismaService) { }

    async getCategories() {
        return this.prisma.category.findMany({
            include: {
                _count: {
                    select: { threads: true }
                }
            }
        });
    }

    async createCategory(data: Prisma.CategoryCreateInput) {
        return this.prisma.category.create({ data });
    }

    async getThreads(categoryId?: number) {
        return this.prisma.thread.findMany({
            where: categoryId ? { categoryId } : undefined,
            include: {
                author: { select: { username: true, avatar: true } },
                category: { select: { name: true, icon: true } },
                posts: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        author: { select: { username: true } },
                    },
                },
                _count: { select: { posts: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async getThreadsByCategory(categoryId: number) {
        return this.getThreads(categoryId);
    }

    async createThread(data: Prisma.ThreadUncheckedCreateInput) {
        return this.prisma.thread.create({ data });
    }

    async getThread(id: number) {
        return this.prisma.thread.findUnique({
            where: { id },
            include: {
                category: { select: { name: true, icon: true } },
                author: { select: { username: true, avatar: true, signature: true, role: true } },
                posts: {
                    include: {
                        author: { select: { username: true, avatar: true, signature: true, role: true } }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
    }

    async createPost(data: Prisma.PostUncheckedCreateInput) {
        const post = await this.prisma.post.create({ data });
        // Update thread updatedAt to bump it
        await this.prisma.thread.update({
            where: { id: data.threadId },
            data: { updatedAt: new Date() }
        });
        return post;
    }

    async getLatestThreads(limit: number = 5) {
        return this.prisma.thread.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { username: true, avatar: true } },
                category: { select: { name: true, icon: true } },
                _count: { select: { posts: true } }
            }
        });
    }
}
