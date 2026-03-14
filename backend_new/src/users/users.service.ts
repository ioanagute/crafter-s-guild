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
}
