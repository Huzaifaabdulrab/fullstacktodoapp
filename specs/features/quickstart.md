# Quickstart Guide: Todo Full-Stack Web Application

## Overview
This guide provides step-by-step instructions to set up and run the Todo Full-Stack Web Application with complete authentication, task management, and CRUD functionality.

## Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Poetry (for Python dependency management)
- npm or yarn (for frontend dependency management)
- PostgreSQL (or access to Neon Serverless PostgreSQL)

## Environment Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd todo-app
```

### 2. Set up backend environment
```bash
cd backend
poetry install
poetry shell
```

### 3. Set up frontend environment
```bash
cd ../frontend
npm install
```

## Configuration

### 1. Backend Configuration
Create a `.env` file in the `backend` directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/todo_app"  # For Neon: postgresql://...
BETTER_AUTH_SECRET="your-super-secret-jwt-key-here"  # At least 32 characters
```

### 2. Frontend Configuration
Create a `.env.local` file in the `frontend` directory with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"  # Your frontend URL
```

## Running the Application

### 1. Start the backend server
```bash
cd backend
uvicorn main:app --reload --port 8000
```
The backend will be available at `http://localhost:8000`.

### 2. Start the frontend server
In a new terminal:
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:3000`.

## API Endpoints

Once running, the following endpoints will be available:

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Task Management Endpoints
- `GET /api/tasks` - List all tasks for authenticated user
- `POST /api/tasks` - Create a new task for authenticated user
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/complete` - Toggle completion status

## Database Migrations
The application uses SQLModel which handles automatic table creation on startup. No manual migrations are needed for basic setup.

## Better Auth Integration
The application uses Better Auth for authentication with JWT tokens. The backend verifies JWT tokens issued by Better Auth to ensure secure access to user-specific data.

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure your DATABASE_URL is correctly configured for your PostgreSQL instance
2. **JWT Verification**: Make sure BETTER_AUTH_SECRET is identical in both frontend and backend environments
3. **CORS Issues**: If experiencing CORS errors, ensure your frontend and backend URLs are properly configured

### Verification Steps
1. Check that both servers are running
2. Verify environment variables are set correctly
3. Confirm the database connection is working
4. Test the `/health` endpoint on the backend

## Development
For development, both servers support hot reloading. Changes to the code will automatically reload the respective server.

## Testing
To run backend tests:
```bash
cd backend
pytest
```

To run frontend tests:
```bash
cd frontend
npm run test
```