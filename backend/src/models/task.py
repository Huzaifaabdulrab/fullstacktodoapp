from sqlmodel import SQLModel, Field, create_engine, Session
from typing import Optional
from datetime import datetime
from sqlalchemy import Column, DateTime


class Task(SQLModel, table=True):
    """
    Task model representing a user's task with title, description, and completion status.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now, sa_column=Column(DateTime, default=datetime.now))
    updated_at: datetime = Field(default_factory=datetime.now, sa_column=Column(DateTime, default=datetime.now, onupdate=datetime.now))


# Pydantic models for API requests/responses
from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None


class TaskRead(TaskCreate):
    id: int
    user_id: str
    completed: bool
    created_at: datetime
    updated_at: datetime


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class TaskToggleComplete(BaseModel):
    completed: Optional[bool] = None