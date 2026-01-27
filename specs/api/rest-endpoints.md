# REST API Endpoints

## Authentication
- All endpoints require JWT token in header: `Authorization: Bearer <token>`

## Endpoints
### GET /api/{user_id}/tasks
List all tasks for authenticated user

### POST /api/{user_id}/tasks
Create a new task

### GET /api/{user_id}/tasks/{id}
Get task details

### PUT /api/{user_id}/tasks/{id}
Update a task

### DELETE /api/{user_id}/tasks/{id}
Delete a task

### PATCH /api/{user_id}/tasks/{id}/complete
Toggle task completion
