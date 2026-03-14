import { Controller, Get, NotFoundException, Param, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me/profile')
    async getMyProfile(@Request() req: any) {
        const user = await this.usersService.getPrivateProfile(req.user.userId);

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return user;
    }

    @Get(':id/profile')
    async getProfile(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.getPublicProfile(id);

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return user;
    }
}
