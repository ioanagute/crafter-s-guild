import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

    async getEvents() {
        return this.prisma.event.findMany({
            include: {
                _count: { select: { rsvps: true } } // Get RSVP counts
            },
            orderBy: { date: 'asc' }
        });
    }

    async createEvent(data: Prisma.EventCreateInput) {
        return this.prisma.event.create({ data });
    }

    async getEvent(id: number) {
        return this.prisma.event.findUnique({
            where: { id },
            include: {
                rsvps: {
                    include: {
                        user: { select: { username: true, avatar: true } }
                    }
                }
            }
        });
    }

    async rsvp(eventId: number, userId: number) {
        try {
            return await this.prisma.eventRSVP.create({
                data: {
                    eventId,
                    userId
                }
            });
        } catch (error) {
            // If unique constraint fails, they already RSVP'd
            throw new ConflictException('Already RSVPd to this event');
        }
    }

    async cancelRsvp(eventId: number, userId: number) {
        // Find the RSVP first
        const rsvp = await this.prisma.eventRSVP.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId
                }
            }
        });

        if (rsvp) {
            return this.prisma.eventRSVP.delete({
                where: { id: rsvp.id }
            });
        }
        return null;
    }
}
