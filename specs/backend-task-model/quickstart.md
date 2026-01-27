# Quickstart Guide: Backend Task Model

## Overview
This guide provides instructions for implementing and testing the backend Task model in the Todo App.

## Prerequisites
- Python 3.11+
- Poetry or pip for dependency management
- PostgreSQL database (Neon recommended)
- SQLModel installed
- Environment variables set up (.env file)

## Setup Instructions

### 1. Install Dependencies
```bash
# Navigate to backend directory
cd backend

# If using poetry
poetry install

# If using pip
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Create a `.env` file in the backend directory with the following:

```
DATABASE_URL=postgresql://username:password@localhost:5432/todoapp
SQLMODEL_ECHO=true  # Optional: for SQL query logging
```

### 3. Create the Task Model
Create the Task model file at `backend/src/models/task.py`:

```python
from sqlmodel import SQLModel, Field, create_engine, Session
from typing import Optional
from datetime import datetime
from sqlalchemy import Column, DateTime


class Task(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(sa_column=Column(DateTime, default=datetime.now))
    updated_at: datetime = Field(sa_column=Column(DateTime, default=datetime.now, onupdate=datetime.now))


# Example usage
def create_task_example():
    # Create database engine
    engine = create_engine("postgresql://username:password@localhost:5432/todoapp")
    
    # Create tables
    SQLModel.metadata.create_all(engine)
    
    # Create a task
    task = Task(
        user_id="user123",
        title="Sample Task",
        description="This is a sample task",
        completed=False
    )
    
    # Save to database
    with Session(engine) as session:
        session.add(task)
        session.commit()
        session.refresh(task)
        
    return task
```

### 4. Run Database Migrations
```bash
# Create initial migration
python -m src.database.migrate create initial

# Apply migrations
python -m src.database.migrate upgrade
```

## Testing the Task Model

### 1. Unit Tests
Create unit tests for the Task model in `backend/tests/unit/test_task_model.py`:

```python
import pytest
from src.models.task import Task
from datetime import datetime


def test_task_creation():
    """Test creating a Task instance"""
    task = Task(
        user_id="user123",
        title="Test Task",
        description="This is a test task",
        completed=False
    )
    
    assert task.title == "Test Task"
    assert task.description == "This is a test task"
    assert task.completed is False
    assert task.user_id == "user123"


def test_task_title_validation():
    """Test title length validation"""
    # Valid title
    task = Task(user_id="user123", title="Valid Title")
    assert len(task.title) <= 200
    
    # Test with longer title (should pass validation at model level,
    # but fail at database level due to constraint)
    long_title = "a" * 201
    task_long = Task(user_id="user123", title=long_title[:200])  # Truncate to valid length
    assert len(task_long.title) <= 200


def test_task_default_values():
    """Test default values for Task model"""
    task = Task(user_id="user123", title="Test Task")
    
    assert task.completed is False
    assert task.created_at is not None
    assert task.updated_at is not None
```

### 2. Running Tests
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/unit/test_task_model.py

# Run with coverage
pytest --cov=src.models.task
```

### 3. Manual Testing
```python
# Example of creating and manipulating Task objects
from src.models.task import Task

# Create a new task
task = Task(
    user_id="user123",
    title="Learn SQLModel",
    description="Implement the Task model for the Todo App",
    completed=False
)

# Verify the task properties
print(f"Task ID: {task.id}")  # Will be None until saved to DB
print(f"Title: {task.title}")
print(f"Completed: {task.completed}")
print(f"Created at: {task.created_at}")

# Update task status
task.completed = True
task.updated_at = datetime.now()

print(f"Updated task completed status: {task.completed}")
```

## Integration with API
Once the Task model is implemented, it can be integrated with the API endpoints defined in the contracts. The model will be used in the following ways:

- Creating new tasks via POST requests
- Retrieving tasks via GET requests
- Updating tasks via PUT requests
- Deleting tasks via DELETE requests

## Troubleshooting
- If you get database connection errors, verify your DATABASE_URL is correct
- If model validation fails, check that field constraints are met
- If migrations fail, ensure your database is accessible and credentials are correct
- Check the SQLModel documentation for any syntax issues