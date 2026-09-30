import api from "./api";

export const getAdminProfile = async () => {
    const response = await api.get("/api/admin/me");
    return response.data;
};

export const getAllComplaints = async () => {
    const response = await api.get(
        "/api/admin/complaints"
    );

    return response.data;
};

export const getAdminComplaint = async (complaintId) => {
    const response = await api.get(
        `/api/admin/complaints/${complaintId}`
    );

    return response.data;
};

export const assignComplaint = async (complaintId) => {
    const response = await api.post(
        `/api/admin/complaints/${complaintId}/assign`
    );

    return response.data;
};

export const getAdminDashboard = async () => {
    const response = await api.get(
        "/api/admin/dashboard"
    );

    return response.data;
};