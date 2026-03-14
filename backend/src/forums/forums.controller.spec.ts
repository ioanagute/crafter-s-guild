import { Test, TestingModule } from '@nestjs/testing';
import { ForumsController } from './forums.controller';
import { ForumsService } from './forums.service';

describe('ForumsController', () => {
  let controller: ForumsController;
  const forumsService = {
    getCategories: jest.fn().mockResolvedValue([]),
    getLatestThreads: jest.fn().mockResolvedValue([]),
    getThreads: jest.fn().mockResolvedValue([]),
    createCategory: jest.fn(),
    getThreadsByCategory: jest.fn(),
    createThread: jest.fn(),
    getThread: jest.fn(),
    createPost: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForumsController],
      providers: [{ provide: ForumsService, useValue: forumsService }],
    }).compile();

    controller = module.get<ForumsController>(ForumsController);
  });

  it('lists all threads through the new endpoint', async () => {
    await expect(controller.getThreads({})).resolves.toEqual([]);
    expect(forumsService.getThreads).toHaveBeenCalledWith(undefined);
  });
});
