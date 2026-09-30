from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.core.dependencies import get_current_staff
from app.models.complaint import Complaint
from app.models.user import User

router = APIRouter(
    prefix="/api/staff",
    tags=["Staff"],
)


class ComplaintStatusUpdate(BaseModel):
    status: str


@router.put("/complaints/{complaint_id}/status")
def update_complaint_status(
    complaint_id: int,
    data: ComplaintStatusUpdate,
    current_staff: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    complaint = (
        db.query(Complaint)
        .filter(
            Complaint.id == complaint_id,
            Complaint.assigned_staff_id == current_staff.id,
        )
        .first()
    )

    if complaint is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assigned complaint not found.",
        )

    allowed_statuses = {
        "PENDING",
        "IN_PROGRESS",
        "RESOLVED",
    }

    if data.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid complaint status.",
        )

    current_status = complaint.status

    valid_transition = (
        (current_status == "PENDING"
         and data.status == "IN_PROGRESS")
        or
        (current_status == "IN_PROGRESS"
         and data.status == "RESOLVED")
        or
        (current_status == data.status)
    )

    if not valid_transition:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Cannot change status from "
                f"{current_status} to {data.status}."
            ),
        )

    complaint.status = data.status

    db.commit()
    db.refresh(complaint)

    return {
        "message": "Complaint status updated successfully.",
        "complaint_id": complaint.id,
        "status": complaint.status,
    }


@router.get("/complaints")
def get_assigned_complaints(
    current_staff: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    complaints = (
        db.query(Complaint)
        .filter(Complaint.assigned_staff_id == current_staff.id)
        .order_by(Complaint.created_at.desc())
        .all()
    )
    return complaints


@router.get("/complaints/{complaint_id}")
def get_staff_complaint(
    complaint_id: int,
    current_staff: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    complaint = (
        db.query(Complaint)
        .filter(
            Complaint.id == complaint_id,
            Complaint.assigned_staff_id == current_staff.id,
        )
        .first()
    )

    if complaint is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assigned complaint not found.",
        )

    return complaint