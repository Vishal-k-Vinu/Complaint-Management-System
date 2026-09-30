import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAssignedComplaints } from "../../services/staff";
import StatusBadge from "../../components/common/StatusBadge";

const categoryLabels = {
    MAINTENANCE: "Maintenance",
    ROOM_SERVICE: "Room Service",
    FOOD_SERVICE: "Food Service",
};

const filters = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Resolved", value: "RESOLVED" },
];

export default function StaffComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [activeFilter, setActiveFilter] = useState("ALL");
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
                    "Failed to load complaints."
                );
            } finally {
                setLoading(false);
            }
        };

        loadComplaints();
    }, []);

    const filteredComplaints =
        activeFilter === "ALL"
            ? complaints
            : complaints.filter(
                (complaint) =>
                    complaint.status === activeFilter
            );

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <p className="text-sm font-medium text-neutral-500">
                    Supervisor Operations
                </p>

                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
                    Assigned Complaints
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    Coordinate complaints assigned to you and update their status after resolution.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-4">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        onClick={() =>
                            setActiveFilter(filter.value)
                        }
                        className={`px-4 py-2 text-sm transition-colors ${activeFilter === filter.value
                                ? "bg-neutral-950 text-white"
                                : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <section className="border border-neutral-200 bg-white">

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

                {!loading &&
                    !error &&
                    filteredComplaints.length === 0 && (
                        <div className="px-6 py-12 text-center">
                            <p className="text-sm font-medium text-neutral-950">
                                No complaints found
                            </p>

                            <p className="mt-1 text-sm text-neutral-500">
                                There are no complaints matching this filter.
                            </p>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    filteredComplaints.length > 0 && (
                        <div className="divide-y divide-neutral-200">

                            {filteredComplaints.map((complaint) => (
                                <Link
                                    key={complaint.id}
                                    to={`/staff/complaints/${complaint.id}`}
                                    className="block px-6 py-5 transition-colors hover:bg-neutral-50"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3">
                                                <h2 className="truncate text-sm font-medium text-neutral-950">
                                                    {complaint.title}
                                                </h2>

                                                <span className="text-xs text-neutral-400">
                                                    #{complaint.id}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-xs text-neutral-500">
                                                {categoryLabels[
                                                    complaint.category
                                                ] || complaint.category}
                                            </p>

                                            <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
                                                {complaint.description}
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-4">
                                            <StatusBadge
                                                status={complaint.status}
                                            />

                                            <span className="text-xs text-neutral-400">
                                                View
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