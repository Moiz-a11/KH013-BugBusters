import {
  Bell,
  Search,
  Wifi,
  Activity,
} from "lucide-react";

export default function Topbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-40 h-16 border-b border-slate-800 bg-[#0a101a]/95 backdrop-blur">

      <div className="flex h-full items-center justify-between px-6">

        {/* Left */}
        <div className="flex items-center gap-5">

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-xs font-bold tracking-wider text-emerald-400">
              LIVE SYSTEM
            </span>

          </div>

          <div className="h-5 w-px bg-slate-800" />

          <div className="flex items-center gap-2 text-xs text-slate-400">

            <Activity className="h-4 w-4 text-cyan-400" />

            Operational Status:
            
            <span className="font-semibold text-white">
              ACTIVE
            </span>

          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 md:flex">

            <Search className="h-4 w-4 text-slate-500" />

            <input
              type="text"
              placeholder="Search operations..."
              className="w-48 bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
            />

            <kbd className="rounded border border-slate-700 px-1.5 py-0.5 text-[9px] text-slate-500">
              /
            </kbd>

          </div>

          {/* WebSocket */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2">

            <Wifi className="h-4 w-4 text-emerald-400" />

            <span className="hidden text-xs text-slate-400 md:block">
              Connected
            </span>

          </div>

          {/* Notifications */}
          <button className="relative rounded-lg border border-slate-800 p-2 text-slate-400 hover:bg-slate-800 hover:text-white">

            <Bell className="h-4 w-4" />

            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />

          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 border-l border-slate-800 pl-4">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-bold text-cyan-400">
              OP
            </div>

            <div className="hidden md:block">

              <p className="text-xs font-semibold text-white">
                Operations
              </p>

              <p className="text-[10px] text-slate-500">
                Emergency Control
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}