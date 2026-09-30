import api from "./api";

export const getMyComplaints = async () => {
    const response = await api.get("/api/complaints");
    return response.data;
};

export const createComplaint = async (data) => {
    const response = await api.post(
        "/api/complaints",
        data
    );

    return response.data;
};

export const getComplaint = async (complaintId) => {
    const response = await api.get(
        `/api/complaints/${complaintId}`
    );

    return response.data;
};