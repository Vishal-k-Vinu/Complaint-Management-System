from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.complaint import Complaint
from app.models.user import User

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
)


@router.post("/complaints/{complaint_id}/assign")
def assign_complaint_to_staff(
    complaint_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    complaint = (
        db.query(Complaint)
        .filter(Complaint.id == complaint_id)
        .first()
    )

    if complaint is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found.",
        )

    staff = (
        db.query(User)
        .filter(
            User.role == "STAFF",
            User.is_active == True,
        )
        .order_by(User.id.asc())
        .first()
    )

    if staff is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active staff member is available.",
        )

    complaint.assigned_staff_id = staff.id

    db.commit()
    db.refresh(complaint)

    return {
        "message": "Complaint assigned successfully.",
        "complaint_id": complaint.id,
        "assigned_staff": {
            "id": staff.id,
            "username": staff.username,
            "first_name": staff.first_name,
            "last_name": staff.last_name,
        },
    }

from sqlalchemy import func

@router.get("/dashboard")
def admin_dashboard(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    total = (
        db.query(Complaint)
        .count()
    )

    pending = (
        db.query(Complaint)
        .filter(
            Complaint.status == "PENDING"
        )
        .count()
    )

    in_progress = (
        db.query(Complaint)
        .filter(
            Complaint.status == "IN_PROGRESS"
        )
        .count()
    )

    resolved = (
        db.query(Complaint)
        .filter(
            Complaint.status == "RESOLVED"
        )
        .count()
    )

    unassigned = (
        db.query(Complaint)
        .filter(
            Complaint.assigned_staff_id.is_(None)
        )
        .count()
    )

    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "unassigned": unassigned,
    }

@router.get("/complaints")
def get_all_complaints(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    complaints = (
        db.query(Complaint)
        .order_by(Complaint.created_at.desc())
        .all()
    )

    return complaints


@router.get("/complaints/{complaint_id}")
def get_admin_complaint(
    complaint_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    complaint = (
        db.query(Complaint)
        .filter(Complaint.id == complaint_id)
        .first()
    )

    if complaint is None:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found.",
        )

    return complaint