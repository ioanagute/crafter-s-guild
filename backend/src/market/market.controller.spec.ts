import { Test, TestingModule } from '@nestjs/testing';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';

describe('MarketController', () => {
  let controller: MarketController;
  const marketService = {
    getItems: jest.fn().mockResolvedValue([]),
    getItem: jest.fn(),
    createItem: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketController],
      providers: [{ provide: MarketService, useValue: marketService }],
    }).compile();

    controller = module.get<MarketController>(MarketController);
  });

  it('returns marketplace items', async () => {
    await expect(controller.getItems()).resolves.toEqual([]);
  });
});
