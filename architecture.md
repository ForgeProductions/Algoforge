# AlgoForge Architecture

This document provides a high-level overview of the architectural design, system components, database schema, and workflows that power the AlgoForge platform.

## 1. System Overview

AlgoForge is designed as a modular, containerized application built around a Next.js full-stack framework. It separates the web serving layer from the computationally intensive and potentially insecure code execution layer.

### Core Components

1.  **Web Application Core (Next.js)**: Handles routing, UI rendering (React 19/Tailwind), authentication, API endpoints, and database interactions.
2.  **Relational Database (SQLite)**: The primary data store for user profiles, problems, submissions, progress, and gamification data. SQLite is used for its simplicity and local-first approach.
3.  **Execution Engine**: A specialized library (`src/lib/execution/service.ts`) that manages code execution tasks directly on the server host.
4.  **Isolation Strategy**: Ephemeral local directories mounted as volumes into secure Docker containers via `dockerode`, enforcing resource constraints, no network access, and strict time limits.

---

## 2. Component Architecture

### The Next.js App (Frontend & API)

The application uses the Next.js App Router paradigm.

*   **Frontend (`src/app`, `src/components`)**:
    *   **UI Library**: Exclusively uses custom components styled with Tailwind CSS v4, integrated with `radix-ui` for accessible primitives (dialogs, accordions, etc.) and `framer-motion` for animations.
    *   **State Management**: Zustand is utilized for client-side state across different domains (`authStore.ts`, `editorStore.ts`, etc.).
    *   **Search & Filtering**: A unified, URL-driven filtering system exists for the All Problems and Track pages, allowing real-time searching by problem title/slug and filtering by Difficulty, Track, and Tags.
    *   **Progress Visualization**: Implements custom `ProgressTracker` (donut charts) and `StreakCalendar` (activity heatmap) components to visualize global and track-specific progress.
    *   **Editor Environment**: Integrates `@monaco-editor/react` for the specialized code input component, side-by-side with markdown-rendered problem descriptions using `react-resizable-panels`.

*   **Backend / API (`src/app/api`, `src/lib`)**:
    *   **Authentication**: Handled via custom JWT tokens stored in cookies, verified by Next.js edge middleware (`src/middleware.ts`).
    *   **Data Access Layer**: All database interactions are routed through strictly typed Prisma client calls (`src/lib/db/prisma.ts`).
    *   **SQLite JSON Strategy**: Since SQLite lacks a native JSON type, multi-value fields (tags, boilerplate, etc.) are stored as JSON strings and parsed in server components before being sent to the client.

### The Code Execution Engine

The engine is integrated into the Next.js backend for rapid feedback:

1.  **Docker Orchestration**: The backend uses the `docker.ts` execution provider and `dockerode` to automatically build custom images containing the `time` utility (`algoforge-python`, `algoforge-node`, etc.), and then create and run runtime-specific containers.
2.  **Test Case Orchestration**: The `service.ts` component fetches test cases, mounts them as volumes into containers sequentially, and aggregates the results.
3.  **Strict Limits**: Resource constraints (256MB memory, disabled network, CPU limits, time bounds) are enforced by Docker for every execution. Real execution time and memory peak are parsed securely.

---

## 3. Data Model (Prisma Schema)

The core data entities handled by Prisma (`prisma/schema.prisma`) are categorized into four logical groups:

### 1. Users & Authentication
*   **User**: Stores credentials, profile data, and gamification stats (XP, level, streaks).
*   **RefreshToken**: Manages long-lived session tokens.

### 2. Content & Organization
*   **Topic** & **Subtopic**: Organizes the curriculum (e.g., Topic: "Graph Theory", Subtopic: "Shortest Path").
*   **Problem**: Contains the master definition of a challenge—markdown descriptions, constraints, examples, difficulty rating, and boilerplate code placeholders.
*   **TestCase**: Individual I/O pairs associated with a problem. Flags indicate if a test case is meant to be hidden from the user during standard "RUN" operations.

### 3. Execution & Progress
*   **Submission**: A historic record of every piece of code run by a user, including the snapshot of the code, language used, runtime metrics, and pass/fail status.
*   **UserProgress**: Tracks aggregate success per problem—whether the user has attempted a problem or solved it completely, along with their best runtime and memory usage.

### 4. Gamification
*   **Achievement** & **UserAchievement**: Definitions of unlockable badges/milestones and the junction table mapping them to users who have earned them.

---

## 4. Key Workflows

### The Submission Workflow

This is the primary user journey in the application:

1.  **Code Editor**: The user writes an algorithm in the Monaco editor and clicks "Submit" (or "Run").
2.  **API Gateway**: `POST /api/submissions` validates the request, creates a `Submission` record with status `PENDING` in Postgres, and enqueues a job payload to Redis containing the submission ID and raw code.
3.  **Client-Side Polling**: The frontend begins polling `GET /api/submissions/[id]` every few seconds to monitor the status.
4.  **Worker Processing**: The detached Worker process pops the job from Redis. Wait state ends; status updates to `RUNNING`.
5.  **Secure Execution**: The Worker runs the code against all test cases inside an isolated Docker container. Piped outputs are analyzed for correctness.
6.  **Resolution & Gamification**: The Worker updates the `Submission` in Postgres with the final result (e.g., `ACCEPTED`). If successful, it calculates XP gains and updates the user's streak in the `User` table, and marks the `UserProgress` table for that specific problem.
7.  **Client Update**: The frontend polling receives the terminal status (`ACCEPTED`), stops polling, and displays the success animation, runtime metrics, and newly acquired XP to the user.

### Authentication Workflow

1.  User logs in via `/api/auth/login`.
2.  Server verifies credentials via bcrypt against the Postgres `User` table.
3.  Server generates a short-lived Access JWT and a long-lived Refresh Token.
4.  Cookies are set: Access JWT goes into an HTTP-only cookie to be used automatically on subsequent requests.
5.  For protected page loads, Next.js Middleware intercepts the request, decodes the JWT, and allows access if valid, or redirects to `/login` if missing/expired.
