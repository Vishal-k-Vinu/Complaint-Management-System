import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyComplaints } from "../../services/complaints";
import StatusBadge from "../../components/common/StatusBadge";

const categoryLabels = {
    MAINTENANCE: "Maintenance",
    HOSTEL: "Hostel",
    RAGGING: "Ragging",
};

const categoryStyles = {
    MAINTENANCE: "bg-neutral-100 text-neutral-700",
    HOSTEL: "bg-neutral-100 text-neutral-700",
    RAGGING: "bg-neutral-100 text-neutral-700",
};

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

                const data = await getMyComplaints();
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
                (complaint) => complaint.status === filter
            );

    const filterOptions = [
        ["ALL", "All"],
        ["PENDING", "Pending"],
        ["IN_PROGRESS", "In progress"],
        ["RESOLVED", "Resolved"],
    ];

    if (loading) {
        return (
            <section className="space-y-8">
                <div className="animate-pulse">
                    <div className="h-3 w-20 bg-neutral-200" />
                    <div className="mt-3 h-9 w-48 bg-neutral-200" />
                    <div className="mt-3 h-4 w-80 bg-neutral-200" />
                </div>

                <div className="space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-24 border border-neutral-200 bg-white animate-pulse"
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
                        Student Services
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
                        My complaints
                    </h1>

                    <p className="mt-2 text-sm text-neutral-500">
                        View and track complaints submitted during your stay.
                    </p>
                </div>

                <Link
                    to="/complaints/new"
                    className="w-fit bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                >
                    New complaint
                </Link>
            </div>

            {/* Error */}
            {error && (
                <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-4">
                {filterOptions.map(([value, label]) => (
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

            {/* Complaint count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                    {filteredComplaints.length}{" "}
                    {filteredComplaints.length === 1
                        ? "complaint"
                        : "complaints"}
                </p>
            </div>

            {/* Empty state */}
            {filteredComplaints.length === 0 ? (
                <div className="border border-neutral-200 bg-white px-6 py-16 text-center">
                    <p className="text-sm font-medium text-neutral-950">
                        No complaints found
                    </p>

                    <p className="mt-2 text-sm text-neutral-500">
                        {filter === "ALL"
                            ? "You haven't submitted any complaints yet."
                            : "There are no complaints matching this status."}
                    </p>

                    {filter === "ALL" && (
                        <Link
                            to="/complaints/new"
                            className="mt-6 inline-flex bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                        >
                            Submit a complaint
                        </Link>
                    )}
                </div>
            ) : (
                /* Complaint list */
                <div className="border-y border-neutral-200 bg-white">
                    {filteredComplaints.map((complaint) => {
                        const category =
                            categoryLabels[complaint.category] ||
                            complaint.category;

                        return (
                            <Link
                                key={complaint.id}
                                to={`/complaints/${complaint.id}`}
                                className="group flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 transition-colors last:border-b-0 hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <p className="truncate text-sm font-medium text-neutral-950 group-hover:underline">
                                            {complaint.title}
                                        </p>

                                        <span
                                            className={`px-2 py-1 text-[11px] font-medium ${categoryStyles[complaint.category] ||
                                                "bg-neutral-100 text-neutral-700"
                                                }`}
                                        >
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

                                <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                                    <StatusBadge
                                        status={complaint.status}
                                    />

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