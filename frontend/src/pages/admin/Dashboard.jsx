import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAdminDashboard } from "../../services/admin";

const stats = [
    {
        key: "total",
        label: "Total complaints",
    },
    {
        key: "pending",
        label: "Pending",
    },
    {
        key: "in_progress",
        label: "In progress",
    },
    {
        key: "resolved",
        label: "Resolved",
    },
    {
        key: "unassigned",
        label: "Unassigned",
    },
];

export default function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data = await getAdminDashboard();
                setDashboard(data);
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                    "Unable to load admin dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <section className="space-y-8 animate-pulse">
                <div>
                    <div className="h-3 w-24 bg-neutral-200" />
                    <div className="mt-3 h-9 w-56 bg-neutral-200" />
                </div>

                <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-5">
                    {stats.map((item) => (
                        <div
                            key={item.key}
                            className="h-32 bg-white"
                        />
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <div className="border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                {error}
            </div>
        );
    }

    return (
        <section className="space-y-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                        Hotel Operations
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                        Admin overview
                    </h1>

                    <p className="mt-2 text-sm text-neutral-500">
                        Monitor guest complaints and staff assignments.
                    </p>
                </div>

                <Link
                    to="/admin/complaints"
                    className="w-fit bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
                >
                    View complaints
                </Link>
            </div>

            <div className="grid gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-5">
                {stats.map((item) => (
                    <div
                        key={item.key}
                        className="bg-white p-6"
                    >
                        <p className="text-xs uppercase tracking-[0.12em] text-neutral-400">
                            {item.label}
                        </p>

                        <p className="mt-4 text-3xl font-semibold tracking-tight">
                            {dashboard[item.key]}
                        </p>
                    </div>
                ))}
            </div>

            <div className="border border-neutral-200 bg-white p-6">
                <p className="text-sm font-semibold">
                    Assignment queue
                </p>

                <p className="mt-2 text-sm text-neutral-500">
                    {dashboard.unassigned === 0
                        ? "All current complaints have been assigned."
                        : `${dashboard.unassigned} complaint${dashboard.unassigned === 1
                            ? ""
                            : "s"
                        } waiting for staff assignment.`}
                </p>

                {dashboard.unassigned > 0 && (
                    <Link
                        to="/admin/complaints"
                        className="mt-5 inline-block text-sm font-medium text-neutral-950 underline underline-offset-4"
                    >
                        Review unassigned complaints →
                    </Link>
                )}
            </div>
        </section>
    );
}