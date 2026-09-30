import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigation = [
    {
        label: "Overview",
        path: "/dashboard",
    },
    {
        label: "Complaints",
        path: "/complaints",
    },
    {
        label: "New complaint",
        path: "/complaints/new",
    },
    {
        label: "Profile",
        path: "/profile",
    },
];

export default function Sidebar() {
    const { logout } = useAuth();

    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] border-r border-neutral-200 bg-white lg:flex lg:flex-col">

            <div className="flex h-20 items-center border-b border-neutral-200 px-7">
                <div>
                    <p className="text-sm font-semibold tracking-tight text-neutral-950">
                        Complaint System
                    </p>

                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                        User portal
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-7">
                <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                    Workspace
                </p>

                <div className="space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `
                block
                border-l-2
                px-3
                py-2.5
                text-sm
                transition
                ${isActive
                                    ? "border-neutral-950 bg-neutral-100 font-medium text-neutral-950"
                                    : "border-transparent text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                                }
                `
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </nav>

            <div className="border-t border-neutral-200 p-4">
                <button
                    onClick={logout}
                    className="w-full px-3 py-2.5 text-left text-sm text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-950"
                >
                    Sign out
                </button>
            </div>

        </aside>
    );
}