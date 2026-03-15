# Crafter's Guild Backend

NestJS API for authentication, forums, marketplace listings, events, and profile data.

## Setup

1. `copy .env.example .env`
2. `npm install`
3. `npx prisma migrate dev`
4. `npx prisma db seed`
5. `npm run start:dev`

The API runs on `http://localhost:3000` by default.

## Environment

- `DATABASE_URL=file:./dev.db`
- `JWT_SECRET=change-me`
- `AUTH_JWT_EXPIRES_IN=7d`
- `PORT=3000` optional
- `CORS_ORIGIN=http://localhost:3001`
- `FRONTEND_URL=http://localhost:3001`
- `API_BASE_URL=http://localhost:3000`
- `COOKIE_NAME=cg_auth`
- `COOKIE_SECURE=false`
- `EMAIL_VERIFICATION_TTL_HOURS=24`
- `SMTP_HOST=...`
- `SMTP_PORT=587`
- `SMTP_USER=...`
- `SMTP_PASS=...`
- `SMTP_FROM=Crafter's Guild <noreply@example.com>`

## Test Commands

- `npm run test`
- `npm run test:e2e`

## Seeded Demo Account

- Email: `artisan@crafters.guild`
- Password: `password123`

Existing seeded users are treated as verified after the email-verification migration.

## Key API Rules

- `POST /auth/register` ignores elevated role assignment, creates `CUSTOMER` users only, and sends a verification email.
- `POST /auth/login` accepts either email or username plus password and sets a JWT cookie on success.
- `POST /auth/logout` clears the auth cookie.
- `GET /auth/verify-email?token=...` verifies email ownership and redirects back to the frontend.
- `GET /users/:id/profile` returns public profile data without email.
- `GET /users/me/profile` requires authentication and returns the current user's full profile.
- `POST /forums/categories` and `POST /events` require an authenticated `ADMIN`.
