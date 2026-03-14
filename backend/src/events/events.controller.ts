import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Get()
    getEvents() {
        return this.eventsService.getEvents();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post()
    createEvent(@Body() body: CreateEventDto) {
        return this.eventsService.createEvent({
            title: body.title,
            description: body.description,
            date: body.date,
            location: body.location
        });
    }

    @Get(':id')
    getEvent(@Param('id', ParseIntPipe) id: number) {
        return this.eventsService.getEvent(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/rsvp')
    rsvp(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
        return this.eventsService.rsvp(id, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/rsvp')
    cancelRsvp(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
        return this.eventsService.cancelRsvp(id, req.user.userId);
    }
}
