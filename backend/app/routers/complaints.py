from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.complaint import Complaint
from app.models.user import User
from app.core.security import hash_password
from app.schemas.complaint import (
    ComplaintCreate,
    ComplaintResponse
)
import redis
from app.core.redis import redis_client

router = APIRouter(
    prefix="/api/complaints",
    tags=["Complaints"]
)


@router.post(
    "",
    response_model=ComplaintResponse,
    status_code=status.HTTP_201_CREATED
)
def create_complaint(
    complaint_data: ComplaintCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = Complaint(
        user_id=current_user.id,
        title=complaint_data.title,
        description=complaint_data.description,
        category=complaint_data.category,
        status="PENDING"
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    redis_client.delete(
      f"user:{current_user.id}:dashboard"
    )
    return complaint


@router.post(
    "/guest",
    response_model=ComplaintResponse,
    status_code=status.HTTP_201_CREATED
)
def create_guest_complaint(
    complaint_data: ComplaintCreate,
    db: Session = Depends(get_db)
):
    guest_user = db.query(User).filter(User.username == "guest_user").first()
    if not guest_user:
        guest_user = User(
            first_name="Guest",
            last_name="User",
            username="guest_user",
            email="guest@college.com",
            password_hash=hash_password("guest123"),
            role="USER"
        )
        db.add(guest_user)
        db.commit()
        db.refresh(guest_user)

    complaint = Complaint(
        user_id=guest_user.id,
        title=complaint_data.title,
        description=complaint_data.description,
        category=complaint_data.category,
        status="PENDING"
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    
    # We should delete the guest user's dashboard cache, if any.
    redis_client.delete(f"user:{guest_user.id}:dashboard")
    
    return complaint



@router.get(
    "",
    response_model=list[ComplaintResponse]
)
def get_my_complaints(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaints = db.query(Complaint).filter(
        Complaint.user_id == current_user.id
    ).order_by(
        Complaint.created_at.desc()
    ).all()

    return complaints


@router.get(
    "/{complaint_id}",
    response_model=ComplaintResponse
)
def get_complaint(
    complaint_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id,
        Complaint.user_id == current_user.id
    ).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return complaint