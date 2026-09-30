from datetime import datetime

from pydantic import BaseModel, Field


class ComplaintCreate(BaseModel):
    title: str = Field(min_length=5, max_length=200)
    description: str = Field(min_length=10)
    category: str = Field(min_length=2, max_length=100)


class ComplaintResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True