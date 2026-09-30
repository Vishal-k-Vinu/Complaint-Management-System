from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User
from app.models.complaint import Complaint


def create_user(
    db,
    first_name,
    last_name,
    username,
    email,
    password,
    role,
):
    existing_user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if existing_user:
        print(
            f"User '{username}' already exists. Skipping."
        )
        return

    existing_email = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_email:
        print(
            f"Email '{email}' already exists. Skipping."
        )
        return

    user = User(
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email,
        password_hash=hash_password(password),
        role=role,
        is_active=True,
    )

    db.add(user)

    print(
        f"Created {role}: {username}"
    )


def main():
    db = SessionLocal()

    try:

        create_user(
            db=db,
            first_name="Alice",
            last_name="Admin",
            username="admin1",
            email="alice.admin@college.com",
            password="Admin@1234",
            role="ADMIN",
        )

        create_user(
            db=db,
            first_name="Bob",
            last_name="Supervisor",
            username="staff1",
            email="bob.supervisor@college.com",
            password="Staff@1234",
            role="STAFF",
        )

        create_user(
            db=db,
            first_name="Student",
            last_name="User",
            username="user1",
            email="student.user@college.com",
            password="User@1234",
            role="USER",
        )

       

        db.commit()

        print("Account seeding completed.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()