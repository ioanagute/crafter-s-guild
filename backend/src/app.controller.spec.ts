import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockReturnValue("Crafter's Guild API is weaving..."),
            getStats: jest.fn().mockResolvedValue({
              members: 1,
              threads: 2,
              posts: 3,
              marketItems: 4,
            }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('returns the current health message', () => {
    expect(appController.getHello()).toBe("Crafter's Guild API is weaving...");
  });

  it('returns stats from the service', async () => {
    await expect(appController.getStats()).resolves.toEqual({
      members: 1,
      threads: 2,
      posts: 3,
      marketItems: 4,
    });
  });
});
