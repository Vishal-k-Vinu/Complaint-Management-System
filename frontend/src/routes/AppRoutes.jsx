import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import GuestCreateComplaint from "../pages/guest/GuestCreateComplaint";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import AppLayout from "../components/layout/AppLayout";
import AdminLayout from "../components/admin/AdminLayout";
import AdminComplaints from "../pages/admin/Complaints";
import Dashboard from "../pages/user/Dashboard";
import Complaints from "../pages/user/Complaints";
import CreateComplaint from "../pages/user/CreateComplaint";
import ComplaintDetails from "../pages/user/ComplaintDetails";
import Profile from "../pages/user/Profile";
import AdminComplaintDetails from "../pages/admin/ComplaintDetails";
import StaffRoute from "./StaffRoute";
import StaffLayout from "../components/staff/StaffLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import StaffDashboard from "../pages/staff/Dashboard";
import StaffComplaints from "../pages/staff/Complaints";
import StaffComplaintDetails from "../pages/staff/ComplaintDetails";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/guest-complaint"
          element={<GuestCreateComplaint />}
        />

        {/* Student/User routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/complaints"
              element={<Complaints />}
            />

            <Route
              path="/complaints/new"
              element={<CreateComplaint />}
            />

            <Route
              path="/complaints/:complaintId"
              element={<ComplaintDetails />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/complaints"
              element={<AdminComplaints />}
            />
            <Route
              path="/admin/complaints/:complaintId"
              element={<AdminComplaintDetails />}
            />

          </Route>
        </Route>

        <Route element={<StaffRoute />}>
          <Route element={<StaffLayout />}>

            <Route
              path="/staff"
              element={<StaffDashboard />}
            />

            <Route
              path="/staff/complaints"
              element={<StaffComplaints />}
            />
            <Route
              path="/staff/complaints/:complaintId"
              element={<StaffComplaintDetails />}
            />

          </Route>
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes >
    </BrowserRouter >
  );
}