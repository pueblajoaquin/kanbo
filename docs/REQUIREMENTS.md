# Requirements — Kanbo

## Actors

| Actor | Description |
|---|---|
| User | Registered person in the system. |
| Owner | User who created the project. |
| Collaborator | User invited to a project. |

## Functional requirements

| ID | Requirement | Actor |
|---|---|---|
| FR-01 | Register with name, email and password. | User |
| FR-02 | Log in with email and password. | User |
| FR-03 | View own profile data. | User |
| FR-04 | Create a project (becomes owner automatically). | User |
| FR-05 | Invite collaborators to a project. | Owner |
| FR-06 | Delete a project. | Owner |
| FR-07 | View a project and its tasks. | Owner / Collaborator |
| FR-08 | Cannot access a project you are not a member of. | User |
| FR-09 | Create a task within a project. | Owner / Collaborator |
| FR-10 | Change a task's status (pending, in_progress, done). | Owner / Collaborator |
| FR-11 | Delete a task (only its creator or the project owner). | Owner / Creator |
| FR-12 | List a project's tasks with their status. | Owner / Collaborator |
| FR-13 | List a project's members (owner and collaborators). | Owner / Collaborator |

## Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-01 | Passwords are stored hashed (bcrypt), never in plain text. |
| NFR-02 | All endpoints require JWT, except register and login. |
| NFR-03 | The API responds with appropriate HTTP status codes (400, 401, 403, 404, 500). |