# Research: Todo Full-Stack Web Application Phase II

## Overview
This document captures research findings and technical decisions for implementing the complete authentication, middleware, login/signup, task cards, task editing, and full CRUD functionality for the Todo App as specified in the Phase II requirements.

## Gap Analysis
After analyzing the current implementation, the following gaps were identified:

### 1. API Endpoint Structure
**Issue**: Current API endpoints use `/api/tasks` format instead of required `/api/{user_id}/tasks` format.
**Solution**: Update backend routes to include user_id in the path and ensure proper user identification from JWT token.
**Impact**: Requires changes to both backend route definitions and frontend API calls.

### 2. Better Auth Integration
**Issue**: Current implementation uses custom authentication instead of Better Auth.
**Solution**: Replace custom auth with Better Auth integration, ensuring JWT tokens are properly issued and validated.
**Impact**: Major change to authentication system, requiring updates to both frontend and backend.

### 3. Frontend Authentication Flow
**Issue**: Frontend uses placeholder user IDs instead of proper authentication flow with Better Auth.
**Solution**: Implement Better Auth in the frontend to handle user registration/login and JWT token management.
**Impact**: Significant changes to frontend authentication components and state management.

### 4. API URL Configuration
**Issue**: Frontend API URL is hardcoded to a specific IP address.
**Solution**: Use environment variables for API base URL configuration.
**Impact**: Minor configuration change.

## Decision: Backend API Structure
**Rationale**: Need to align backend API with the specified requirements for user isolation.
**Decision**: Update FastAPI routes to follow the pattern `/api/{user_id}/tasks` and verify that the user_id in the URL matches the user_id decoded from the JWT token.
**Alternatives considered**: Keeping current structure vs. updating to match spec - chose to update to match spec for security and compliance.

## Decision: Better Auth Integration
**Rationale**: Requirement specifies using Better Auth for authentication.
**Decision**: Replace current custom authentication with Better Auth, configuring it to issue JWT tokens that can be verified by the FastAPI backend.
**Alternatives considered**: Continuing with custom auth vs. switching to Better Auth - chose Better Auth to comply with requirements.

## Decision: Frontend Authentication Components
**Rationale**: Need to implement login/signup functionality that integrates with Better Auth.
**Decision**: Create dedicated login and signup pages/components that interface with Better Auth.
**Alternatives considered**: Modifying existing components vs. creating new ones - chose new components for cleaner separation.

## Decision: Task Card and Editing Interface
**Rationale**: Requirements specify implementing task cards and editing functionality.
**Decision**: Enhance existing TaskItem and TaskForm components to provide better UX for task management.
**Alternatives considered**: Building from scratch vs. enhancing existing components - chose enhancement to leverage existing work.

## Best Practices: JWT Token Verification
**Rationale**: Need to ensure secure verification of JWT tokens between frontend and backend.
**Decision**: Implement proper JWT verification middleware in FastAPI that validates tokens issued by Better Auth.
**Alternatives considered**: Different token formats or verification methods - chose JWT for its stateless nature and industry standard.

## Patterns: Environment Configuration
**Rationale**: Need to properly configure environment variables for both frontend and backend.
**Decision**: Use .env files for local development with proper environment variable names (e.g., NEXT_PUBLIC_API_BASE_URL, DATABASE_URL, BETTER_AUTH_SECRET).
**Alternatives considered**: Hardcoding values vs. environment variables - chose environment variables for security and flexibility.

## Security Considerations
**Issue**: Ensuring proper user isolation where each user only sees their own tasks.
**Solution**: Implement middleware that verifies the user_id in the JWT token matches the user_id in the API path.
**Implementation**: Add validation in the JWT middleware to compare token subject with URL parameter.

## Implementation Plan
1. Integrate Better Auth in the frontend
2. Update backend to verify Better Auth JWT tokens
3. Modify API endpoints to follow `/api/{user_id}/tasks` pattern
4. Update frontend API calls to include proper user_id
5. Create login/signup pages
6. Enhance task card and editing interfaces
7. Configure proper environment variables