import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from './email.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  const usersService = {
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    findByUsernameInsensitive: jest.fn(),
    findByVerificationTokenHash: jest.fn(),
    updateVerification: jest.fn(),
    markEmailVerified: jest.fn(),
    create: jest.fn(),
    getSessionProfile: jest.fn(),
  } as unknown as UsersService;
  const jwtService = {
    sign: jest.fn().mockReturnValue('signed-token'),
  } as unknown as JwtService;
  const emailService = {
    sendVerificationEmail: jest.fn(),
  } as unknown as EmailService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(usersService, jwtService, emailService);
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
      emailVerifiedAt: new Date(),
      password: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await expect(service.validateUser('artisan', 'password123')).resolves.toEqual({
      id: 1,
      username: 'artisan',
      email: 'artisan@example.com',
      role: 'CUSTOMER',
      emailVerifiedAt: expect.any(Date),
    });
  });

  it('creates an unverified user and sends a verification email', async () => {
    usersService.findByEmail = jest.fn().mockResolvedValue(null);
    usersService.findByUsernameInsensitive = jest.fn().mockResolvedValue(null);
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
      password: 'Password123',
    });

    expect(usersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashed-password',
        role: 'CUSTOMER',
        emailVerificationTokenHash: expect.any(String),
        emailVerificationExpiresAt: expect.any(Date),
      }),
    );
    expect(emailService.sendVerificationEmail).toHaveBeenCalled();
    expect(result).toEqual({
      message: 'Verification email sent.',
      requiresEmailVerification: true,
    });
  });

  it('rejects duplicate emails', async () => {
    usersService.findByEmail = jest.fn().mockResolvedValueOnce({ id: 9 });

    await expect(
      service.register({
        username: 'newuser',
        email: 'existing@example.com',
        password: 'Password123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns a token and user when a verified user signs in', async () => {
    usersService.findOne = jest.fn().mockResolvedValue({
      id: 7,
      username: 'artisan',
      email: 'artisan@example.com',
      role: 'CUSTOMER',
      avatar: null,
      emailVerifiedAt: new Date(),
      password: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await expect(service.login('artisan', 'Password123')).resolves.toEqual({
      token: 'signed-token',
      user: {
        id: 7,
        username: 'artisan',
        email: 'artisan@example.com',
        role: 'CUSTOMER',
        avatar: null,
      },
    });
  });
});
