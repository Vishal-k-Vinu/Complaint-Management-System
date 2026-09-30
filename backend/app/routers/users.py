from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.user import (
    PasswordUpdate,
    UserResponse,
    UserUpdate
)
from app.models.complaint import Complaint
from app.schemas.user import DashboardResponse
import json
from app.core.redis import redis_client

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)


@router.get(
    "/me",
    response_model=UserResponse
)
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.put(
    "/me",
    response_model=UserResponse
)
def update_my_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing_email = db.query(User).filter(
        User.email == user_data.email,
        User.id != current_user.id
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    current_user.first_name = user_data.first_name
    current_user.last_name = user_data.last_name
    current_user.email = user_data.email

    db.commit()
    db.refresh(current_user)

    return current_user


@router.put(
    "/me/password"
)
def change_password(
    password_data: PasswordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(
        password_data.current_password,
        current_user.password_hash
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    current_user.password_hash = hash_password(
        password_data.new_password
    )

    db.commit()

    return {
        "message": "Password updated successfully"
    }


@router.get(
    "/me/dashboard",
    response_model=DashboardResponse
)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cache_key = f"user:{current_user.id}:dashboard"

    cached_data = redis_client.get(cache_key)

    if cached_data:
        return json.loads(cached_data)

    complaints = db.query(Complaint).filter(
        Complaint.user_id == current_user.id
    ).all()

    dashboard = {
        "total": len(complaints),
        "pending": sum(
            c.status == "PENDING"
            for c in complaints
        ),
        "in_progress": sum(
            c.status == "IN_PROGRESS"
            for c in complaints
        ),
        "resolved": sum(
            c.status == "RESOLVED"
            for c in complaints
        )
    }

    redis_client.setex(
        cache_key,
        60,
        json.dumps(dashboard)
    )

    return dashboard