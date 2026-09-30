import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAssignedComplaints } from "../../services/staff";
import StatusBadge from "../../components/common/StatusBadge";

const categoryLabels = {
    MAINTENANCE: "Maintenance",
    HOSTEL: "Hostel",
    RAGGING: "Ragging",
};

export default function StaffDashboard() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadComplaints = async () => {
            try {
                const data = await getAssignedComplaints();
                setComplaints(data);
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                    "Failed to load assigned complaints."
                );
            } finally {
                setLoading(false);
            }
        };

        loadComplaints();
    }, []);

    const pendingCount = complaints.filter(
        (complaint) => complaint.status === "PENDING"
    ).length;

    const inProgressCount = complaints.filter(
        (complaint) => complaint.status === "IN_PROGRESS"
    ).length;

    const resolvedCount = complaints.filter(
        (complaint) => complaint.status === "RESOLVED"
    ).length;

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <p className="text-sm font-medium text-neutral-500">
                    Supervisor Overview
                </p>

                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
                    Assigned Complaints
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    Coordinate and manage complaints assigned to you.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-px overflow-hidden border border-neutral-200 bg-neutral-200 sm:grid-cols-3">

                <div className="bg-white p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                        Pending
                    </p>

                    <p className="mt-3 text-3xl font-semibold text-neutral-950">
                        {pendingCount}
                    </p>
                </div>

                <div className="bg-white p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                        In Progress
                    </p>

                    <p className="mt-3 text-3xl font-semibold text-neutral-950">
                        {inProgressCount}
                    </p>
                </div>

                <div className="bg-white p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                        Resolved
                    </p>

                    <p className="mt-3 text-3xl font-semibold text-neutral-950">
                        {resolvedCount}
                    </p>
                </div>

            </div>

            {/* Complaints */}
            <section className="border border-neutral-200 bg-white">

                <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
                    <div>
                        <h2 className="text-base font-semibold text-neutral-950">
                            Assigned Complaints
                        </h2>

                        <p className="mt-1 text-sm text-neutral-500">
                            Complaints assigned to you for coordination.
                        </p>
                    </div>

                    <Link
                        to="/staff/complaints"
                        className="text-sm font-medium text-neutral-700 hover:text-neutral-950"
                    >
                        View all
                    </Link>
                </div>

                {loading && (
                    <div className="px-6 py-12 text-center text-sm text-neutral-500">
                        Loading complaints...
                    </div>
                )}

                {error && !loading && (
                    <div className="px-6 py-12 text-center text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!loading && !error && complaints.length === 0 && (
                    <div className="px-6 py-12 text-center">
                        <p className="text-sm font-medium text-neutral-950">
                            No complaints assigned
                        </p>

                        <p className="mt-1 text-sm text-neutral-500">
                            Assigned complaints will appear here.
                        </p>
                    </div>
                )}

                {!loading && !error && complaints.length > 0 && (
                    <div className="divide-y divide-neutral-200">

                        {complaints.slice(0, 5).map((complaint) => (
                            <Link
                                key={complaint.id}
                                to={`/staff/complaints/${complaint.id}`}
                                className="block px-6 py-5 transition-colors hover:bg-neutral-50"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-medium text-neutral-950">
                                            {complaint.title}
                                        </h3>

                                        <p className="mt-1 text-xs text-neutral-500">
                                            {categoryLabels[complaint.category] ||
                                                complaint.category}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <StatusBadge
                                            status={complaint.status}
                                        />

                                        <span className="text-xs text-neutral-400">
                                            #{complaint.id}
                                        </span>
                                    </div>

                                </div>
                            </Link>
                        ))}

                    </div>
                )}

            </section>
        </div>
    );
}