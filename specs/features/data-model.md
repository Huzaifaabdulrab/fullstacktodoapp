# Data Model: Todo Full-Stack Web Application

## Overview
This document defines the data models for the Todo application, including user authentication and task management entities. The models align with the requirements for Phase II implementation using Better Auth, FastAPI, SQLModel, and Neon Serverless PostgreSQL.

## Entity Models

### User (Managed by Better Auth)
The User entity is primarily managed by Better Auth, but we define our own representation for integration purposes.

```sql
Table: users (managed by Better Auth)
- id: string (primary key) - Unique identifier for the user
- email: string (unique) - User's email address
- name: string - User's display name
- created_at: timestamp - Account creation time
- updated_at: timestamp - Last account update time
```

**Fields from requirements:**
- Email required for authentication
- Name for personalization
- ID for linking tasks to users

### Task
The Task entity represents individual tasks assigned to users.

```sql
Table: tasks
- id: integer (primary key) - Auto-incrementing unique identifier
- user_id: string (foreign key -> users.id) - Links task to owner
- title: string (not null, max 200 chars) - Task title
- description: text (nullable, max 1000 chars) - Task description
- completed: boolean (default false) - Completion status
- created_at: timestamp - Task creation time
- updated_at: timestamp - Last task update time
```

**Fields from requirements:**
- Title required (1-200 chars)
- Description optional (max 1000 chars)
- Task linked to logged-in user (user_id)
- Completion status (boolean)

## Relationships
- One User to Many Tasks (one-to-many relationship)
- Foreign key constraint: tasks.user_id references users.id

## Validation Rules
From requirements:
- Title: Required, 1-200 characters
- Description: Optional, max 1000 characters
- Task must be associated with a valid user

## State Transitions
- Task starts as incomplete (completed: false)
- Task can be marked as complete (completed: true)
- Task can be marked as incomplete again (completed: false)

## Indexes
For performance optimization:
- Index on tasks.user_id (for filtering by user)
- Index on tasks.completed (for status filtering)
- Composite index on (user_id, completed) for combined filtering

## API Representation
The following Pydantic models define the API contracts:

### TaskCreate
- title: string (required)
- description: string (optional)

### TaskRead
- id: integer
- user_id: string
- title: string
- description: string (optional)
- completed: boolean
- created_at: datetime
- updated_at: datetime

### TaskUpdate
- title: string (optional)
- description: string (optional)

### TaskToggleComplete
- completed: boolean (optional)

## Database Schema
Using SQLModel for ORM mapping:

```python
class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now, sa_column=Column(DateTime, default=datetime.now))
    updated_at: datetime = Field(default_factory=datetime.now, sa_column=Column(DateTime, default=datetime.now, onupdate=datetime.now))
```

## Security Considerations
- User isolation: Each user can only access their own tasks via user_id
- Foreign key constraints prevent orphaned tasks
- Proper indexing enables efficient user-based queries