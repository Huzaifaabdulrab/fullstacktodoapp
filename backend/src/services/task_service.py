from typing import List, Optional
from sqlmodel import Session, select
from src.models.task import Task, TaskCreate, TaskUpdate, TaskToggleComplete
from datetime import datetime


class TaskService:
    """
    Service layer for Task operations.
    Contains all business logic related to tasks.
    """
    
    @staticmethod
    def create_task(session: Session, user_id: str, task_data: TaskCreate) -> Task:
        """
        Create a new task for a user.
        """
        task = Task(
            user_id=user_id,
            title=task_data.title,
            description=task_data.description,
            completed=False
        )
        session.add(task)
        session.commit()
        session.refresh(task)
        return task
    
    @staticmethod
    def get_user_tasks(session: Session, user_id: str, status: Optional[str] = None) -> List[Task]:
        """
        Get all tasks for a specific user, optionally filtered by status.
        """
        query = select(Task).where(Task.user_id == user_id)
        
        if status:
            if status.lower() == 'completed':
                query = query.where(Task.completed == True)
            elif status.lower() == 'pending':
                query = query.where(Task.completed == False)
        
        query = query.order_by(Task.created_at.desc())
        return session.exec(query).all()
    
    @staticmethod
    def get_task_by_id(session: Session, user_id: str, task_id: int) -> Optional[Task]:
        """
        Get a specific task by ID for a user.
        """
        query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        return session.exec(query).first()
    
    @staticmethod
    def update_task(session: Session, user_id: str, task_id: int, task_data: TaskUpdate) -> Optional[Task]:
        """
        Update a task for a user.
        """
        task = TaskService.get_task_by_id(session, user_id, task_id)
        if not task:
            return None
        
        # Update only the fields that are provided
        if task_data.title is not None:
            task.title = task_data.title
        if task_data.description is not None:
            task.description = task_data.description
            
        task.updated_at = datetime.now()
        session.add(task)
        session.commit()
        session.refresh(task)
        return task
    
    @staticmethod
    def delete_task(session: Session, user_id: str, task_id: int) -> bool:
        """
        Delete a task for a user.
        """
        task = TaskService.get_task_by_id(session, user_id, task_id)
        if not task:
            return False
        
        session.delete(task)
        session.commit()
        return True
    
    @staticmethod
    def toggle_task_completion(session: Session, user_id: str, task_id: int, toggle_data: TaskToggleComplete = None) -> Optional[Task]:
        """
        Toggle the completion status of a task for a user.
        """
        task = TaskService.get_task_by_id(session, user_id, task_id)
        if not task:
            return None
        
        # If toggle_data is provided and has a completed value, use that
        # Otherwise, toggle the current value
        if toggle_data and toggle_data.completed is not None:
            task.completed = toggle_data.completed
        else:
            task.completed = not task.completed
            
        task.updated_at = datetime.now()
        session.add(task)
        session.commit()
        session.refresh(task)
        return task