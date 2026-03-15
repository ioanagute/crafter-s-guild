import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    login: jest.fn(),
    register: jest.fn(),
    resendVerification: jest.fn(),
    verifyEmail: jest.fn(),
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
    authService.register.mockResolvedValue({ message: 'Verification email sent.' });

    await expect(
      controller.register({
        username: 'artisan',
        email: 'artisan@example.com',
        password: 'Password123',
      }),
    ).resolves.toEqual({ message: 'Verification email sent.' });
  });

  it('sets the auth cookie on login and returns the user payload', async () => {
    authService.login.mockResolvedValue({
      token: 'signed-token',
      user: { id: 1, username: 'artisan', email: 'artisan@example.com', role: 'CUSTOMER' },
    });
    const response = { cookie: jest.fn() } as any;

    await expect(
      controller.login(
        { identifier: 'artisan', password: 'Password123' },
        response,
      ),
    ).resolves.toEqual({
      user: { id: 1, username: 'artisan', email: 'artisan@example.com', role: 'CUSTOMER' },
    });

    expect(response.cookie).toHaveBeenCalled();
  });
});
