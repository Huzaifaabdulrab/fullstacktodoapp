# src/api/auth.py
# New file: Add this to src/api/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Annotated
from src.db.database import get_session
from src.models.task import User, UserCreate  # Assuming User and UserCreate are in models/task.py
from src.auth.jwt_handler import create_access_token, pwd_context

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserCreate,
    session: Session = Depends(get_session)
):
    """
    Register a new user.
    """
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user_data.password)
    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    access_token = create_access_token({"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=dict)
def login(
    user_data: Annotated[UserCreate, Depends()],  # Reuse UserCreate but ignore name for login
    session: Session = Depends(get_session)
):
    """
    Login a user and return access token.
    """
    user = session.exec(select(User).where(User.email == user_data.email)).first()
    if not user or not pwd_context.verify(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}