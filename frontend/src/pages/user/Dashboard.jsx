import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDashboard } from "../../services/users";
import { getMyComplaints } from "../../services/complaints";
import StatusBadge from "../../components/common/StatusBadge";

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [complaints, setComplaints] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setError("");

                const [dashboardData, complaintData] =
                    await Promise.all([
                        getDashboard(),
                        getMyComplaints(),
                    ]);

                setSummary(dashboardData);
                setComplaints(complaintData);
            } catch (err) {
                console.error(err);
                setError(
                    "Unable to load your dashboard. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div>
                    <div className="h-3 w-20 bg-neutral-200" />
                    <div className="mt-3 h-8 w-48 bg-neutral-200" />
                    <div className="mt-3 h-4 w-72 bg-neutral-200" />
                </div>

                <div className="grid gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-32 bg-white"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <section className="border border-red-200 bg-red-50 p-6">
                <p className="text-sm font-medium text-red-800">
                    {error}
                </p>

                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-sm font-medium text-red-900 underline underline-offset-4"
                >
                    Try again
                </button>
            </section>
        );
    }

    const stats = [
        {
            label: "Total complaints",
            value: summary?.total ?? 0,
        },
        {
            label: "Pending",
            value: summary?.pending ?? 0,
        },
        {
            label: "In progress",
            value: summary?.in_progress ?? 0,
        },
        {
            label: "Resolved",
            value: summary?.resolved ?? 0,
        },
    ];

    const recentComplaints = complaints.slice(0, 5);

    return (
        <section className="space-y-10">

            {/* Header */}
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                        Overview
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
                        Your complaints
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                        Keep track of complaints you've submitted and
                        monitor their progress.
                    </p>
                </div>

                <Link
                    to="/complaints/new"
                    className="inline-flex w-fit items-center justify-center bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                    New complaint
                </Link>

            </div>

            {/* Statistics */}
            <div className="grid gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white p-6"
                    >
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">
                            {stat.label}
                        </p>

                        <p className="mt-5 text-4xl font-semibold tracking-tight text-neutral-950">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Recent complaints */}
            <div>

                <div className="flex items-end justify-between border-b border-neutral-200 pb-4">
                    <div>
                        <p className="text-lg font-semibold tracking-tight text-neutral-950">
                            Recent complaints
                        </p>

                        <p className="mt-1 text-sm text-neutral-500">
                            Your latest submitted complaints.
                        </p>
                    </div>

                    {complaints.length > 0 && (
                        <Link
                            to="/complaints"
                            className="text-sm font-medium text-neutral-950 underline underline-offset-4"
                        >
                            View all
                        </Link>
                    )}
                </div>

                {recentComplaints.length === 0 ? (
                    <div className="border-b border-neutral-200 py-16 text-center">
                        <p className="text-sm font-medium text-neutral-900">
                            No complaints yet
                        </p>

                        <p className="mt-2 text-sm text-neutral-500">
                            Submit your first complaint to start tracking it.
                        </p>

                        <Link
                            to="/complaints/new"
                            className="mt-5 inline-block text-sm font-medium text-neutral-950 underline underline-offset-4"
                        >
                            Create a complaint
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-200 border-b border-neutral-200">

                        {recentComplaints.map((complaint) => (
                            <Link
                                key={complaint.id}
                                to={`/complaints/${complaint.id}`}
                                className="group flex flex-col gap-4 py-5 transition hover:bg-white sm:flex-row sm:items-center sm:justify-between sm:px-4"
                            >

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-neutral-950">
                                        {complaint.title}
                                    </p>

                                    <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
                                        <span>
                                            #{complaint.id}
                                        </span>

                                        <span>·</span>

                                        <span>
                                            {complaint.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <StatusBadge
                                        status={complaint.status}
                                    />

                                    <span className="hidden text-neutral-400 transition group-hover:text-neutral-900 sm:block">
                                        →
                                    </span>
                                </div>

                            </Link>
                        ))}

                    </div>
                )}

            </div>

        </section>
    );
}