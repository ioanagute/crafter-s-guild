import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  const usersService = {
    findOne: jest.fn(),
    create: jest.fn(),
    getSessionProfile: jest.fn(),
  } as unknown as UsersService;
  const jwtService = {
    sign: jest.fn().mockReturnValue('signed-token'),
  } as unknown as JwtService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(usersService, jwtService);
  });

  it('returns null for invalid credentials', async () => {
    usersService.findOne = jest.fn().mockResolvedValue({
      id: 1,
      username: 'artisan',
      password: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.validateUser('artisan', 'wrong-password')).resolves.toBeNull();
  });

  it('returns the user without password for valid credentials', async () => {
    usersService.findOne = jest.fn().mockResolvedValue({
      id: 1,
      username: 'artisan',
      email: 'artisan@example.com',
      role: 'CUSTOMER',
      password: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await expect(service.validateUser('artisan', 'password123')).resolves.toEqual({
      id: 1,
      username: 'artisan',
      email: 'artisan@example.com',
      role: 'CUSTOMER',
    });
  });

  it('forces CUSTOMER role during registration', async () => {
    usersService.findOne = jest.fn().mockResolvedValue(null);
    usersService.create = jest.fn().mockResolvedValue({
      id: 2,
      username: 'newuser',
      email: 'new@example.com',
      role: 'CUSTOMER',
      avatar: null,
    });
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

    const result = await service.register({
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
    });

    expect(usersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashed-password',
        role: 'CUSTOMER',
      }),
    );
    expect(result).toEqual({
      access_token: 'signed-token',
      user: {
        id: 2,
        username: 'newuser',
        email: 'new@example.com',
        role: 'CUSTOMER',
        avatar: null,
      },
    });
  });

  it('rejects duplicate emails', async () => {
    usersService.findOne = jest.fn().mockResolvedValueOnce({ id: 9 });

    await expect(
      service.register({
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
