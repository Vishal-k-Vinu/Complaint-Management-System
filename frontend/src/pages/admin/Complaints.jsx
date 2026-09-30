import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllComplaints } from "../../services/admin";
import StatusBadge from "../../components/common/StatusBadge";

const categoryLabels = {
    MAINTENANCE: "Maintenance",
    HOSTEL: "Hostel",
    RAGGING: "Ragging",
};

const filters = [
    ["ALL", "All"],
    ["PENDING", "Pending"],
    ["IN_PROGRESS", "In progress"],
    ["RESOLVED", "Resolved"],
];

export default function Complaints() {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadComplaints = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAllComplaints();

                setComplaints(data);
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                    "Unable to load complaints."
                );
            } finally {
                setLoading(false);
            }
        };

        loadComplaints();
    }, []);

    const filteredComplaints =
        filter === "ALL"
            ? complaints
            : complaints.filter(
                (complaint) =>
                    complaint.status === filter
            );

    if (loading) {
        return (
            <section className="space-y-8 animate-pulse">
                <div>
                    <div className="h-3 w-28 bg-neutral-200" />
                    <div className="mt-3 h-9 w-52 bg-neutral-200" />
                    <div className="mt-3 h-4 w-80 bg-neutral-200" />
                </div>

                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="h-24 border border-neutral-200 bg-white"
                        />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-8">
            {/* Header */}
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                        Operations
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                        Complaints
                    </h1>

                    <p className="mt-2 text-sm text-neutral-500">
                        Review student complaints and manage staff assignments.
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-4">
                {filters.map(([value, label]) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setFilter(value)}
                        className={`px-4 py-2 text-sm transition-colors ${filter === value
                                ? "bg-neutral-950 text-white"
                                : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                    {filteredComplaints.length}{" "}
                    {filteredComplaints.length === 1
                        ? "complaint"
                        : "complaints"}
                </p>
            </div>

            {/* Empty */}
            {filteredComplaints.length === 0 ? (
                <div className="border border-neutral-200 bg-white px-6 py-16 text-center">
                    <p className="text-sm font-medium">
                        No complaints found
                    </p>

                    <p className="mt-2 text-sm text-neutral-500">
                        There are no complaints matching this filter.
                    </p>
                </div>
            ) : (
                <div className="border-y border-neutral-200 bg-white">
                    {filteredComplaints.map((complaint) => {
                        const category =
                            categoryLabels[complaint.category] ||
                            complaint.category;

                        const isUnassigned =
                            !complaint.assigned_staff_id;

                        return (
                            <Link
                                key={complaint.id}
                                to={`/admin/complaints/${complaint.id}`}
                                className="group flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 transition-colors last:border-b-0 hover:bg-neutral-50 lg:flex-row lg:items-center lg:justify-between"
                            >
                                {/* Complaint information */}
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <p className="truncate text-sm font-medium text-neutral-950 group-hover:underline">
                                            {complaint.title}
                                        </p>

                                        <span className="bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-700">
                                            {category}
                                        </span>
                                    </div>

                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                                        <span>#{complaint.id}</span>

                                        <span>·</span>

                                        <span>{category}</span>

                                        {complaint.created_at && (
                                            <>
                                                <span>·</span>

                                                <span>
                                                    {new Date(
                                                        complaint.created_at
                                                    ).toLocaleDateString()}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Status + assignment */}
                                <div className="flex shrink-0 flex-wrap items-center gap-3">
                                    <StatusBadge
                                        status={complaint.status}
                                    />

                                    {isUnassigned ? (
                                        <span className="border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                                            Unassigned
                                        </span>
                                    ) : (
                                        <span className="border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800">
                                            Assigned
                                        </span>
                                    )}

                                    <span className="text-neutral-400 transition-transform group-hover:translate-x-1">
                                        →
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
}