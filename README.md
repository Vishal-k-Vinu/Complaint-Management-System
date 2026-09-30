# Complaint Management System

A production-grade, role-based complaint management system tailored for operational and facility management (e.g., college operations). It features dedicated portals for Users (Students), Staff (Supervisors), and Administrators, ensuring seamless registration, delegation, and resolution of issues.

---

## 🎯 Features

- **Role-Based Portals**:
  - **User (Student) Portal**: Register complaints (login-free option available), track status, and view complaint history.
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

## 🚀 Setup and Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL
- Redis Server

### 1. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment** (optional but recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the `backend` directory containing your database and Redis configurations:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/complaint_db
   SECRET_KEY=your_super_secret_jwt_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REDIS_URL=redis://localhost:6379/0
   ```
   

5. **Start the FastAPI server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The API will be available at http://127.0.0.1:8000*

### 2. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   *The web application will be available at http://127.0.0.1:5173*

---

## 📝 Usage

- **Staff Operations**: Log in with a Staff account (e.g., `staff1`) to view complaints assigned to you and mark them as `IN_PROGRESS` or `RESOLVED`.
- **Admin Dashboard**: Log in with an Admin account (e.g., `admin1`) to see all complaints, view system analytics, and assign pending issues to specific supervisors.

---

## 📄 License
This project is proprietary and intended for operational use.
