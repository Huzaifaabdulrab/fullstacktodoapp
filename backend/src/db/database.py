from sqlmodel import create_engine
from sqlalchemy import event
from sqlalchemy.pool import Pool
import os
from typing import Generator
from contextlib import contextmanager


# Database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# Create the database engine
engine = create_engine(DATABASE_URL, echo=True)


def get_session():
    """Get a database session."""
    from sqlmodel import Session
    with Session(engine) as session:
        yield session


# Optional: Add connection pooling configuration
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Set SQLite pragmas for better performance (only for SQLite)."""
    if 'sqlite' in engine.url.drivername:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")  # Enable foreign key constraints
        cursor.close()


def create_db_and_tables():
    """Create database tables."""
    from src.models.task import Task
    from sqlmodel import SQLModel
    
    SQLModel.metadata.create_all(engine)