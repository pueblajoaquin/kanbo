# Kanbo

Kanbo is a collaborative project and task management API inspired by Kanban. It allows users to create projects, invite collaborators, manage tasks, and control access through role-based permissions.

The project includes a small frontend served from the public folder, plus Swagger-based API documentation for easier testing and exploration.

## Features

- User registration and login with JWT authentication
- Project creation and member management
- Task creation, listing, and status updates
- Role-based access control for owners and collaborators
- Swagger UI for API documentation
- Minimal frontend for login, registration, project listing, and task management

## Stack

- Node.js + Express — server and REST API
- PostgreSQL — database
- Prisma — ORM and migrations
- JWT + bcrypt — authentication and password hashing
- Swagger — API documentation
- Jest + Supertest — testing

## Prerequisites

- Node.js installed
- A PostgreSQL database

## Installation

```bash
git clone https://github.com/pueblajoaquin/kanbo.git
cd kanbo-api
npm install
```

Create a `.env` file in the project root with:

```env
DATABASE_URL="your-postgres-connection-string"
JWT_SECRET="a-long-random-secret"
```

Generate the Prisma client and run the migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

## Usage

Start the server:

```bash
npm start
```

The application will run by default at `http://localhost:3000`.

### Available routes

- Main frontend: `http://localhost:3000/`
- Swagger docs: `http://localhost:3000/api-docs`

## Testing

Run the test suite with:

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

```text
src/
  routes/           - route definitions
  controllers/      - HTTP request handling
  services/         - business logic
  middlewares/      - authentication and authorization
  prisma.js         - Prisma client singleton
  app.js            - Express configuration
  index.js          - server startup
  swagger.js        - Swagger/OpenAPI configuration
prisma/
  schema.prisma     - data model
  migrations/       - migration history
docs/
  REQUIREMENTS.md   - project requirements and notes
public/
  index.html        - login page
  register.html     - registration page
  projects.html     - project list
  project.html      - project detail page
  style.css         - shared styles
  js/
    api.js          - shared fetch helper with auth headers
    auth.js         - login and register logic
    projects.js     - projects list logic
    project.js      - project detail logic
__tests__/
  auth.test.js      - authentication tests
  projects.test.js  - project tests
  tasks.test.js     - task tests
```