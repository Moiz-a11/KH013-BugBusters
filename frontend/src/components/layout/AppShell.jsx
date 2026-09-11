import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900">

      {/* =====================================================
          GLOBAL NAVIGATION
      ====================================================== */}
      <Sidebar />

      <Topbar />

      {/* =====================================================
          MAIN APPLICATION AREA
      ====================================================== */}
      <main className="ml-64 pt-16">

        <div
          className="
            min-h-[calc(100vh-4rem)]
            px-5 py-5
            sm:px-6 sm:py-6
            lg:px-7
          "
        >
          <Outlet />
        </div>

      </main>

    </div>
  );
}