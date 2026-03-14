import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('forums')
export class ForumsController {
    constructor(private readonly forumsService: ForumsService) { }

    @Get('categories')
    getCategories() {
        return this.forumsService.getCategories();
    }

    @Get('latest-threads')
    getLatestThreads() {
        return this.forumsService.getLatestThreads(3);
    }

    @UseGuards(JwtAuthGuard)
    @Post('categories')
    createCategory(@Body() body: any) {
        return this.forumsService.createCategory(body);
    }

    @Get('categories/:id/threads')
    getThreadsByCategory(@Param('id') id: string) {
        return this.forumsService.getThreadsByCategory(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('threads')
    createThread(@Request() req: any, @Body() body: any) {
        return this.forumsService.createThread({
            title: body.title,
            content: body.content,
            categoryId: +body.categoryId,
            authorId: req.user.userId
        });
    }

    @Get('threads/:id')
    getThread(@Param('id') id: string) {
        return this.forumsService.getThread(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('threads/:id/posts')
    createPost(@Request() req: any, @Param('id') id: string, @Body() body: any) {
        return this.forumsService.createPost({
            content: body.content,
            threadId: +id,
            authorId: req.user.userId
        });
    }
}
