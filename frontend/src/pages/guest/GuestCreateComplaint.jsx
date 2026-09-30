import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { createGuestComplaint } from "../../services/complaints";

export default function GuestCreateComplaint() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [complaintId, setComplaintId] = useState(null);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.title.trim()) {
            setError("Complaint title is required.");
            return;
        }

        if (!form.description.trim()) {
            setError("Complaint description is required.");
            return;
        }

        if (!form.category.trim()) {
            setError("Complaint category is required.");
            return;
        }

        try {
            setLoading(true);

            const complaint = await createGuestComplaint({
                title: form.title.trim(),
                description: form.description.trim(),
                category: form.category.trim(),
            });

            setSuccess(true);
            setComplaintId(complaint.id);
        } catch (err) {
            const detail = err.response?.data?.detail;

            if (Array.isArray(detail)) {
                setError(
                    detail.map((item) => item.msg).join(", ")
                );
            } else {
                setError(
                    detail || "Unable to submit complaint."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-4">
                <div className="w-full max-w-md bg-white p-8 border border-neutral-200 text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-neutral-950">Complaint Submitted</h2>
                    <p className="text-neutral-600 mb-6">
                        Your complaint has been successfully registered. Your reference number is <strong>#{complaintId}</strong>.
                    </p>
                    <Link
                        to="/login"
                        className="inline-block bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                    >
                        Return to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-4">
            <div className="w-full max-w-2xl bg-white border border-neutral-200">
                <div className="p-6 sm:p-8 border-b border-neutral-200">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                        Guest Portal
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                        New Complaint
                    </h1>
                    <p className="mt-2 text-sm text-neutral-500">
                        Register a complaint without logging in.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6 p-6 sm:p-8">
                        {error && (
                            <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Briefly describe the issue"
                            required
                        />

                        <div className="space-y-2">
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-neutral-800"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Explain the issue in detail"
                                required
                                rows={7}
                                className="w-full resize-y border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-neutral-800"
                            >
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                                className="w-full border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus:bg-white"
                            >
                                <option value="" disabled>
                                    Select complaint category
                                </option>
                                <option value="MAINTENANCE">
                                    Maintenance
                                </option>
                                <option value="HOSTEL">
                                    Hostel
                                </option>
                                <option value="RAGGING">
                                    Ragging
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 bg-neutral-50 p-6 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate("/login")}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={loading}
                        >
                            Submit complaint
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
