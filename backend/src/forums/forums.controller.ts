import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateThreadDto } from './dto/create-thread.dto';
import { GetThreadsQueryDto } from './dto/get-threads-query.dto';

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

    @Get('threads')
    getThreads(@Query() query: GetThreadsQueryDto) {
        return this.forumsService.getThreads(query.categoryId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post('categories')
    createCategory(@Body() body: CreateCategoryDto) {
        return this.forumsService.createCategory(body);
    }

    @Get('categories/:id/threads')
    getThreadsByCategory(@Param('id', ParseIntPipe) id: number) {
        return this.forumsService.getThreadsByCategory(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('threads')
    createThread(@Request() req: any, @Body() body: CreateThreadDto) {
        return this.forumsService.createThread({
            title: body.title,
            content: body.content,
            categoryId: body.categoryId,
            authorId: req.user.userId
        });
    }

    @Get('threads/:id')
    getThread(@Param('id', ParseIntPipe) id: number) {
        return this.forumsService.getThread(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('threads/:id/posts')
    createPost(@Request() req: any, @Param('id', ParseIntPipe) id: number, @Body() body: CreatePostDto) {
        return this.forumsService.createPost({
            content: body.content,
            threadId: id,
            authorId: req.user.userId
        });
    }
}
