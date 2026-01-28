# src/services/task_service.py
# This file was not provided in the query, but assuming it's there based on the router usage.
# If not, add this new file: src/services/task_service.py

from sqlmodel import Session, select
from src.models.task import Task, TaskCreate, TaskUpdate, TaskToggleComplete
from typing import List, Optional


class TaskService:
    @staticmethod
    def get_user_tasks(session: Session, user_id: str, status: Optional[str] = None) -> List[Task]:
        statement = select(Task).where(Task.user_id == user_id)
        if status == "pending":
            statement = statement.where(Task.completed == False)
        elif status == "completed":
            statement = statement.where(Task.completed == True)
        return session.exec(statement).all()

    @staticmethod
    def create_task(session: Session, user_id: str, task_data: TaskCreate) -> Task:
        task = Task(user_id=user_id, title=task_data.title, description=task_data.description)
        session.add(task)
        session.commit()
        session.refresh(task)
        return task

    @staticmethod
    def get_task_by_id(session: Session, user_id: str, task_id: int) -> Optional[Task]:
        return session.exec(select(Task).where(Task.id == task_id, Task.user_id == user_id)).first()

    @staticmethod
    def update_task(session: Session, user_id: str, task_id: int, task_data: TaskUpdate) -> Optional[Task]:
        task = TaskService.get_task_by_id(session, user_id, task_id)
        if not task:
            return None
        if task_data.title is not None:
            task.title = task_data.title
        if task_data.description is not None:
            task.description = task_data.description
        session.add(task)
        session.commit()
        session.refresh(task)
        return task

    @staticmethod
    def delete_task(session: Session, user_id: str, task_id: int) -> bool:
        task = TaskService.get_task_by_id(session, user_id, task_id)
        if not task:
            return False
        session.delete(task)
        session.commit()
        return True

    @staticmethod
    def toggle_task_completion(session: Session, user_id: str, task_id: int, toggle_data: Optional[TaskToggleComplete] = None) -> Optional[Task]:
        task = TaskService.get_task_by_id(session, user_id, task_id)
        if not task:
            return None
        if toggle_data and toggle_data.completed is not None:
            task.completed = toggle_data.completed
        else:
            task.completed = not task.completed
        session.add(task)
        session.commit()
        session.refresh(task)
        return task