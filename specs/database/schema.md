# Database Schema

## Tables

### users (Better Auth managed)
- id: string (PK)
- email: string (unique)
- name: string
- created_at: timestamp

### tasks
- id: integer (PK)
- user_id: string (FK -> users.id)
- title: string (not null)
- description: text (nullable)
- completed: boolean (default false)
- created_at: timestamp
- updated_at: timestamp

## Indexes
- tasks.user_id
- tasks.completed
