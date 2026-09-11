import {
  Bell,
  Search,
  Wifi,
  Activity,
} from "lucide-react";

export default function Topbar() {
  return (
    <header
      className="
        fixed left-64 right-0 top-0 z-40 h-16
        border-b border-slate-200
        bg-white/95
        backdrop-blur
        shadow-[0_1px_8px_rgba(15,23,42,0.035)]
      "
    >
      <div className="flex h-full items-center justify-between px-5 sm:px-6">

        {/* =====================================================
            LEFT — SYSTEM STATUS
        ====================================================== */}
        <div className="flex items-center gap-4 lg:gap-5">

          {/* Live system */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className="
                  absolute inline-flex h-full w-full
                  animate-ping rounded-full
                  bg-emerald-400 opacity-50
                "
              />
              <span
                className="
                  relative inline-flex h-2 w-2
                  rounded-full bg-emerald-500
                "
              />
            </span>

            <span
              className="
                text-[10px] font-bold
                uppercase tracking-[0.12em]
                text-emerald-700
              "
            >
              Live System
            </span>
          </div>

          {/* Divider */}
          <div className="hidden h-5 w-px bg-slate-200 sm:block" />

          {/* Operational status */}
          <div className="hidden items-center gap-2 sm:flex">
            <Activity
              className="h-4 w-4 text-blue-600"
              strokeWidth={2}
            />

            <span className="text-xs text-slate-500">
              Operational Status:
            </span>

            <span className="text-xs font-bold text-[#0F2744]">
              ACTIVE
            </span>
          </div>
        </div>

        {/* =====================================================
            RIGHT — OPERATIONS CONTROLS
        ====================================================== */}
        <div className="flex items-center gap-2.5 sm:gap-3">

          {/* Search */}
          <div
            className="
              hidden h-9 items-center gap-2
              rounded-lg border border-slate-200
              bg-slate-50 px-3
              transition-all duration-200
              focus-within:border-blue-300
              focus-within:bg-white
              focus-within:ring-2
              focus-within:ring-blue-50
              md:flex
            "
          >
            <Search
              className="h-4 w-4 shrink-0 text-slate-400"
              strokeWidth={1.8}
            />

            <input
              type="text"
              placeholder="Search operations..."
              className="
                w-44 bg-transparent
                text-xs text-slate-800
                outline-none
                placeholder:text-slate-400
                lg:w-52
              "
            />

            <kbd
              className="
                rounded-md border border-slate-200
                bg-white px-1.5 py-0.5
                text-[9px] font-medium
                text-slate-400
                shadow-sm
              "
            >
              /
            </kbd>
          </div>

          {/* WebSocket status */}
          <div
            className="
              flex h-9 items-center gap-2
              rounded-lg border border-slate-200
              bg-white px-3
              transition-all duration-200
              hover:border-emerald-200
              hover:bg-emerald-50/40
            "
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            <Wifi
              className="h-3.5 w-3.5 text-emerald-600"
              strokeWidth={2}
            />

            <span className="hidden text-[10px] font-semibold text-slate-600 md:block">
              Connected
            </span>
          </div>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="
              relative flex h-9 w-9
              items-center justify-center
              rounded-lg border border-slate-200
              bg-white text-slate-500
              transition-all duration-200
              hover:border-slate-300
              hover:bg-slate-50
              hover:text-[#0F2744]
              active:scale-[0.98]
            "
          >
            <Bell
              className="h-[17px] w-[17px]"
              strokeWidth={1.8}
            />

            {/* Notification indicator */}
            <span
              className="
                absolute right-1.5 top-1.5
                h-1.5 w-1.5
                rounded-full bg-red-500
                ring-2 ring-white
              "
            />
          </button>

          {/* Profile */}
          <div className="ml-1 flex items-center gap-2.5 border-l border-slate-200 pl-3 sm:ml-1 sm:pl-4">

            {/* Avatar */}
            <div
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-lg
                bg-[#0F2744]
                text-[10px] font-bold
                tracking-wide text-white
                shadow-sm
              "
            >
              OP
            </div>

            {/* Operator information */}
            <div className="hidden min-w-0 lg:block">
              <p className="truncate text-[11px] font-bold text-slate-800">
                Operations
              </p>

              <p className="truncate text-[9px] text-slate-400">
                Emergency Control
              </p>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}