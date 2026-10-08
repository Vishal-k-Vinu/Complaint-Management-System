# Complaint Management System

A production-grade, role-based complaint management system tailored for operational and facility management (e.g., college operations). It features dedicated portals for Users (Students), Staff (Supervisors), and Administrators, ensuring seamless registration, delegation, and resolution of issues.

---

## 🎯 Features

- **Role-Based Portals**:
  - **Guest Portal**: Dedicated non-authenticated portal to register complaints effortlessly without requiring an account.
  - **User (Student) Portal**: Register complaints, track status, and view your personal complaint history.
  - **Staff (Supervisor) Portal**: View assigned complaints and update their resolution status (`PENDING` -> `IN_PROGRESS` -> `RESOLVED`).
  - **Admin Portal**: Overview of all complaints, analytics dashboard, and delegation of complaints to specific staff members.
- **Real-time Status Tracking**: Instant updates on the status of raised complaints.
- **JWT Authentication & Authorization**: Secure, token-based authentication with robust role verification to protect sensitive endpoints.
- **Modern, Responsive UI**: Beautifully crafted frontend powered by React and Tailwind CSS v4.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: PostgreSQL (via [SQLAlchemy](https://www.sqlalchemy.org/) ORM)
- **Caching**: [Redis](https://redis.io/)
- **Authentication**: JWT (JSON Web Tokens) with standard OAuth2 password bearer

### Frontend
- **Library**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Network Requests**: Axios

---

## 📂 Project Structure

```
Web-app/
├── backend/                # FastAPI Application
│   ├── app/                
│   │   ├── core/           # Config, DB, Redis, Auth dependencies
│   │   ├── models/         # SQLAlchemy database models
│   │   ├── routers/        # API endpoints (admin, staff, users, complaints, auth)
│   │   ├── schemas/        # Pydantic models for validation
│   │   └── main.py         # FastAPI application entry point
│   ├── seed.py             # Database seeding script for default users
│   └── requirements.txt    # Python dependencies
│
└── frontend/               # React Application
    ├── src/
    │   ├── components/     # Reusable UI components & layouts
    │   ├── context/        # React context (AuthContext)
    │   ├── pages/          # View components separated by roles
    │   ├── routes/         # Protected and Role-based routing logic
    │   └── services/       # Axios API client integrations
    ├── package.json        # Node dependencies
    └── vite.config.js      # Vite configuration
```

---

## 🚀 Setup and Installation (Docker)

The easiest way to run the application is using Docker and Docker Compose. This ensures both the frontend and backend are spun up with the correct configurations automatically.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running Locally

1. **Configure Environment Variables**:
   Create a `.env` file in the `backend` directory containing your database and Redis configurations (or leave defaults if your services are remote):
   ```env
   DATABASE_URL=postgresql://user:password@remote-db-host:5432/complaint_db
   SECRET_KEY=your_super_secret_jwt_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REDIS_URL=redis://remote-redis-host:6379/0
   ```

2. **Build and Start Containers**:
   From the root of the project, run:
   ```bash
   docker compose up --build
   ```

3. **Access the Applications**:
   - **Frontend App**: [http://localhost:8080](http://localhost:8080)
   - **Backend API**: [http://localhost:8000](http://localhost:8000)
   - **Interactive API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ☁️ Deployment (Render)

This project is configured to be easily deployable on [Render](https://render.com/).

1. Connect your repository to Render.
2. Create a **Web Service** for the `backend` using the `backend/Dockerfile`.
3. Create a **Web Service** for the `frontend` using the `frontend/Dockerfile`.
4. Ensure you set the necessary environment variables (`DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`) in the Render dashboard for the backend service.
5. The `docker-compose.yml` is also provided if you plan to deploy to a VPS using Docker directly.

---

## 📝 Usage

- **Guest Portal**: Navigate to the login page and click the "Guest Portal for Complaint Registration" link to quickly log an issue without an account.
- **Student Portal**: Log in with a student account (e.g., `user1`) to submit new complaints and track the progress of your past submissions.
- **Staff Operations**: Log in with a Staff account (e.g., `staff1`) to view complaints assigned to you and mark them as `IN_PROGRESS` or `RESOLVED`.
- **Admin Dashboard**: Log in with an Admin account (e.g., `admin1`) to see all complaints, view system analytics, and assign pending issues to specific supervisors.

---

## 📄 License
This project is proprietary and intended for operational use.
