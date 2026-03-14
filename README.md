# Crafter's Guild Monorepo

Welcome to the **Crafter's Guild** monorepo. This project contains both the backend services and the frontend application.

## Structure

```
/crafter-s-guild
├── backend/          # NestJS API (Node.js, Prisma, SQLite)
├── frontend/         # Vanilla HTML/CSS/JS (Migration to React/Next.js planned)
├── .gitignore        # Root git ignore
└── README.md         # This file
```

## Getting Started

### Backend

To start the backend development server:

```bash
cd backend
npm install
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### Frontend

Currently, the frontend consists of static files. You can open `frontend/index.html` in your browser or use a live server extension.

## Migration Plans

- [ ] Migrate frontend to React/Next.js
- [ ] Implement shared types/utilities package if needed
