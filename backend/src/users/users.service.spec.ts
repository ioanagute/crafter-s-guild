import { UsersService } from './users.service';

describe('UsersService', () => {
  it('returns a public profile without private email fields in the select clause', async () => {
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };
    const service = new UsersService(prisma as any);

    await service.getPublicProfile(1);

    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.not.objectContaining({
          email: true,
        }),
      }),
    );
  });
});
