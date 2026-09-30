from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import redis
from app.core.database import Base, engine
from app.models.user import User
from app.models.complaint import Complaint
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.complaints import router as complaints_router
from app.core.redis import redis_client
from app.routers import admin, staff

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Complaint Management System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(complaints_router)
app.include_router(admin.router)
app.include_router(staff.router)

@app.get("/health")
def health_check():
    redis_status = "healthy"

    try:
        redis_client.ping()
    except redis.RedisError:
        redis_status = "unavailable"

    return {
        "status": "healthy",
        "redis": redis_status
    }