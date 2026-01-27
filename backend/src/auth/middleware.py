from fastapi import Request, HTTPException, status
from src.auth.jwt_handler import verify_token


async def jwt_middleware(request: Request, call_next):
    """
    Middleware to verify JWT token for protected routes.
    This is a basic implementation - in production, you'd want to be more selective
    about which routes require authentication.
    """
    # Define which paths don't require authentication
    public_paths = ["/docs", "/redoc", "/openapi.json", "/health", "/"]

    # Skip authentication for public paths
    if request.url.path in public_paths or request.url.path.startswith("/api/auth"):
        response = await call_next(request)
        return response

    # For API routes, check for JWT token
    if request.url.path.startswith("/api/"):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = auth_header.split(" ")[1]  # Get the actual token part
        try:
            payload = verify_token(token)
            # Add user info to request state for use in route handlers
            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials - no user ID in token",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            request.state.user_id = user_id

        except HTTPException:
            # Re-raise HTTP exceptions as-is
            raise
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

    response = await call_next(request)
    return response