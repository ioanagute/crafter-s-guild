import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
  let controller: EventsController;
  const eventsService = {
    getEvents: jest.fn().mockResolvedValue([]),
    createEvent: jest.fn(),
    getEvent: jest.fn(),
    rsvp: jest.fn(),
    cancelRsvp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [{ provide: EventsService, useValue: eventsService }],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('returns all events', async () => {
    await expect(controller.getEvents()).resolves.toEqual([]);
  });
});
