import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function StaffLayout() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-[#f5f5f2]">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 hidden w-[240px] border-r border-neutral-200 bg-white lg:block">
                <div className="flex h-full flex-col">

                    {/* Brand */}
                    <div className="border-b border-neutral-200 px-6 py-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                            College Operations
                        </p>

                        <h1 className="mt-2 text-lg font-semibold">
                            Supervisor Portal
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4">
                        <NavLink
                            to="/staff"
                            end
                            className={({ isActive }) =>
                                `block px-3 py-2 text-sm transition-colors ${isActive
                                    ? "bg-neutral-950 text-white"
                                    : "text-neutral-700 hover:bg-neutral-100"
                                }`
                            }
                        >
                            Overview
                        </NavLink>

                        <NavLink
                            to="/staff/complaints"
                            className={({ isActive }) =>
                                `mt-1 block px-3 py-2 text-sm transition-colors ${isActive
                                    ? "bg-neutral-950 text-white"
                                    : "text-neutral-700 hover:bg-neutral-100"
                                }`
                            }
                        >
                            Assigned Complaints
                        </NavLink>
                    </nav>

                    {/* User */}
                    <div className="border-t border-neutral-200 p-4">
                        <div className="px-3 py-3">
                            <p className="truncate text-sm font-medium text-neutral-950">
                                {user?.first_name} {user?.last_name}
                            </p>

                            <p className="mt-1 truncate text-xs text-neutral-400">
                                {user?.username}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={logout}
                            className="mt-2 w-full px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="lg:pl-[240px]">
                <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
                    <div className="flex h-16 items-center justify-between px-6 lg:px-10">
                        <div>
                            <p className="text-sm font-medium">
                                Supervisor Operations
                            </p>

                            <p className="text-xs text-neutral-400">
                                Complaint coordination and resolution
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={logout}
                            className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950 lg:hidden"
                        >
                            Sign out
                        </button>
                    </div>
                </header>

                <main className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}