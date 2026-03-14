# Crafter's Guild Monorepo

Crafter's Guild is a monorepo with a NestJS API, a Next.js frontend, and a retained static legacy frontend for reference.

## Repository Layout

```text
/crafter-s-guild
|-- backend/          NestJS API, Prisma schema, SQLite database, tests
|-- frontend/         Next.js application
|-- frontend-legacy/  Archived static prototype
`-- README.md
```

## Local Setup

### Backend

1. `cd backend`
2. `copy .env.example .env`
3. `npm install`
4. `npx prisma migrate dev`
5. `npx prisma db seed`
6. `npm run start:dev`

Default backend URL: `http://localhost:3000`

### Frontend

1. `cd frontend`
2. `copy .env.example .env.local`
3. `npm install`
4. `npm run dev`

Default frontend URL: `http://localhost:3001`

## Environment Variables

### Backend

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT` optional, defaults to `3000`
- `CORS_ORIGIN` optional, defaults to open CORS

### Frontend

- `NEXT_PUBLIC_API_URL` optional, defaults to `http://localhost:3000`

## Notes

- SQLite remains the default local database.
- Public registration always creates a `CUSTOMER` account.
- Category creation and event creation are restricted to admins.
- `frontend-legacy/` is not part of the active application.
