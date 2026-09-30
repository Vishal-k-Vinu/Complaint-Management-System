import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
    assignComplaint,
    getAdminComplaint,
} from "../../services/admin";

import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";

const categoryLabels = {
    MAINTENANCE: "Maintenance",
    HOSTEL: "Hostel",
    RAGGING: "Ragging",
};

export default function ComplaintDetails() {
    const { complaintId } = useParams();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadComplaint = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminComplaint(
                complaintId
            );

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

    useEffect(() => {
        loadComplaint();
    }, [complaintId]);

    const handleAssign = async () => {
        try {
            setAssigning(true);
            setError("");
            setMessage("");

            const result = await assignComplaint(
                complaintId
            );

            setMessage(
                `Complaint assigned to supervisor ${result.assigned_staff.first_name} ${result.assigned_staff.last_name}.`
            );

            await loadComplaint();
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to assign complaint."
            );
        } finally {
            setAssigning(false);
        }
    };

    if (loading) {
        return (
            <section className="mx-auto max-w-4xl space-y-6 animate-pulse">
                <div className="h-4 w-32 bg-neutral-200" />
                <div className="h-10 w-72 bg-neutral-200" />
                <div className="h-64 border border-neutral-200 bg-white" />
            </section>
        );
    }

    if (error && !complaint) {
        return (
            <section className="mx-auto max-w-4xl">
                <Link
                    to="/admin/complaints"
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

    const isAssigned =
        Boolean(complaint.assigned_staff_id);

    return (
        <section className="mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div>
                <Link
                    to="/admin/complaints"
                    className="text-sm text-neutral-500 hover:text-neutral-950"
                >
                    ← Back to complaints
                </Link>

                <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                            Complaint #{complaint.id}
                        </p>

                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                            {complaint.title}
                        </h1>
                    </div>

                    <StatusBadge
                        status={complaint.status}
                    />
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {message && (
                <div className="border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    {message}
                </div>
            )}

            {/* Complaint */}
            <div className="border border-neutral-200 bg-white">
                <div className="grid border-b border-neutral-200 sm:grid-cols-2">
                    <div className="border-b border-neutral-200 p-6 sm:border-r sm:border-b-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                            Category
                        </p>

                        <p className="mt-2 text-sm font-medium">
                            {category}
                        </p>
                    </div>

                    <div className="p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                            Status
                        </p>

                        <div className="mt-2">
                            <StatusBadge
                                status={complaint.status}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                        Description
                    </p>

                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-neutral-700">
                        {complaint.description}
                    </p>
                </div>
            </div>

            {/* Assignment */}
            <div className="border border-neutral-200 bg-white">
                <div className="border-b border-neutral-200 px-6 py-5">
                    <h2 className="text-base font-semibold text-neutral-950">
                        Assign to Supervisor
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                        Assign this complaint to the hostel supervisor for resolution.
                    </p>
                </div>

                <div className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-neutral-400">
                            Assignment status
                        </p>

                        <p className="mt-2 text-sm font-medium">
                            {isAssigned
                                ? "Assigned to supervisor"
                                : "Waiting for assignment"}
                        </p>
                    </div>

                    <Button
                        onClick={handleAssign}
                        loading={assigning}
                        disabled={isAssigned}
                    >
                        {isAssigned
                            ? "Already assigned"
                            : "Assign to Supervisor"}
                    </Button>
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