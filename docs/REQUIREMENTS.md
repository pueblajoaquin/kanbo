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
| RF-01 | Register with name, email and password. | User |
| RF-02 | Log in with email and password. | User |
| RF-03 | View own profile data. | User |
| RF-04 | Create a project (becomes owner automatically). | User |
| RF-05 | Invite collaborators to a project. | Owner |
| RF-06 | Delete a project. | Owner |
| RF-07 | View a project and its tasks. | Owner / Collaborator |
| RF-08 | Cannot access a project you are not a member of. | User |
| RF-09 | Create a task within a project. | Owner / Collaborator |
| RF-10 | Change a task's status (pending, in_progress, done). | Owner / Collaborator |
| RF-11 | Delete a task (only its creator or the project owner). | Owner / Creator |
| RF-12 | List a project's tasks with their status. | Owner / Collaborator |

## Non-functional requirements

| ID | Requirement |
|---|---|
| RNF-01 | Passwords are stored hashed (bcrypt), never in plain text. |
| RNF-02 | All endpoints require JWT, except register and login. |
| RNF-03 | The API responds with appropriate HTTP status codes (400, 401, 403, 404, 500). |