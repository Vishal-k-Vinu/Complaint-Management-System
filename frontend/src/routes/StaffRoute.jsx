import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StaffRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "STAFF") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}