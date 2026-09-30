import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { createComplaint } from "../../services/complaints";

export default function CreateComplaint() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

            const complaint = await createComplaint({
                title: form.title.trim(),
                description: form.description.trim(),
                category: form.category.trim(),
            });

            navigate(`/complaints/${complaint.id}`);
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

    return (
        <section className="mx-auto max-w-3xl space-y-8">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                    Complaints
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                    New complaint
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    Provide the details of the issue you want to report.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="border border-neutral-200 bg-white"
            >
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

                            <option value="ROOM_SERVICE">
                                Room Service
                            </option>

                            <option value="FOOD_SERVICE">
                                Food Service
                            </option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 bg-neutral-50 p-6 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate("/complaints")}
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
        </section>
    );
}