import { EventsService } from './events.service';

describe('EventsService', () => {
  const prisma = {
    event: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    eventRSVP: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns events sorted by date', async () => {
    const service = new EventsService(prisma as any);

    await expect(service.getEvents()).resolves.toEqual([]);
    expect(prisma.event.findMany).toHaveBeenCalled();
  });
});
