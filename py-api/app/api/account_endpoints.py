from fastapi import APIRouter, HTTPException
from google.auth.transport import requests
from google.oauth2 import id_token
from pydantic import BaseModel

from app import config
from app.services.account_service import login_user, get_user_by_id, delete_user, create_user, google_login_or_create

router = APIRouter(prefix="/api/user", tags=["api"])


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    userId: int
    email: str
    message: str


class GoogleLoginRequest(BaseModel):
    credential: str


class CreateUserRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
async def login(credentials: LoginRequest):
    """
    Authenticate user with email and password
    Returns user info if successful
    """
    user = login_user(credentials.email, credentials.password)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return LoginResponse(
        userId=user.userId,
        email=user.email,
        message="Login successful"
    )


@router.post("/google-login")
async def google_login(request: GoogleLoginRequest):
    """
    Login with Google OAuth.
    Automatically creates a new account on first login.
    """
    try:
        # Verify the Google token
        idinfo = id_token.verify_oauth2_token(
            request.credential,
            requests.Request(),
            config.GOOGLE_CLIENT_ID
        )

        # Extract user info from Google token
        google_id = idinfo['sub']
        email = idinfo['email']

        # Get or create user (automatically creates if first time)
        user = google_login_or_create(google_id, email)

        return {
            "success": True,
            "userId": user.userId,
            "email": user.email,
            "message": "Login successful"
        }

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid Google token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during Google authentication: {str(e)}"
        )


@router.post("/register")
async def register(user_data: CreateUserRequest):
    """ Create a new user account """
    try:
        user = create_user(user_data.email, user_data.password)
        return {
            "success": True,
            "userId": user.userId,
            "email": user.email,
            "message": "Account created successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create account")


@router.delete("/{user_id}")
async def delete_account(user_id: int):
    """ Delete a user account """
    success = delete_user(user_id)

    if not success:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "success": True,
        "message": "Account deleted successfully"
    }


@router.get("/{user_id}")
async def get_user(user_id: int):
    """ Get user information by ID """
    user = get_user_by_id(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "userId": user.userId,
        "email": user.email
    }

