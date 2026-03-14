# Crafter's Guild Frontend

Next.js frontend for the Crafter's Guild community app.

## Setup

1. `copy .env.example .env.local`
2. `npm install`
3. `npm run dev`

The app runs on `http://localhost:3001` if you start it with that port, or on the default Next.js port otherwise.

## Environment

- `NEXT_PUBLIC_API_URL=http://localhost:3000`

## Current Behavior

- Authentication uses JWTs stored in local storage.
- `/profile` is the authenticated self-profile route.
- Thread browsing, thread detail, and reply posting use the live backend API.
- Marketplace and event creation flows are intentionally hidden until dedicated forms exist.
