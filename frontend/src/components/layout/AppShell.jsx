import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#060b12] text-white">

      <Sidebar />

      <Topbar />

      <main className="ml-64 pt-16">
        <div className="min-h-[calc(100vh-4rem)] p-6">
          <Outlet />
        </div>
      </main>

    </div>
  );
}