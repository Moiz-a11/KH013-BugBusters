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
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-800 bg-[#080d16]">

      {/* Logo */}
      <div className="border-b border-slate-800 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/15 border border-red-500/30">
            <ShieldAlert className="h-6 w-6 text-red-500" />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-wider text-white">
              RESQAI
            </h1>

            <p className="text-[9px] font-medium tracking-[0.18em] text-slate-500">
              DISASTER OPERATIONS
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          Operations
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                group flex items-center gap-3 rounded-lg px-3 py-2.5
                text-sm transition
                ${
                  isActive
                    ? "border border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }
                `
              }
            >
              <Icon className="h-4 w-4" />

              <span>{item.name}</span>
            </NavLink>
          );
        })}

        <div className="my-5 border-t border-slate-800" />

        <NavLink
          to="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800/60 hover:text-white"
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
      </nav>

      {/* System status */}
      <div className="border-t border-slate-800 p-4">

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">

          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-400" />

            <span className="text-xs font-semibold text-emerald-400">
              SYSTEM ONLINE
            </span>
          </div>

          <p className="mt-2 text-[10px] text-slate-500">
            All operational services running
          </p>

        </div>

      </div>

    </aside>
  );
}