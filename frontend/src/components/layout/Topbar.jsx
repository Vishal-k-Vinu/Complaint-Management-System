import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
    const { user } = useAuth();

    const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`
        .toUpperCase();

    return (
        <header className="sticky top-0 z-30 border-b border-neutral-200 bg-[#f5f5f2]/95 backdrop-blur-sm">
            <div className="flex h-20 items-center justify-between px-6 lg:px-10">

                <div>
                    <p className="text-xs text-neutral-400">
                        User portal
                    </p>

                    <p className="text-sm font-medium text-neutral-900">
                        Complaint Management
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-medium text-neutral-900">
                            {user?.first_name} {user?.last_name}
                        </p>

                        <p className="text-xs text-neutral-400">
                            @{user?.username}
                        </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center bg-neutral-950 text-xs font-medium text-white">
                        {initials}
                    </div>
                </div>

            </div>
        </header>
    );
}