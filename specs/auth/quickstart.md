# Quickstart Guide: Authentication Feature

## Overview
This guide provides instructions for quickly getting started with the Authentication feature in the Todo App.

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

### 2. Configure Authentication Environment Variables
Create a `.env` file in both backend and frontend directories with the following:

Backend (.env):
```
DATABASE_URL=your_postgresql_connection_string
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:8000
```

Frontend (.env):
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
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

## Testing the Authentication Feature

### 1. User Registration
- Navigate to the "Sign Up" page
- Fill in the registration form with email, password, and name
- Submit the form to create a new account
- Verify that you receive a success message

### 2. User Login
- Navigate to the "Login" page
- Enter your registered email and password
- Submit the form to log in
- Verify that you're redirected to the dashboard or task list page
- Check that your user profile information is displayed correctly

### 3. JWT Token Verification
- After successful login, a JWT token should be stored securely
- The token will be automatically included in API requests to protected endpoints
- Verify that the token has a 7-day expiration as specified

### 4. Protected Routes
- Try to access protected pages without being logged in
- You should be redirected to the login page
- Log in and verify that you can access protected pages

### 5. User Profile Management
- Navigate to the profile page
- Update your profile information
- Verify that changes are saved correctly

### 6. Logout
- Click the logout button
- Verify that your session is terminated
- Try to access protected pages (should redirect to login)

## API Endpoints
For direct API testing, use these endpoints:

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Authenticate user and get JWT token
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update user profile
- POST `/api/auth/refresh` - Refresh JWT token

## Troubleshooting
- If registration fails, ensure email is unique and password meets requirements
- If login fails, verify credentials are correct
- If JWT tokens aren't working, check that the secret is configured correctly on both frontend and backend
- Check browser console and server logs for specific error messages
- Ensure CORS settings allow communication between frontend and backend