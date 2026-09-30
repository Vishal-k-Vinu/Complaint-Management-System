import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../../services/api";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            await api.post("/api/auth/signup", form);

            navigate("/login", {
                state: {
                    message: "Account created successfully. Please sign in.",
                },
            });
        } catch (err) {
            const detail = err.response?.data?.detail;

            if (typeof detail === "string") {
                setError(detail);
            } else if (Array.isArray(detail)) {
                setError(detail[0]?.msg || "Please check your information.");
            } else {
                setError("Unable to create your account.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f5f5f2] px-6 py-12">
            <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-[1050px] items-center">

                <div className="grid w-full overflow-hidden border border-neutral-200 bg-white lg:grid-cols-[0.85fr_1.15fr]">

                    {/* Intro */}
                    <section className="hidden bg-neutral-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                                Complaint Management
                            </p>

                            <h1 className="mt-16 max-w-sm text-4xl font-semibold leading-tight tracking-tight">
                                A clearer way to manage your complaints.
                            </h1>

                            <p className="mt-6 max-w-sm text-sm leading-6 text-neutral-400">
                                Create an account to submit complaints, follow their progress,
                                and keep track of your requests in one place.
                            </p>
                        </div>

                        <p className="text-xs text-neutral-500">
                            User portal
                        </p>
                    </section>

                    {/* Form */}
                    <section className="p-7 sm:p-10">

                        <div className="mb-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                                Create account
                            </p>

                            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
                                Get started.
                            </h2>

                            <p className="mt-2 text-sm text-neutral-500">
                                Enter your details to create your user account.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Input
                                    label="First name"
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    placeholder="First name"
                                    autoComplete="given-name"
                                    required
                                />

                                <Input
                                    label="Last name"
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    placeholder="Last name"
                                    autoComplete="family-name"
                                    required
                                />
                            </div>

                            <Input
                                label="Username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                autoComplete="username"
                                required
                            />

                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />

                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="At least 8 characters"
                                autoComplete="new-password"
                                required
                            />

                            <Button
                                type="submit"
                                loading={submitting}
                                className="mt-2 w-full"
                            >
                                Create account
                            </Button>

                        </form>

                        <p className="mt-7 text-center text-sm text-neutral-500">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-neutral-950 underline underline-offset-4"
                            >
                                Sign in
                            </Link>
                        </p>

                    </section>

                </div>

            </div>
        </main>
    );
}