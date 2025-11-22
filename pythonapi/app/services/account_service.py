from typing import Optional

from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app import config
from app.schemas.database_schema import User

engine = create_engine(config.DB_PATH, echo=True, future=True)

class UserData(BaseModel):
    username: str
    password: str


class ResponseUser(BaseModel):
    userId: int
    email: str


def login_user(email: str, password: str):
    """
    Handles logging in a standard user.
    Allows a user to be logged in if they are not a Google account
    """
    with Session(engine) as session:
        user = session.query(User)\
            .filter(User.email == email).first()

        if user.googleId and not user.password:
            raise ValueError("This account uses Google sign in. Please log in using Google account.")

        if user.password == password:
            return ResponseUser(userId=user.userId, email=user.email)

        return None


def google_login_or_create(googleId: str, email: str,):
    """
    Handle Google OAuth login.
    If user exists with this google_id or email, return that user.
    If user doesn't exist, create a new account automatically.
    """
    with Session(engine) as session:
        # check if user exists with this Google ID
        user = session.query(User).filter(User.googleId == googleId).first()
        if user:
            # Update user info in case it changed
            session.commit()
            session.refresh(user)
            return ResponseUser(userId=user.userId, email=user.email)

        # Check if user exists with this email (might be regular account)
        user = session.query(User).filter(User.email == email).first()
        if user:
            # Link Google account to existing email account
            user.googleId = googleId
            session.commit()
            session.refresh(user)
            return ResponseUser(userId=user.userId, email=user.email)

        # User doesn't exist - create new account automatically
        new_user = User(
            email=email,
            googleId=googleId,
            password=None  # Google users don't need password
        )

        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return ResponseUser(userId=new_user.userId, email=new_user.email)


def create_user(email: str, password: Optional[str] = None, google_id: Optional[str] = None):
    """
    Create a new user account
    Raises Error if email already exists, we will only allow one user to use a single email
    """
    with Session(engine) as session:
        # Check if user already exists
        existing_user = session.query(User).filter(User.email == email).first()
        if existing_user:
            raise ValueError(f"User with email {email} already exists")

        if google_id:
            new_user = User(
                email=email,
                google_id=google_id,
                password = None,
            )
        else:
            if not password:
                raise ValueError("password is required for non-Google users")

        # Create new user
        new_user = User(
            email=email,
            password=password,
        )

        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        return ResponseUser(userId=new_user.userId, email=new_user.email)


def delete_user(user_id: int):
    """
    Delete a user account by ID
    Returns True if deleted, False if user not found
    """
    with Session(engine) as session:
        user = session.query(User).filter(User.userId == user_id).first()

        if user:
            session.delete(user)
            session.commit()
            return True

        return False


def get_user_by_id(user_id: int):
    """Get user information by ID"""
    with Session(engine) as session:
        user = session.query(User).filter(User.userId == user_id).first()

        if user:
            return ResponseUser(userId=user.userId, email=user.email)

        return None


def get_user_by_email(email: str):
    """Get user information by an email"""
    with Session(engine) as session:
        user = session.query(User).filter(User.email == email).first()

        if user:
            return ResponseUser(userId=user.userId, email=user.email)

        return None