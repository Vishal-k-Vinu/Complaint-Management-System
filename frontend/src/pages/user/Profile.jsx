import { useEffect, useState } from "react";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import api from "../../services/api";
import { getMyProfile } from "../../services/users";

export default function Profile() {
    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
    });

    const [passwords, setPasswords] = useState({
        current_password: "",
        new_password: "",
    });

    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] =
        useState(false);

    const [profileMessage, setProfileMessage] = useState("");
    const [profileError, setProfileError] = useState("");

    const [passwordMessage, setPasswordMessage] =
        useState("");
    const [passwordError, setPasswordError] =
        useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getMyProfile();

                setProfile({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    username: data.username || "",
                    email: data.email || "",
                });
            } catch (err) {
                setProfileError(
                    err.response?.data?.detail ||
                    "Unable to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleProfileChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        setProfileMessage("");
        setProfileError("");

        if (!profile.first_name.trim()) {
            setProfileError("First name is required.");
            return;
        }

        if (!profile.last_name.trim()) {
            setProfileError("Last name is required.");
            return;
        }

        if (!profile.email.trim()) {
            setProfileError("Email is required.");
            return;
        }

        try {
            setSavingProfile(true);

            const response = await api.put(
                "/api/users/me",
                {
                    first_name: profile.first_name.trim(),
                    last_name: profile.last_name.trim(),
                    email: profile.email.trim(),
                }
            );

            setProfile({
                first_name: response.data.first_name || "",
                last_name: response.data.last_name || "",
                username: response.data.username || "",
                email: response.data.email || "",
            });

            setProfileMessage(
                "Profile updated successfully."
            );
        } catch (err) {
            const detail = err.response?.data?.detail;

            if (Array.isArray(detail)) {
                setProfileError(
                    detail.map((item) => item.msg).join(", ")
                );
            } else {
                setProfileError(
                    detail || "Unable to update profile."
                );
            }
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        setPasswordMessage("");
        setPasswordError("");

        if (!passwords.current_password) {
            setPasswordError(
                "Current password is required."
            );
            return;
        }

        if (!passwords.new_password) {
            setPasswordError(
                "New password is required."
            );
            return;
        }

        if (passwords.new_password.length < 6) {
            setPasswordError(
                "New password must contain at least 6 characters."
            );
            return;
        }

        try {
            setChangingPassword(true);

            await api.put(
                "/api/users/me/password",
                passwords
            );

            setPasswords({
                current_password: "",
                new_password: "",
            });

            setPasswordMessage(
                "Password changed successfully."
            );
        } catch (err) {
            const detail = err.response?.data?.detail;

            if (Array.isArray(detail)) {
                setPasswordError(
                    detail.map((item) => item.msg).join(", ")
                );
            } else {
                setPasswordError(
                    detail || "Unable to change password."
                );
            }
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <section className="mx-auto max-w-4xl space-y-8 animate-pulse">
                <div>
                    <div className="h-3 w-20 bg-neutral-200" />
                    <div className="mt-3 h-9 w-48 bg-neutral-200" />
                    <div className="mt-3 h-4 w-80 bg-neutral-200" />
                </div>

                <div className="h-80 border border-neutral-200 bg-white" />
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                    Account
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                    Profile
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    Manage your guest account information.
                </p>
            </div>

            {/* Profile */}
            <form
                onSubmit={handleProfileSubmit}
                className="border border-neutral-200 bg-white"
            >
                <div className="border-b border-neutral-200 px-6 py-5">
                    <h2 className="text-sm font-semibold">
                        Personal information
                    </h2>

                    <p className="mt-1 text-xs text-neutral-500">
                        Update the information associated with your account.
                    </p>
                </div>

                <div className="space-y-6 p-6 sm:p-8">
                    {profileError && (
                        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {profileError}
                        </div>
                    )}

                    {profileMessage && (
                        <div className="border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                            {profileMessage}
                        </div>
                    )}

                    <div className="grid gap-6 sm:grid-cols-2">
                        <Input
                            label="First name"
                            name="first_name"
                            value={profile.first_name}
                            onChange={handleProfileChange}
                            required
                        />

                        <Input
                            label="Last name"
                            name="last_name"
                            value={profile.last_name}
                            onChange={handleProfileChange}
                            required
                        />
                    </div>

                    <Input
                        label="Username"
                        name="username"
                        value={profile.username}
                        disabled
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        required
                    />
                </div>

                <div className="flex justify-end border-t border-neutral-200 bg-neutral-50 p-6">
                    <Button
                        type="submit"
                        loading={savingProfile}
                    >
                        Save changes
                    </Button>
                </div>
            </form>

            {/* Password */}
            <form
                onSubmit={handlePasswordSubmit}
                className="border border-neutral-200 bg-white"
            >
                <div className="border-b border-neutral-200 px-6 py-5">
                    <h2 className="text-sm font-semibold">
                        Change password
                    </h2>

                    <p className="mt-1 text-xs text-neutral-500">
                        Use a strong password to keep your account secure.
                    </p>
                </div>

                <div className="space-y-6 p-6 sm:p-8">
                    {passwordError && (
                        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {passwordError}
                        </div>
                    )}

                    {passwordMessage && (
                        <div className="border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                            {passwordMessage}
                        </div>
                    )}

                    <Input
                        label="Current password"
                        name="current_password"
                        type="password"
                        value={passwords.current_password}
                        onChange={handlePasswordChange}
                        autoComplete="current-password"
                        required
                    />

                    <Input
                        label="New password"
                        name="new_password"
                        type="password"
                        value={passwords.new_password}
                        onChange={handlePasswordChange}
                        autoComplete="new-password"
                        required
                    />
                </div>

                <div className="flex justify-end border-t border-neutral-200 bg-neutral-50 p-6">
                    <Button
                        type="submit"
                        loading={changingPassword}
                    >
                        Change password
                    </Button>
                </div>
            </form>
        </section>
    );
}