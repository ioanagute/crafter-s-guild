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
- `PORT=3000` optional
- `CORS_ORIGIN=http://localhost:3001` optional

## Test Commands

- `npm run test`
- `npm run test:e2e`

## Seeded Demo Account

- Email: `artisan@crafters.guild`
- Password: `password123`

## Key API Rules

- `POST /auth/register` ignores elevated role assignment and creates `CUSTOMER` users only.
- `GET /users/:id/profile` returns public profile data without email.
- `GET /users/me/profile` requires authentication and returns the current user's full profile.
- `POST /forums/categories` and `POST /events` require an authenticated `ADMIN`.
