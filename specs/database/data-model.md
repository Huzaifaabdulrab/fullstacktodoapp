# Data Model: Task CRUD Operations

## Overview
This document defines the data models for the Task CRUD operations feature, including entities, relationships, and validation rules.

## Entities

### Task
**Description**: Represents a user's task with title, description, and completion status.

**Fields**:
- `id`: Integer (Primary Key, Auto-generated)
- `user_id`: String (Foreign Key to users table, required)
- `title`: String (1-200 characters, required)
- `description`: Text (up to 1000 characters, optional, nullable)
- `completed`: Boolean (default: false)
- `created_at`: DateTime (Auto-generated)
- `updated_at`: DateTime (Auto-generated, updates on modification)

**Validation Rules**:
- Title must be 1-200 characters
- Description must be ≤ 1000 characters if provided
- Task must be associated with a valid user_id
- Completed defaults to false when creating a new task

**Relationships**:
- Belongs to one User (via user_id foreign key)
- User can have many Tasks

### User (from Better Auth)
**Description**: Represents an authenticated user in the system (managed by Better Auth).

**Fields**:
- `id`: String (Primary Key)
- `email`: String (Unique, required)
- `name`: String (optional)
- `created_at`: DateTime (Auto-generated)

**Relationships**:
- Has many Tasks (via tasks.user_id foreign key)

## State Transitions

### Task Completion
- `completed: false` → `completed: true` (when marking as complete)
- `completed: true` → `completed: false` (when marking as incomplete)

## Indexes

### Task Table
- Index on `user_id` (for efficient user-based queries)
- Index on `completed` (for efficient status-based filtering)
- Composite index on (`user_id`, `completed`) for combined filtering

## Constraints

1. **Referential Integrity**: All tasks must have a valid user_id that exists in the users table
2. **Data Validation**: Title length and description length constraints enforced at database level
3. **Ownership**: Users can only access/modify their own tasks