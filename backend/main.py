# src/main.py
# Modified: Add auth_router include

from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.api.tasks import router as tasks_router
from src.api.auth import router as auth_router  # Added
from src.db.database import create_db_and_tables
from src.auth.middleware import jwt_middleware
from fastapi.middleware.cors import CORSMiddleware
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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add middleware
app.middleware("http")(jwt_middleware)

# Include the routes
app.include_router(tasks_router, prefix="/api")  # Already there
app.include_router(auth_router, prefix="/api")  # Added

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo App Backend API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database_url": os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")} 