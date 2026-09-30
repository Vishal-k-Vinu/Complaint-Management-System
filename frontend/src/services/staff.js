import api from "./api";

export const getStaffProfile = async () => {
    const response = await api.get("/api/staff/me");

    return response.data;
};

export const getAssignedComplaints = async () => {
    const response = await api.get(
        "/api/staff/complaints"
    );

    return response.data;
};

export const getStaffComplaint = async (complaintId) => {
    const response = await api.get(
        `/api/staff/complaints/${complaintId}`
    );

    return response.data;
};

export const updateComplaintStatus = async (
    complaintId,
    status
) => {
    const response = await api.put(
        `/api/staff/complaints/${complaintId}/status`,
        {
            status,
        }
    );

    return response.data;
};