import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-[#f5f5f2]">
            <Sidebar />

            <div className="lg:pl-[240px]">
                <Topbar />

                <main className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}