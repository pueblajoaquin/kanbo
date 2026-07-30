# Kanbo

REST API for collaborative task and project management, with JWT authentication and role-based access control. Built with Node.js, Express and Prisma, inspired by the Kanban methodology.

A user can create projects, invite collaborators, and manage tasks within each project. Each project has an owner and collaborators, with different permissions depending on the role.

## Stack

- **Node.js** + **Express** — server and REST API
- **PostgreSQL** (hosted on [Neon](https://neon.tech)) — database
- **Prisma** — ORM
- **JWT** (`jsonwebtoken`) + **bcrypt** — authentication and password hashing
- **Jest** + **Supertest** — testing

## Prerequisites

- Node.js installed
- A PostgreSQL database

## Installation

```bash
git clone https://github.com/pueblajoaquin/kanbo.git
cd kanbo-api
npm install
```

Create a `.env` file in the root with:

```
DATABASE_URL="your-postgres-connection-string"
JWT_SECRET="a-long-random-secret"
```

Run the migrations to create the tables:

```bash
npx prisma migrate dev
```

## Usage

Start the server:

```bash
npm start
```

The server runs by default on `http://localhost:3000`. It serves both the API and a minimal frontend (login, register, projects, and project detail pages with their tasks).

## Testing

```bash
npm test
```

## Main endpoints

| Method | Route | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a user | Public |
| POST | `/auth/login` | Log in | Public |
| GET | `/users/me` | View own profile | Authenticated |
| POST | `/projects` | Create a project | Authenticated |
| GET | `/projects` | List my projects | Authenticated |
| GET | `/projects/:id` | View a project | Member |
| DELETE | `/projects/:id` | Delete a project | Owner |
| POST | `/projects/:id/members` | Invite a collaborator | Owner |
| GET | `/projects/:id/members` | List project members | Member |
| POST | `/projects/:id/tasks` | Create a task | Member |
| GET | `/projects/:id/tasks` | List project tasks | Member |
| PATCH | `/tasks/:id` | Update task status | Member |
| DELETE | `/tasks/:id` | Delete a task | Creator or owner |

## Project structure

```
src/
  routes/       - route definitions
  controllers/  - HTTP request handling
  services/     - business logic
  middlewares/  - authentication and authorization
  prisma.js     - Prisma client (singleton)
  app.js        - Express configuration
  index.js      - server startup
prisma/
  schema.prisma - data model
  migrations/   - migration history
public/         - minimal frontend
  index.html      - login page
  register.html   - registration page
  projects.html   - project list
  project.html    - project detail (tasks, members)
  style.css       - shared styles
  js/
    api.js          - shared fetch helper (auth header)
    auth.js         - login and register logic
    projects.js     - project list logic
    project.js      - project detail logic
__tests__/      - tests with Jest + Supertest
```