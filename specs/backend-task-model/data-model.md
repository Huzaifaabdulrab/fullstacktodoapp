# Data Model: Task Entity

## Overview
This document defines the Task entity data model for the Todo App backend, implemented using SQLModel for compatibility with Neon PostgreSQL.

## Entity: Task

### Fields
- `id`: Integer (Primary Key, Auto-generated)
  - Type: `int`
  - Constraints: Primary key, auto-incrementing
  - Description: Unique identifier for the task

- `user_id`: String (Foreign Key to User.id)
  - Type: `str`
  - Constraints: Foreign key reference to users table
  - Description: ID of the user who owns this task

- `title`: String (Required, max 200 characters)
  - Type: `str`
  - Constraints: Max length of 200 characters, not nullable
  - Description: Title of the task (1-200 characters)

- `description`: Text (Optional)
  - Type: `str` (Text type in database)
  - Constraints: Nullable
  - Description: Detailed description of the task (up to 1000 characters)

- `completed`: Boolean (Default: False)
  - Type: `bool`
  - Constraints: Default value of False
  - Description: Whether the task has been completed

- `created_at`: DateTime (Auto-generated)
  - Type: `datetime`
  - Constraints: Default value of current timestamp
  - Description: Timestamp when the task was created

- `updated_at`: DateTime (Auto-generated, updates on modification)
  - Type: `datetime`
  - Constraints: Updates to current timestamp on record modification
  - Description: Timestamp when the task was last updated

### SQLModel Implementation
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid

class Task(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
    # Relationship to User (assuming User model exists)
    # user: Optional["User"] = Relationship(back_populates="tasks")
```

### Validation Rules
- Title must be 1-200 characters
- Description must be ≤ 1000 characters if provided
- Task must be associated with a valid user_id
- Completed defaults to False when creating a new task
- created_at and updated_at are automatically managed

### Relationships
- Belongs to one User (via user_id foreign key)
- User can have many Tasks

## Indexes
- Index on `user_id` (for efficient user-based queries)
- Index on `completed` (for efficient status-based filtering)
- Composite index on (`user_id`, `completed`) for combined filtering

## Neon PostgreSQL Compatibility
- Uses standard PostgreSQL data types
- Compatible with Neon Serverless features
- Follows best practices for connection pooling