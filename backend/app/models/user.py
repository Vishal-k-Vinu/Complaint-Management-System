from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

import random
import string
from app.core.database import Base

def generate_user_id():
    chars = string.ascii_letters + string.digits
    return "".join(random.choice(chars) for _ in range(5))

class User(Base):
    __tablename__ = "users"

    id = Column(String(5), primary_key=True, default=generate_user_id, index=True)

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)

    username = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash = Column(String(255), nullable=False)

    role = Column(
        String(20),
        nullable=False,
        default="USER",
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    complaints = relationship(
        "Complaint",
        foreign_keys="[Complaint.user_id]",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    assigned_complaints = relationship(
        "Complaint",
        foreign_keys="[Complaint.assigned_staff_id]",
        back_populates="assigned_staff",
    )