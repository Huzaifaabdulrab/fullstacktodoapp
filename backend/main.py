from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.api.tasks import router as tasks_router
from src.db.database import create_db_and_tables
from src.auth.middleware import jwt_middleware
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Creating database tables...")
    create_db_and_tables()
    print("Database tables created.")
    yield
    # Shutdown (if needed)


app = FastAPI(lifespan=lifespan)

# Add middleware
app.middleware("http")(jwt_middleware)

# Include the task routes
app.include_router(tasks_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo App Backend API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database_url": os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")}