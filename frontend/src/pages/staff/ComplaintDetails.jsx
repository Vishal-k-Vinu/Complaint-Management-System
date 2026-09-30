import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    getStaffComplaint,
    updateComplaintStatus,
} from "../../services/staff";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";

const categoryLabels = {
    MAINTENANCE: "Maintenance",
    ROOM_SERVICE: "Room Service",
    FOOD_SERVICE: "Food Service",
};

const statusLabels = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
};

export default function StaffComplaintDetails() {
    const { complaintId } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadComplaint = async () => {
            try {
                const data = await getStaffComplaint(complaintId);
                setComplaint(data);
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                    "Failed to load complaint."
                );
            } finally {
                setLoading(false);
            }
        };

        loadComplaint();
    }, [complaintId]);

    const handleStatusUpdate = async (newStatus) => {
        setUpdating(true);
        setError("");
        setSuccess("");

        try {
            const response = await updateComplaintStatus(
                complaintId,
                newStatus
            );

            setComplaint((current) => ({
                ...current,
                status: response.status,
            }));

            setSuccess(
                "Complaint status updated successfully."
            );
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Failed to update complaint status."
            );
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="py-12 text-center text-sm text-neutral-500">
                Loading complaint...
            </div>
        );
    }

    if (error && !complaint) {
        return (
            <div className="space-y-4">
                <Link
                    to="/staff/complaints"
                    className="text-sm text-neutral-500 hover:text-neutral-950"
                >
                    ← Back to complaints
                </Link>

                <div className="border border-red-200 bg-white p-6">
                    <p className="text-sm text-red-700">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    if (!complaint) {
        return null;
    }

    const nextStatus =
        complaint.status === "PENDING"
            ? "IN_PROGRESS"
            : complaint.status === "IN_PROGRESS"
                ? "RESOLVED"
                : null;

    return (
        <div className="mx-auto max-w-4xl space-y-8">

            {/* Back */}
            <Link
                to="/staff/complaints"
                className="inline-block text-sm text-neutral-500 hover:text-neutral-950"
            >
                ← Back to complaints
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-start sm:justify-between">

                <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                        Complaint #{complaint.id}
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                        {complaint.title}
                    </h1>
                </div>

                <StatusBadge status={complaint.status} />

            </div>

            {/* Complaint Information */}
            <section className="border border-neutral-200 bg-white">

                <div className="border-b border-neutral-200 px-6 py-5">
                    <h2 className="text-base font-semibold text-neutral-950">
                        Complaint Information
                    </h2>
                </div>

                <div className="space-y-6 px-6 py-6">

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                            Category
                        </p>

                        <p className="mt-2 text-sm text-neutral-950">
                            {categoryLabels[complaint.category] ||
                                complaint.category}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                            Description
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                            {complaint.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                                Created
                            </p>

                            <p className="mt-2 text-sm text-neutral-700">
                                {new Date(
                                    complaint.created_at
                                ).toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                                Last Updated
                            </p>

                            <p className="mt-2 text-sm text-neutral-700">
                                {new Date(
                                    complaint.updated_at
                                ).toLocaleString()}
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            {/* Status Management */}
            <section className="border border-neutral-200 bg-white">

                <div className="border-b border-neutral-200 px-6 py-5">
                    <h2 className="text-base font-semibold text-neutral-950">
                        Resolution Status
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                        Update the complaint after coordinating the work and confirming its completion.
                    </p>
                </div>

                <div className="px-6 py-6">

                    {success && (
                        <div className="mb-5 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                                Current Status
                            </p>

                            <div className="mt-2">
                                <StatusBadge
                                    status={complaint.status}
                                />
                            </div>
                        </div>

                        {nextStatus && (
                            <Button
                                onClick={() =>
                                    handleStatusUpdate(nextStatus)
                                }
                                loading={updating}
                            >
                                Mark as{" "}
                                {statusLabels[nextStatus]}
                            </Button>
                        )}

                    </div>

                    {!nextStatus && (
                        <div className="mt-4 border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
                            This complaint has been resolved.
                        </div>
                    )}

                </div>
            </section>

        </div>
    );
}