# AlgoForge

AlgoForge is a modern algorithmic coding platform built with Next.js 16, featuring a robust code execution engine, user progress tracking, and gamification elements. It provides an immersive environment for practicing Data Structures and Algorithms (DSA), Competitive Programming (CP), and Interview Preparation.

## Features

- **Robust Code Execution**: Securely execute user-submitted code in isolated Docker containers.
- **Progress Tracking & Gamification**: Global donut charts (ProgressTracker) to track Easy/Medium/Hard problems, level up, and maintain streaks with an interactive heatmap calendar.
- **Unified Search & Filtering**: Advanced search by problem title/slug and filtering by Difficulty, Track, and Tags across the entire platform.
- **Categorized Problem Sheets**: Curated DSA and CP tracks (e.g., Striver's sheet style) with progress persistence.
- **Modern UI**: A sleek, premium glassmorphism interface built with Tailwind CSS v4, Framer Motion, and Radix UI.
- **Monaco Editor Integration**: Professional code editing experience with side-by-side resizable panes.

## Tech Stack

- **Frontend/Backend**: Next.js 16 (App Router)
- **Database**: SQLite with Prisma ORM (ideal for local development and simplicity)
- **Code Execution Engine**: Custom Node.js worker using Docker API (`dockerode`)
- **Styling**: Tailwind CSS v4, `clsx`, `tailwind-merge`
- **UI Components**: Radix UI, Framer Motion, Lucide React
- **State Management**: Zustand
- **Authentication**: JWT, bcrypt, Next.js Middleware

## Prerequisites

Before setting up the project, make sure you have the following installed:

- **Node.js** (v20+ recommended)
- **Docker Manager** (e.g., Docker Desktop) for running the code execution worker.
- **Git**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd algoforge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Ensure `JWT_SECRET` is set. The `DATABASE_URL` for SQLite is typically `file:./dev.db`.

### 4. Setup the Database

Generate the Prisma client and initialize the SQLite database:

```bash
npx prisma generate
npx prisma db push
```

### 5. Seed the Data

Populate the platform with curated DSA and CP problem sets:

```bash
# Seed DSA Track
npx tsx prisma/seeds/seed_dsa_sheet.ts

# Seed CP Track
npx tsx prisma/seeds/seed_cp_sheet.ts
```

### 6. Start the Code Execution Worker

Ensure Docker is running, then start the worker in a separate terminal:

```bash
npm run worker
```

### 7. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start coding!

---

## Code Execution Architecture

Code execution in AlgoForge is performed locally on the server for simplicity during development:
1. **Submission**: User code is sent to dedicated API routes (`/api/submissions/submit` or `/run`).
2. **Execution**: The server spawns a local process (e.g., `python`, `g++`, `node`) in a temporary directory (`tmp/executions`).
3. **Safety**: Each execution is isolated by temporary file structures and has strict time limits to prevented infinite loops or resource exhaustion.
4. **Grading**: The execution engine runs the code against all test cases, captures output, and updates the database with results, XP, and streaks.
