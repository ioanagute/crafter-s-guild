import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const url = process.env.DATABASE_URL?.replace('file:', '') || './dev.db';
        const adapter = new PrismaBetterSqlite3({ url });
        super({ adapter, log: ['query', 'info', 'warn', 'error'] });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Failed to connect to database:', error);
        }
    }
}
