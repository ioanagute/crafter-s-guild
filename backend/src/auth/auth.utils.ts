export function getAuthCookieName() {
  return process.env.COOKIE_NAME || 'cg_auth';
}

export function getAuthJwtExpiresIn() {
  return process.env.AUTH_JWT_EXPIRES_IN || '7d';
}

export function isAuthCookieSecure() {
  return process.env.COOKIE_SECURE === 'true';
}

export function parseDurationToMs(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) {
    throw new Error(`Unsupported duration format: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  return amount * multipliers[unit];
}

export function parseDurationToSeconds(value: string): number {
  return Math.floor(parseDurationToMs(value) / 1000);
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: isAuthCookieSecure(),
    path: '/',
    maxAge: parseDurationToMs(getAuthJwtExpiresIn()),
  };
}

export function getVerificationExpiryDate() {
  const hours = Number(process.env.EMAIL_VERIFICATION_TTL_HOURS || '24');
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}
