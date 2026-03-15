# Crafter's Guild Frontend

Next.js frontend for the Crafter's Guild community app. This is the only maintained application UI in the repository.

## Setup

1. `copy .env.example .env.local`
2. `npm install`
3. `npm run dev`

The app runs on `http://localhost:3001` if you start it with that port, or on the default Next.js port otherwise.

## Environment

- `NEXT_PUBLIC_API_URL=http://localhost:3000`

## Current Behavior

- Authentication uses an HTTP-only JWT cookie set by the backend.
- Registration requires email verification before sign-in is allowed.
- `/profile` is the authenticated self-profile route.
- Thread browsing, thread detail, and reply posting use the live backend API.
- Marketplace and event creation flows are intentionally hidden until dedicated forms exist.
