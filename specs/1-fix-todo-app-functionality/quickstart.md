# Quickstart Guide: Fix Todo App Functionality

## Overview
This guide provides instructions for quickly getting started with fixing the broken Todo App functionality.

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

## Testing the Fixed Functionality

### 1. Authentication
- Navigate to the login page
- Verify that login and signup forms render correctly
- Log in with valid credentials to get a JWT token
- Verify that the token is stored securely and used in API requests

### 2. Task Operations
- Navigate to the tasks page after logging in
- Verify that you can create a new task with title and description
- Verify that created tasks appear in your task list
- Test updating a task's details
- Test marking a task as complete/incomplete
- Test deleting a task

### 3. UI Consistency
- Verify that the UI layout is consistent across all pages
- Check that all components render without errors
- Verify that error messages are user-friendly
- Test responsive design on different screen sizes

## Troubleshooting
- If you get authentication errors, ensure your JWT token is valid and properly included in requests
- If tasks don't appear, verify the user_id in the API calls matches the authenticated user
- Check the browser console and server logs for specific error messages
- Verify that all dependencies are properly installed
- Ensure environment variables are correctly set