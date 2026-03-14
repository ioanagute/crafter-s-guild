import { ForumsService } from './forums.service';

describe('ForumsService', () => {
  const prisma = {
    thread: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue({
        id: 1,
        category: { name: 'Blacksmithing', icon: 'hammer' },
      }),
    },
    category: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
    },
    post: {
      create: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all threads when no category filter is passed', async () => {
    const service = new ForumsService(prisma as any);

    await expect(service.getThreads()).resolves.toEqual([]);
    expect(prisma.thread.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: undefined,
      }),
    );
  });

  it('includes category data on thread detail', async () => {
    const service = new ForumsService(prisma as any);

    await expect(service.getThread(1)).resolves.toEqual({
      id: 1,
      category: { name: 'Blacksmithing', icon: 'hammer' },
    });
  });
});
