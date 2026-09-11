import {
  LayoutDashboard,
  Siren,
  Package,
  Truck,
  Building2,
  Map,
  BarChart3,
  FileClock,
  Settings,
  Radio,
  ShieldAlert,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Incidents",
    path: "/incidents",
    icon: Siren,
  },
  {
    name: "Resources",
    path: "/resources",
    icon: Package,
  },
  {
    name: "Missions",
    path: "/missions",
    icon: Truck,
  },
  {
    name: "Agencies",
    path: "/agencies",
    icon: Building2,
  },
  {
    name: "Live Map",
    path: "/map",
    icon: Map,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Audit Log",
    path: "/audit",
    icon: FileClock,
  },
];

export default function Sidebar() {
  return (
    <aside
      className="
        fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
        border-r border-slate-200 bg-white
        shadow-[2px_0_12px_rgba(15,23,42,0.035)]
      "
    >
      {/* =====================================================
          BRAND
      ====================================================== */}
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="flex items-center gap-3">
          {/* Brand icon */}
          <div
            className="
              relative flex h-10 w-10 shrink-0 items-center justify-center
              rounded-xl border border-blue-100
              bg-blue-50
            "
          >
            <ShieldAlert className="h-[21px] w-[21px] text-[#0F2744]" />

            {/* Small emergency indicator */}
            <span
              className="
                absolute -right-1 -top-1 h-2.5 w-2.5
                rounded-full border-2 border-white bg-red-500
              "
            />
          </div>

          {/* Brand text */}
          <div className="min-w-0">
            <h1
              className="
                text-[17px] font-extrabold tracking-[0.08em]
                text-[#0F2744]
              "
            >
              RESQAI
            </h1>

            <p
              className="
                mt-0.5 text-[8px] font-semibold
                uppercase tracking-[0.18em] text-slate-400
              "
            >
              Disaster Operations
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {/* Section label */}
        <p
          className="
            mb-3 px-3 text-[9px] font-bold
            uppercase tracking-[0.16em] text-slate-400
          "
        >
          Operations
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                    group relative flex items-center gap-3
                    rounded-lg px-3 py-2.5
                    text-[13px] font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? `
                          bg-blue-50
                          text-[#0F2744]
                          shadow-[inset_0_0_0_1px_rgba(37,99,235,0.08)]
                        `
                        : `
                          text-slate-600
                          hover:bg-slate-50
                          hover:text-slate-900
                        `
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}
                    <span
                      className={`
                        absolute left-0 top-1/2 h-5 w-[3px]
                        -translate-y-1/2 rounded-r-full
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-600 opacity-100"
                            : "bg-transparent opacity-0"
                        }
                      `}
                    />

                    {/* Icon container */}
                    <span
                      className={`
                        flex h-7 w-7 shrink-0 items-center justify-center
                        rounded-md transition-all duration-200
                        ${
                          isActive
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-slate-400 group-hover:bg-white group-hover:text-slate-700"
                        }
                      `}
                    >
                      <Icon className="h-[16px] w-[16px]" strokeWidth={1.9} />
                    </span>

                    <span className="truncate">{item.name}</span>

                    {/* Small active marker */}
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-slate-100" />

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `
              group relative flex items-center gap-3 rounded-lg
              px-3 py-2.5 text-[13px] font-medium
              transition-all duration-200
              ${
                isActive
                  ? "bg-blue-50 text-[#0F2744]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
            `
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`
                  flex h-7 w-7 items-center justify-center
                  rounded-md transition-all duration-200
                  ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 group-hover:bg-white group-hover:text-slate-700"
                  }
                `}
              >
                <Settings
                  className="h-[16px] w-[16px]"
                  strokeWidth={1.9}
                />
              </span>

              <span>Settings</span>

              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
              )}
            </>
          )}
        </NavLink>
      </nav>

      {/* =====================================================
          SYSTEM STATUS
      ====================================================== */}
      <div className="border-t border-slate-100 p-4">
        <div
          className="
            rounded-xl border border-emerald-100
            bg-emerald-50/60 p-3.5
          "
        >
          <div className="flex items-center gap-2.5">
            {/* Status icon */}
            <div
              className="
                flex h-7 w-7 items-center justify-center
                rounded-lg bg-white shadow-sm
              "
            >
              <Radio
                className="h-3.5 w-3.5 text-emerald-600"
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span
                    className="
                      absolute inline-flex h-full w-full
                      animate-ping rounded-full bg-emerald-400 opacity-50
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
                    text-[10px] font-bold uppercase
                    tracking-wide text-emerald-700
                  "
                >
                  System Online
                </span>
              </div>
            </div>
          </div>

          <p className="mt-2.5 text-[10px] leading-4 text-emerald-700/70">
            All operational services running
          </p>

          <div className="mt-3 flex items-center justify-between border-t border-emerald-100 pt-2.5">
            <span className="text-[9px] font-medium text-emerald-700/60">
              REALTIME
            </span>

            <span className="text-[9px] font-semibold text-emerald-700">
              CONNECTED
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}