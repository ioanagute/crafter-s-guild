import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('delegates registration to the service', async () => {
    authService.register.mockResolvedValue({ access_token: 'token' });

    await expect(
      controller.register({
        username: 'artisan',
        email: 'artisan@example.com',
        password: 'password123',
      }),
    ).resolves.toEqual({ access_token: 'token' });
  });
});
