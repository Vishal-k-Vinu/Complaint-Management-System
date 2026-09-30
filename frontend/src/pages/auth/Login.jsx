import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === "STAFF") {
      return <Navigate to="/staff" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const authenticatedUser = await login(
        form.username,
        form.password
      );

      if (authenticatedUser.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (authenticatedUser.role === "STAFF") {
        navigate("/staff", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to sign in. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f2] flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-[430px]">

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Complaint Management
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-950">
            Welcome back.
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Sign in to manage and track your complaints.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-neutral-200 bg-white p-7"
        >

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-5">

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-neutral-800"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required
                className="w-full border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-neutral-950 focus:bg-white"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-neutral-800"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                className="w-full border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-neutral-950 focus:bg-white"
                placeholder="Enter your password"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-7 w-full bg-neutral-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="font-medium text-neutral-950 underline underline-offset-4"
          >
            Create one
          </button>
        </p>

        <p className="mt-4 text-center text-sm text-neutral-500">
          <button
            onClick={() => navigate("/guest-complaint")}
            className="font-medium text-neutral-950 underline underline-offset-4"
          >
            Guest Portal for Complaint Registration
          </button>
        </p>

      </div>

    </main>
  );
}