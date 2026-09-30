import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getComplaint } from "../../services/complaints";
import StatusBadge from "../../components/common/StatusBadge";

const categoryLabels = {
    MAINTENANCE: "Maintenance",
    HOSTEL: "Hostel",
    RAGGING: "Ragging",
};

export default function ComplaintDetails() {
    const { complaintId } = useParams();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadComplaint = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getComplaint(complaintId);
                setComplaint(data);
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                    "Unable to load complaint."
                );
            } finally {
                setLoading(false);
            }
        };

        loadComplaint();
    }, [complaintId]);

    if (loading) {
        return (
            <section className="mx-auto max-w-4xl space-y-6 animate-pulse">
                <div className="h-4 w-28 bg-neutral-200" />
                <div className="h-10 w-72 bg-neutral-200" />
                <div className="h-48 border border-neutral-200 bg-white" />
            </section>
        );
    }

    if (error) {
        return (
            <section className="mx-auto max-w-4xl">
                <Link
                    to="/complaints"
                    className="text-sm text-neutral-500 hover:text-neutral-950"
                >
                    ← Back to complaints
                </Link>

                <div className="mt-6 border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    {error}
                </div>
            </section>
        );
    }

    if (!complaint) {
        return null;
    }

    const category =
        categoryLabels[complaint.category] ||
        complaint.category;

    return (
        <section className="mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div>
                <Link
                    to="/complaints"
                    className="text-sm text-neutral-500 transition-colors hover:text-neutral-950"
                >
                    ← Back to complaints
                </Link>

                <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                            Complaint #{complaint.id}
                        </p>

                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
                            {complaint.title}
                        </h1>
                    </div>

                    <StatusBadge status={complaint.status} />
                </div>
            </div>

            {/* Complaint information */}
            <div className="border border-neutral-200 bg-white">
                <div className="grid border-b border-neutral-200 sm:grid-cols-2">
                    <div className="border-b border-neutral-200 p-6 sm:border-r">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                            Category
                        </p>

                        <p className="mt-2 text-sm font-medium text-neutral-950">
                            {category}
                        </p>
                    </div>

                    <div className="p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                            Status
                        </p>

                        <div className="mt-2">
                            <StatusBadge status={complaint.status} />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="p-6 sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                        Description
                    </p>

                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-neutral-700">
                        {complaint.description}
                    </p>
                </div>
            </div>

            {/* Metadata */}
            <div className="grid border-y border-neutral-200 bg-white sm:grid-cols-2">
                <div className="border-b border-neutral-200 p-5 sm:border-b-0 sm:border-r">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                        Submitted
                    </p>

                    <p className="mt-2 text-sm text-neutral-700">
                        {complaint.created_at
                            ? new Date(
                                complaint.created_at
                            ).toLocaleString()
                            : "—"}
                    </p>
                </div>

                <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                        Last updated
                    </p>

                    <p className="mt-2 text-sm text-neutral-700">
                        {complaint.updated_at
                            ? new Date(
                                complaint.updated_at
                            ).toLocaleString()
                            : "—"}
                    </p>
                </div>
            </div>
        </section>
    );
}