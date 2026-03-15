# ⚒️ Crafter's Guild

Welcome to the **Crafter's Guild** monorepo. This project is a complete web application featuring a robust **NestJS** backend and a modern **Next.js** frontend.

## 📂 Project Structure

- **`backend/`**: NestJS REST API with Prisma ORM, SQLite database, and comprehensive automated tests.
- **`frontend/`**: Next.js application providing a dynamic and responsive user interface.
- **`frontend-legacy/`**: An archived static prototype kept for reference (non-active).

---

## 🚀 Quick Start

To get the entire application running locally, follow these steps for both components.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

### 2. Backend Setup
1. **Navigate to backend**:
   ```bash
   cd backend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   Create a `.env` file from the example:
   ```bash
   copy .env.example .env
   ```
4. **Database Initialization**:
   Initialize and seed the SQLite database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
5. **Start Development Server**:
   ```bash
   npm run start:dev
   ```
   *The API will be available at: [http://localhost:3000](http://localhost:3000)*

---

### 3. Frontend Setup
1. **Navigate to frontend**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   Create a `.env.local` file from the example:
   ```bash
   copy .env.example .env.local
   ```
4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   *The website will be available at: [http://localhost:3001](http://localhost:3001)*

---

## 🧪 Testing and Quality

### Backend Tests
- **Unit Tests**: `npm run test`
- **E2E Tests**: `npm run test:e2e`
- **Linting**: `npm run lint`

### Frontend Quality
- **Type Checking**: `npm run build` (Next.js build process)
- **Linting**: `npm run lint`

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | NestJS, Prisma, SQLite, Passport (JWT), Jest |
| **Frontend** | Next.js, React, TypeScript |
| **Styling** | CSS Modules / Vanilla CSS |

---

## 📝 Key Features
- **Monorepo Architecture**: Shared configuration and clear separation of concerns.
- **SQLite Database**: Lightweight and easy local setup.
- **Role-Based Access**: Specialized views for Customers and Admins.
- **Secure Authentication**: JWT-based authentication system.

---

*Happy Crafting!* 🎨🔨
