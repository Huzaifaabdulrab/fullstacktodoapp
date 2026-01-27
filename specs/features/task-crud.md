# Feature: Task CRUD Operations

## User Stories
- As a user, I can create a new task
- As a user, I can view all my tasks
- As a user, I can update a task
- As a user, I can delete a task
- As a user, I can mark a task complete/incomplete

## Acceptance Criteria
### Create Task
- Title required (1-200 chars)
- Description optional (max 1000 chars)
- Task linked to logged-in user

### View Tasks
- Only show tasks for current user
- Filter by status (pending/completed/all)
- Display title, description, created_at

### Update Task
- Modify title or description
- Must belong to logged-in user

### Delete Task
- Remove task by ID
- Must belong to logged-in user

### Complete Task
- Toggle completed flag
