import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Get()
    getEvents() {
        return this.eventsService.getEvents();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createEvent(@Body() body: any) {
        return this.eventsService.createEvent({
            title: body.title,
            description: body.description,
            date: new Date(body.date),
            location: body.location
        });
    }

    @Get(':id')
    getEvent(@Param('id') id: string) {
        return this.eventsService.getEvent(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/rsvp')
    rsvp(@Request() req: any, @Param('id') id: string) {
        return this.eventsService.rsvp(+id, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/rsvp')
    cancelRsvp(@Request() req: any, @Param('id') id: string) {
        return this.eventsService.cancelRsvp(+id, req.user.userId);
    }
}
