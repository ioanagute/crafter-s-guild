import { MarketService } from './market.service';

describe('MarketService', () => {
  it('returns items ordered by newest first', async () => {
    const prisma = {
      marketItem: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };
    const service = new MarketService(prisma as any);

    await expect(service.getItems()).resolves.toEqual([]);
    expect(prisma.marketItem.findMany).toHaveBeenCalled();
  });
});
