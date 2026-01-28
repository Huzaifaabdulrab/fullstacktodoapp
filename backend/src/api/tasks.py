# src/api/tasks.py
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from typing import List, Optional
from sqlmodel import Session
from src.db.database import get_session
from src.models.task import Task, TaskCreate, TaskRead, TaskUpdate, TaskToggleComplete
from src.services.task_service import TaskService


router = APIRouter(prefix="/api", tags=["tasks"])


@router.get("/{user_id}/tasks", response_model=List[TaskRead])
def get_tasks(
    request: Request,
    user_id: str,
    status: Optional[str] = Query(None, description="Filter tasks by status (pending, completed, all)"),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for a specific user, optionally filtered by status.
    """
    token_user_id = request.state.user_id

    # Verify that the user_id in the token matches the user_id in the URL
    if token_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: User ID mismatch"
        )

    tasks = TaskService.get_user_tasks(session, user_id, status)
    return tasks


@router.post("/{user_id}/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    request: Request,
    user_id: str,
    task_data: TaskCreate,
    session: Session = Depends(get_session)
):
    """
    Create a new task for a specific user.
    """
    token_user_id = request.state.user_id

    # Verify that the user_id in the token matches the user_id in the URL
    if token_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: User ID mismatch"
        )

    task = TaskService.create_task(session, user_id, task_data)
    return task


@router.get("/{user_id}/tasks/{task_id}", response_model=TaskRead)
def get_task(
    request: Request,
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID for a specific user.
    """
    token_user_id = request.state.user_id

    # Verify that the user_id in the token matches the user_id in the URL
    if token_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: User ID mismatch"
        )

    task = TaskService.get_task_by_id(session, user_id, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{user_id}/tasks/{task_id}", response_model=TaskRead)
def update_task(
    request: Request,
    user_id: str,
    task_id: int,
    task_data: TaskUpdate,
    session: Session = Depends(get_session)
):
    """
    Update a task for a specific user.
    """
    token_user_id = request.state.user_id

    # Verify that the user_id in the token matches the user_id in the URL
    if token_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: User ID mismatch"
        )

    task = TaskService.update_task(session, user_id, task_id, task_data)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    request: Request,
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session)
):
    """
    Delete a task for a specific user.
    """
    token_user_id = request.state.user_id

    # Verify that the user_id in the token matches the user_id in the URL
    if token_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: User ID mismatch"
        )

    success = TaskService.delete_task(session, user_id, task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return


@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskRead)
def toggle_task_completion(
    request: Request,
    user_id: str,
    task_id: int,
    toggle_data: TaskToggleComplete = None,
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a task for a specific user.
    """
    token_user_id = request.state.user_id

    # Verify that the user_id in the token matches the user_id in the URL
    if token_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: User ID mismatch"
        )

    task = TaskService.toggle_task_completion(session, user_id, task_id, toggle_data)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task