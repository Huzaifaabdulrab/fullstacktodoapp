# API Contract: Todo Application

## Overview
This document defines the API contracts for the Todo application, specifying the endpoints, request/response formats, and authentication requirements.

## Base URL
- Development: `http://localhost:8000`
- Production: To be determined

## Authentication
All endpoints (except authentication endpoints) require JWT token in header:
```
Authorization: Bearer <token>
```

The JWT token is issued by Better Auth upon successful login and contains the user ID in the `sub` claim.

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, must be valid email)",
  "password": "string (required, min 8 chars)"
}
```

**Response (201 Created):**
```json
{
  "access_token": "string (JWT token)",
  "token_type": "bearer"
}
```

**Errors:**
- 400: Bad Request (invalid input)
- 409: Conflict (email already registered)

#### POST /api/auth/login
Login an existing user.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "access_token": "string (JWT token)",
  "token_type": "bearer"
}
```

**Errors:**
- 401: Unauthorized (invalid credentials)
- 400: Bad Request (missing fields)

### Task Management Endpoints

#### GET /api/{user_id}/tasks
List all tasks for a specific user.

**Path Parameters:**
- `user_id`: string (the ID of the user whose tasks to retrieve)

**Query Parameters:**
- `status`: string (optional, "all" | "pending" | "completed", defaults to "all")
- `sort`: string (optional, "created" | "title" | "due_date", defaults to "created")

**Headers:**
- `Authorization: Bearer <token>` (JWT token containing matching user ID)

**Response (200 OK):**
```json
[
  {
    "id": "integer",
    "user_id": "string",
    "title": "string",
    "description": "string (nullable)",
    "completed": "boolean",
    "created_at": "ISO 8601 datetime string",
    "updated_at": "ISO 8601 datetime string"
  }
]
```

**Errors:**
- 401: Unauthorized (invalid or missing token)
- 403: Forbidden (token user ID doesn't match path user ID)

#### POST /api/{user_id}/tasks
Create a new task for a user.

**Path Parameters:**
- `user_id`: string (the ID of the user creating the task)

**Headers:**
- `Authorization: Bearer <token>` (JWT token containing matching user ID)

**Request Body:**
```json
{
  "title": "string (required, 1-200 chars)",
  "description": "string (optional, max 1000 chars)"
}
```

**Response (201 Created):**
```json
{
  "id": "integer",
  "user_id": "string",
  "title": "string",
  "description": "string (nullable)",
  "completed": "boolean",
  "created_at": "ISO 8601 datetime string",
  "updated_at": "ISO 8601 datetime string"
}
```

**Errors:**
- 401: Unauthorized (invalid or missing token)
- 403: Forbidden (token user ID doesn't match path user ID)
- 400: Bad Request (validation error)

#### GET /api/{user_id}/tasks/{id}
Get a specific task by ID.

**Path Parameters:**
- `user_id`: string (the ID of the user whose task to retrieve)
- `id`: integer (the ID of the task to retrieve)

**Headers:**
- `Authorization: Bearer <token>` (JWT token containing matching user ID)

**Response (200 OK):**
```json
{
  "id": "integer",
  "user_id": "string",
  "title": "string",
  "description": "string (nullable)",
  "completed": "boolean",
  "created_at": "ISO 8601 datetime string",
  "updated_at": "ISO 8601 datetime string"
}
```

**Errors:**
- 401: Unauthorized (invalid or missing token)
- 403: Forbidden (token user ID doesn't match path user ID)
- 404: Not Found (task doesn't exist)

#### PUT /api/{user_id}/tasks/{id}
Update a task.

**Path Parameters:**
- `user_id`: string (the ID of the user whose task to update)
- `id`: integer (the ID of the task to update)

**Headers:**
- `Authorization: Bearer <token>` (JWT token containing matching user ID)

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "id": "integer",
  "user_id": "string",
  "title": "string",
  "description": "string (nullable)",
  "completed": "boolean",
  "created_at": "ISO 8601 datetime string",
  "updated_at": "ISO 8601 datetime string"
}
```

**Errors:**
- 401: Unauthorized (invalid or missing token)
- 403: Forbidden (token user ID doesn't match path user ID)
- 404: Not Found (task doesn't exist)
- 400: Bad Request (validation error)

#### DELETE /api/{user_id}/tasks/{id}
Delete a task.

**Path Parameters:**
- `user_id`: string (the ID of the user whose task to delete)
- `id`: integer (the ID of the task to delete)

**Headers:**
- `Authorization: Bearer <token>` (JWT token containing matching user ID)

**Response (204 No Content)**

**Errors:**
- 401: Unauthorized (invalid or missing token)
- 403: Forbidden (token user ID doesn't match path user ID)
- 404: Not Found (task doesn't exist)

#### PATCH /api/{user_id}/tasks/{id}/complete
Toggle the completion status of a task.

**Path Parameters:**
- `user_id`: string (the ID of the user whose task to update)
- `id`: integer (the ID of the task to update)

**Headers:**
- `Authorization: Bearer <token>` (JWT token containing matching user ID)

**Request Body:**
```json
{
  "completed": "boolean (optional, if omitted, toggles current status)"
}
```

**Response (200 OK):**
```json
{
  "id": "integer",
  "user_id": "string",
  "title": "string",
  "description": "string (nullable)",
  "completed": "boolean",
  "created_at": "ISO 8601 datetime string",
  "updated_at": "ISO 8601 datetime string"
}
```

**Errors:**
- 401: Unauthorized (invalid or missing token)
- 403: Forbidden (token user ID doesn't match path user ID)
- 404: Not Found (task doesn't exist)

## Security Requirements
1. All user-specific endpoints must verify that the user ID in the JWT token matches the user ID in the URL path
2. Authentication is required for all endpoints except login and registration
3. JWT tokens expire after 7 days
4. All passwords must be hashed before storage