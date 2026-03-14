import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  getHello(): string {
    return 'Crafter\'s Guild API is weaving...';
  }

  async getStats() {
    const [members, threads, posts, marketItems] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.thread.count(),
      this.prisma.post.count(),
      this.prisma.marketItem.count(),
    ]);

    return {
      members,
      threads,
      posts: posts + threads, // Total posts = threads content + replies
      marketItems,
    };
  }
}
