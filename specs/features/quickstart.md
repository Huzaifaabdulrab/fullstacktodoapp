# Quickstart Guide: Task CRUD Operations

## Overview
This guide provides instructions for quickly getting started with the Task CRUD operations feature in the Todo App.

## Prerequisites
- Node.js 18+ for frontend
- Python 3.11+ for backend
- PostgreSQL database (Neon recommended)
- Better Auth configured for authentication
- Environment variables set up (.env file)

## Setup Instructions

### 1. Clone and Install Dependencies
```bash
# Clone the repository
git clone <repo-url>
cd todoapp

# Navigate to backend and install Python dependencies
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Navigate to frontend and install Node.js dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in both backend and frontend directories with the following:

Backend (.env):
```
DATABASE_URL=your_postgresql_connection_string
BETTER_AUTH_SECRET=your_auth_secret
```

Frontend (.env):
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. Database Setup
Run the following command in the backend directory to initialize the database:
```bash
cd backend
python -m src.db.init  # Adjust path as needed for your setup
```

### 4. Start the Applications
Start the backend server:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

Start the frontend server:
```bash
cd frontend
npm run dev
```

## Testing the Feature

### 1. Authentication
- Register a new user or sign in to get a JWT token
- The token will be stored in your browser's session

### 2. Creating a Task
- Navigate to the "Create Task" page
- Fill in the title (required, 1-200 characters) and description (optional, max 1000 characters)
- Submit the form to create the task
- Verify the task appears in your task list

### 3. Viewing Tasks
- Navigate to the "My Tasks" page
- View all your tasks with their titles, descriptions, and completion status
- Use filters to show pending, completed, or all tasks

### 4. Updating a Task
- Click on a task to edit it
- Modify the title or description
- Save the changes
- Verify the task has been updated

### 5. Completing/Uncompleting a Task
- Click the checkbox next to a task
- The completion status should toggle
- The UI should reflect the change

### 6. Deleting a Task
- Click the delete button for a task
- Confirm the deletion
- Verify the task is removed from your list

## API Endpoints
For direct API testing, use these endpoints with proper JWT authentication:

- GET `/api/{user_id}/tasks` - Get all tasks for user
- POST `/api/{user_id}/tasks` - Create a new task
- GET `/api/{user_id}/tasks/{id}` - Get specific task
- PUT `/api/{user_id}/tasks/{id}` - Update a task
- DELETE `/api/{user_id}/tasks/{id}` - Delete a task
- PATCH `/api/{user_id}/tasks/{id}/complete` - Toggle completion status

## Troubleshooting
- If you get authentication errors, ensure your JWT token is valid and properly included in requests
- If tasks don't appear, verify the user_id in the API calls matches the authenticated user
- Check the browser console and server logs for specific error messages