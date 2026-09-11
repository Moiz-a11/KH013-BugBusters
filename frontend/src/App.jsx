import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";

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
  ShieldAlert,
  Wifi,
  Bell,
  Search,
  Activity,
  RefreshCw,
  Zap,
  Menu,
  X,
  Radio,
  Cpu,
  FileText,
  Layers,
  Sliders,
  Bot,
  Eye,
  Clock,
  ChevronRight,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import { api, connectSocket } from "./api";
import VictimReport from "./components/VictimReport";
import CriticalIncident from "./components/CriticalIncident/CriticalIncident";
import "./index.css";

/* =========================================================
   NAVIGATION
========================================================= */

const navigation = [
  {
    name: "Critical Incidents",
    path: "/critical-incident",
    icon: ShieldAlert,
  },
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

/* =========================================================
   SEVERITY
========================================================= */

const severityClass = {
  CRITICAL:
    "text-red-300 bg-red-950/40 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.15)]",

  HIGH:
    "text-orange-300 bg-orange-950/30 border-orange-500/40",

  MEDIUM:
    "text-yellow-300 bg-yellow-950/20 border-yellow-500/30",

  LOW:
    "text-emerald-300 bg-emerald-950/20 border-emerald-500/30",

  MONITORING:
    "text-slate-300 bg-slate-900/60 border-slate-700/60",
};

function SeverityBadge({ level }) {
  const normalized = (level || "MONITORING").toUpperCase();
  const cls = severityClass[normalized] || severityClass.MONITORING;
  const isCritical = normalized === "CRITICAL";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded border px-2 py-0.5
        font-mono text-[10px] font-semibold uppercase tracking-wider
        ${cls}
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isCritical ? "bg-red-400 animate-pulse" : "bg-current"}`} />

      {normalized}
    </span>
  );
}

/* =========================================================
   KPI CARD
========================================================= */

function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "cyan",
}) {
  const accentClasses = {
    cyan: {
      border: "border-slate-800/80 hover:border-cyan-500/40",
      line: "bg-cyan-500/70",
      iconBg: "border-cyan-500/30 bg-cyan-950/30 text-cyan-400",
      num: "text-white",
    },
    red: {
      border: "border-slate-800/80 hover:border-red-500/50",
      line: "bg-red-500",
      iconBg: "border-red-500/40 bg-red-950/40 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
      num: "text-red-200",
    },
    orange: {
      border: "border-slate-800/80 hover:border-orange-500/40",
      line: "bg-orange-500/70",
      iconBg: "border-orange-500/30 bg-orange-950/30 text-orange-400",
      num: "text-white",
    },
    emerald: {
      border: "border-slate-800/80 hover:border-emerald-500/40",
      line: "bg-emerald-500/70",
      iconBg: "border-emerald-500/30 bg-emerald-950/30 text-emerald-400",
      num: "text-white",
    },
  };

  const current = accentClasses[accent] || accentClasses.cyan;

  return (
    <div className={`relative overflow-hidden rounded-lg border ${current.border} bg-[#080d16]/90 p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5`}>
      <div className={`absolute left-0 top-0 h-[2px] w-full ${current.line}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {title}
          </p>

          <p className={`mt-1.5 font-mono text-2xl font-extrabold tracking-tight ${current.num}`}>
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-[11px] text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`rounded-lg border p-2.5 ${current.iconBg}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PANEL
========================================================= */

function Panel({
  title,
  subtitle,
  children,
  action,
  className = "",
}) {
  return (
    <section
      className={`
        relative overflow-hidden rounded-lg
        border border-slate-800/80
        bg-[#080d16]/90 backdrop-blur-sm
        transition-colors duration-200
        ${className}
      `}
    >
      <div className="h-[1.5px] w-full bg-gradient-to-r from-cyan-500/40 via-slate-700/30 to-transparent" />
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-950/40 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-0.5 text-[11px] text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {action}
      </div>

      <div>{children}</div>
    </section>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-800/90 bg-[#070b13]/95 backdrop-blur-md transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header / Insignia */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/40 bg-red-950/30 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-mono text-base font-black tracking-widest text-white">
                  RESQAI
                </h1>
                <span className="rounded bg-red-500/10 px-1 py-0.2 font-mono text-[8px] font-bold text-red-400 border border-red-500/20">
                  EOC
                </span>
              </div>

              <p className="font-mono text-[8px] font-semibold tracking-[0.2em] text-slate-400">
                DISASTER COMMAND
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Operations Console
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;
            const isCritical = item.path === "/critical-incident";

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  group relative flex items-center gap-3 rounded-lg px-3 py-2.5
                  text-xs font-medium transition-all duration-150
                  ${
                    isActive
                      ? isCritical
                        ? "border border-red-500/40 bg-red-950/30 text-red-200 font-semibold shadow-[0_0_12px_rgba(239,68,68,0.12)]"
                        : "border border-cyan-500/30 bg-cyan-950/30 text-cyan-200 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.1)]"
                      : "border border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/60 hover:text-slate-200"
                  }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Left Active Bar */}
                    {isActive && (
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r ${
                          isCritical ? "bg-red-500" : "bg-cyan-400"
                        }`}
                      />
                    )}

                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? isCritical
                            ? "text-red-400"
                            : "text-cyan-400"
                          : "text-slate-400 group-hover:text-slate-300"
                      }`}
                    />

                    <span className="truncate">{item.name || item.label}</span>

                    {isCritical && (
                      <span className="ml-auto font-mono text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                        URGENT
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          <div className="my-4 border-t border-slate-800/80" />

          {/* Victim reporting public link */}
          <NavLink
            to="/report"
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition ${
                isActive
                  ? "border border-amber-500/30 bg-amber-950/20 text-amber-200"
                  : "border border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
              }`
            }
          >
            <Radio className="h-4 w-4 text-amber-400" />
            <div className="min-w-0">
              <span className="block truncate">Victim Reporting</span>
              <span className="block text-[9px] text-slate-500">Public Emergency Input</span>
            </div>
          </NavLink>

          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition ${
                isActive
                  ? "bg-slate-800/60 text-white"
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-white"
              }`
            }
          >
            <Settings className="h-4 w-4 text-slate-400" />
            <span>Settings & Telemetry</span>
          </NavLink>
        </nav>

        {/* System Health Card */}
        <div className="border-t border-slate-800/80 p-3.5 bg-slate-950/40">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/15 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  SYSTEM ONLINE
                </span>
              </div>
              <span className="font-mono text-[9px] text-slate-500">
                v1.0.0
              </span>
            </div>

            <p className="mt-1.5 font-mono text-[9px] text-slate-400">
              Live WebSocket telemetry active
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

/* =========================================================
   TOPBAR
========================================================= */

function Topbar({ summary, onToggleMobileMenu = () => {} }) {
  return (
    <header className="fixed left-0 right-0 lg:left-64 top-0 z-40 h-16 border-b border-slate-800/80 bg-[#070b13]/90 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile hamburger toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Operational status */}
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-400">
              LIVE SYSTEM
            </span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-800" />

          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px] text-slate-400">Operational:</span>
            <span className="font-mono text-[10px] font-bold text-white bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60">
              ACTIVE
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
            <Siren className="h-3.5 w-3.5 text-red-400" />
            <span className="font-mono text-xs font-bold text-white">
              {summary?.active_incidents || 0}
            </span>
            <span className="text-[11px] text-slate-500">Active Incidents</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5 md:flex">
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search sectors, missions..."
              className="w-40 bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:w-52 transition-all duration-200"
            />
            <kbd className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 font-mono text-[9px] text-slate-500">
              /
            </kbd>
          </div>

          {/* Telemetry Stream / WebSocket indicator */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-950/40 px-2.5 py-1.5">
            <Wifi className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden font-mono text-[10px] text-slate-400 sm:block">
              Connected
            </span>
          </div>

          {/* Notifications */}
          <button
            className="relative rounded-lg border border-slate-800/80 bg-slate-950/40 p-2 text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2.5 border-l border-slate-800/80 pl-2.5 sm:pl-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/30 font-mono text-xs font-bold text-cyan-400">
              OP
            </div>

            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">
                EOC Officer
              </p>
              <p className="font-mono text-[9px] text-slate-500 leading-tight">
                Disaster Ops Cmd
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  summary,
  ranked,
  resources,
  missions,
  audit,
  zones,
  form,
  setForm,
  create,
  busy,
  action,
}) {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500">
            Emergency Operations Center
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Operational Command
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Real-time disaster response intelligence and coordination
          </p>

        </div>

        <div className="flex flex-wrap gap-2">

          <button
            disabled={busy}
            onClick={() =>
              action(
                api.seed,
                "Five-zone scenario seeded"
              )
            }
            className="flex items-center gap-2 border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />

            Seed 5 Zones
          </button>

          <button
            disabled={busy}
            onClick={() =>
              action(
                api.optimize,
                "Allocation optimized"
              )
            }
            className="flex items-center gap-2 border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-50"
          >
            <Zap className="h-3.5 w-3.5" />

            Optimize
          </button>

          <button
            disabled={busy}
            onClick={() =>
              action(
                api.emergency,
                "Zone B emergency triggered and resources re-allocated"
              )
            }
            className="flex items-center gap-2 border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-50"
          >
            🚨

            Emergency Simulation
          </button>

        </div>

      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">

        <KPICard
          title="Active Incidents"
          value={summary.active_incidents || 0}
          subtitle="Current incidents"
          icon={Siren}
        />

        <KPICard
          title="Critical Zones"
          value={summary.critical || 0}
          subtitle="Immediate attention"
          icon={ShieldAlert}
          accent="red"
        />

        <KPICard
          title="Resources Available"
          value={summary.available_resources || 0}
          subtitle="Operational units"
          icon={Package}
          accent="cyan"
        />

        <KPICard
          title="Active Missions"
          value={summary.active_missions || 0}
          subtitle="Response operations"
          icon={Truck}
          accent="orange"
        />

        <KPICard
          title="Agencies Active"
          value={summary.active_agencies || 0}
          subtitle="Connected agencies"
          icon={Building2}
          accent="emerald"
        />

      </div>

      {/* Main command area */}
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">

        {/* Map */}
        <Panel
          title="Operational Map"
          subtitle="Live disaster zone intelligence"
          action={
            <div className="flex gap-1">

              <span className="border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[9px] font-bold text-cyan-400">
                ZONES
              </span>

              <span className="border border-slate-800 px-2 py-1 text-[9px] text-slate-500">
                LIVE
              </span>

            </div>
          }
          className="min-h-[480px]"
        >

          <div className="h-[420px]">

            <MapContainer
              center={[18.53, 73.82]}
              zoom={11}
              className="h-full w-full"
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {zones.map((z) => {

                const color =
                  z.severity === "CRITICAL"
                    ? "#ef4444"
                    : z.severity === "HIGH"
                    ? "#f97316"
                    : z.severity === "MEDIUM"
                    ? "#eab308"
                    : "#22c55e";

                return (
                  <CircleMarker
                    key={z.zone_id}
                    center={[
                      z.latitude,
                      z.longitude,
                    ]}
                    radius={
                      z.severity === "CRITICAL"
                        ? 15
                        : 11
                    }
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: 0.7,
                      weight: 2,
                    }}
                  >
                    <Popup>

                      <strong>
                        {z.name}
                      </strong>

                      <br />

                      Severity: {z.severity}

                      <br />

                      Priority:{" "}
                      {Math.round(
                        z.priority_score || 0
                      )}

                    </Popup>
                  </CircleMarker>
                );
              })}

            </MapContainer>

          </div>

        </Panel>

        {/* Critical incidents */}
        <Panel
          title="Critical Incidents"
          subtitle="Priority-ranked emergency situations"
        >

          <div className="divide-y divide-slate-800">

            {ranked.length === 0 ? (

              <div className="p-10 text-center">

                <Siren className="mx-auto h-8 w-8 text-slate-700" />

                <p className="mt-3 text-xs text-slate-500">
                  No incidents available.
                </p>

                <p className="mt-1 text-[10px] text-slate-600">
                  Seed the five-zone scenario to begin.
                </p>

              </div>

            ) : (

              ranked.slice(0, 6).map((incident, index) => (

                <div
                  key={incident.incident_id}
                  className="cursor-pointer px-5 py-4 hover:bg-slate-900/60"
                >

                  <div className="flex items-start gap-3">

                    <div className="text-lg font-black text-slate-600">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="text-sm font-semibold text-white">
                          {incident.zone_id?.replace(
                            "ZONE-",
                            "Zone "
                          )}
                        </span>

                        <SeverityBadge
                          level={incident.severity}
                        />

                      </div>

                      <p className="mt-1 truncate text-[10px] text-slate-500">
                        {incident.disaster_type} ·{" "}
                        {incident.people_affected} people affected
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-lg font-black text-white">
                        {Math.round(
                          incident.priority_score || 0
                        )}
                      </p>

                      <p className="text-[8px] uppercase tracking-wider text-slate-600">
                        Priority
                      </p>

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </Panel>

      </div>

      {/* Bottom operational panels */}
      <div className="grid gap-6 xl:grid-cols-3">

        {/* Resources */}
        <Panel
          title="Resource Readiness"
          subtitle="Current operational inventory"
        >

          <div className="divide-y divide-slate-800">

            {resources.slice(0, 7).map((resource) => {

              const percentage =
                resource.quantity > 0
                  ? Math.round(
                      (resource.available_quantity /
                        resource.quantity) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={resource.resource_id}
                  className="px-5 py-4"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-xs font-medium text-slate-300">
                      {resource.type?.replaceAll(
                        "_",
                        " "
                      )}
                    </span>

                    <span className="text-[10px] text-slate-500">
                      {resource.available_quantity}/
                      {resource.quantity}
                    </span>

                  </div>

                  <div className="mt-2 h-1 bg-slate-800">

                    <div
                      className="h-full bg-cyan-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

            {resources.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-600">
                No resource data available.
              </div>
            )}

          </div>

        </Panel>

        {/* Missions */}
        <Panel
          title="Active Missions"
          subtitle="Current response operations"
        >

          <div className="divide-y divide-slate-800">

            {missions.slice(0, 5).map((mission) => (

              <div
                key={mission.mission_id}
                className="px-5 py-4"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold text-white">
                      {mission.mission_id}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-500">
                      {mission.agency_id} ·{" "}
                      {mission.zone_id?.replace(
                        "ZONE-",
                        "Zone "
                      )}
                    </p>

                  </div>

                  <span className="border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[8px] font-bold text-cyan-400">
                    {mission.status}
                  </span>

                </div>

                <div className="mt-3 flex gap-1">

                  {[1, 2, 3, 4, 5].map(
                    (step) => (
                      <div
                        key={step}
                        className={`h-1 flex-1 ${
                          step <= 3
                            ? "bg-cyan-500"
                            : "bg-slate-800"
                        }`}
                      />
                    )
                  )}

                </div>

              </div>

            ))}

            {missions.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-600">
                No active missions.
              </div>
            )}

          </div>

        </Panel>

        {/* Activity */}
        <Panel
          title="Live Activity"
          subtitle="Recent operational events"
        >

          <div className="divide-y divide-slate-800">

            {audit.slice(0, 6).map((event, index) => (

              <div
                key={event.id || index}
                className="flex gap-3 px-5 py-3"
              >

                <span className="whitespace-nowrap font-mono text-[9px] text-slate-600">
                  {new Date(
                    event.timestamp
                  ).toLocaleTimeString()}
                </span>

                <div>

                  <p className="text-[9px] font-bold tracking-wider text-cyan-400">
                    {event.event_type}
                  </p>

                  <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                    {event.description}
                  </p>

                </div>

              </div>

            ))}

            {audit.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-600">
                Waiting for operational events...
              </div>
            )}

          </div>

        </Panel>

      </div>

      {/* AI pipeline */}
      <Panel
        title="AI Operations Pipeline"
        subtitle="Agentic emergency decision workflow"
      >

        <div className="overflow-x-auto p-5">

          <div className="flex min-w-max items-center gap-2">

            {[
              "REPORT RECEIVED",
              "REPORT AGENT",
              "NEEDS ASSESSMENT",
              "PRIORITY AGENT",
              "DUPLICATE DETECTION",
              "ALLOCATION AGENT",
              "OR-TOOLS",
              "COORDINATION",
              "MISSION DISPATCH",
            ].map((step, index) => (

              <React.Fragment key={step}>

                <div
                  className={`
                    border px-3 py-2
                    ${
                      index === 6
                        ? "border-cyan-400/40 bg-cyan-500/10"
                        : "border-slate-800 bg-slate-900"
                    }
                  `}
                >

                  <p
                    className={`text-[9px] font-bold tracking-wider ${
                      index === 6
                        ? "text-cyan-400"
                        : "text-slate-400"
                    }`}
                  >
                    {step}
                  </p>

                  <p className="mt-1 text-[8px] text-slate-600">
                    {index < 6
                      ? "READY"
                      : index === 6
                      ? "OPTIMIZATION ENGINE"
                      : "READY"}
                  </p>

                </div>

                {index < 8 && (
                  <span className="text-slate-700">
                    →
                  </span>
                )}

              </React.Fragment>

            ))}

          </div>

        </div>

      </Panel>

    
      
    </div>
  );
}

/* =========================================================
   GENERIC TABLE
========================================================= */

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto border border-slate-800 bg-[#0b111b]">

      <table className="w-full text-left text-sm">

        <thead className="bg-slate-950">

          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="whitespace-nowrap px-4 py-4 text-[9px] font-bold uppercase tracking-wider text-slate-500"
              >
                {header}
              </th>
            ))}
          </tr>

        </thead>

        <tbody>

          {rows.length === 0 ? (

            <tr>

              <td
                colSpan={headers.length}
                className="p-12 text-center text-xs text-slate-600"
              >
                No data available.
              </td>

            </tr>

          ) : (

            rows.map((row, index) => (

              <tr
                key={index}
                className="border-t border-slate-800 transition hover:bg-slate-900/60"
              >

                {row.map((cell, cellIndex) => (

                  <td
                    key={cellIndex}
                    className="whitespace-nowrap px-4 py-4 text-xs text-slate-300"
                  >
                    {cell}
                  </td>

                ))}

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

/* =========================================================
   DATA PAGES
========================================================= */

function IncidentsPage({ incidents }) {
  const ranked = [...incidents].sort(
    (a, b) =>
      (b.priority_score || 0) -
      (a.priority_score || 0)
  );

  return (
    <Page title="Incident Management">
      <Table
        headers={[
          "Zone",
          "Disaster",
          "Affected",
          "Severity",
          "Priority",
          "Needs",
        ]}
        rows={ranked.map((incident) => [
          incident.zone_id?.replace(
            "ZONE-",
            "Zone "
          ),

          incident.disaster_type,

          incident.people_affected,

          <SeverityBadge
            key="severity"
            level={incident.severity}
          />,

          Math.round(
            incident.priority_score || 0
          ),

          Object.entries(incident.needs || {})
            .filter(([, value]) => value > 0)
            .map(
              ([key, value]) =>
                `${key.replaceAll("_", " ")}: ${value}`
            )
            .join(" • "),
        ])}
      />
    </Page>
  );
}

function ResourcesPage({ resources }) {
  return (
    <Page title="Resource Management">
      <Table
        headers={[
          "Resource",
          "Type",
          "Available",
          "Agency",
          "Status",
        ]}
        rows={resources.map((resource) => [
          resource.resource_id,

          resource.type?.replaceAll(
            "_",
            " "
          ),

          `${resource.available_quantity} / ${resource.quantity}`,

          resource.agency_id,

          resource.status,
        ])}
      />
    </Page>
  );
}

function MissionsPage({ missions }) {
  return (
    <Page title="Mission Control">
      <Table
        headers={[
          "Mission",
          "Zone",
          "Agency",
          "Resource",
          "Qty",
          "Status",
        ]}
        rows={missions.map((mission) => [
          mission.mission_id,

          mission.zone_id?.replace(
            "ZONE-",
            "Zone "
          ),

          mission.agency_id,

          mission.resource_type?.replaceAll(
            "_",
            " "
          ),

          mission.quantity,

          mission.status,
        ])}
      />
    </Page>
  );
}

function AuditPage({ audit }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);

  const EVENT_CONFIG = {
    SYSTEM_INITIALIZED:   { color: "text-slate-300 bg-slate-900/60 border-slate-700/60", dot: "bg-slate-400", label: "SYSTEM" },
    INCIDENT_CREATED:     { color: "text-red-300 bg-red-950/40 border-red-500/40",       dot: "bg-red-400",   label: "INCIDENT" },
    DUPLICATE_DETECTED:   { color: "text-amber-300 bg-amber-950/30 border-amber-500/40", dot: "bg-amber-400", label: "DUPLICATE" },
    ALLOCATION_OPTIMIZED: { color: "text-cyan-300 bg-cyan-950/30 border-cyan-500/40",    dot: "bg-cyan-400",  label: "ALLOCATION" },
    REALLOCATION_COMPLETED:{ color: "text-blue-300 bg-blue-950/30 border-blue-500/40",   dot: "bg-blue-400",  label: "REALLOC" },
    MISSION_DISPATCHED:   { color: "text-emerald-300 bg-emerald-950/30 border-emerald-500/40", dot: "bg-emerald-400", label: "MISSION" },
    HUMAN_APPROVED:       { color: "text-violet-300 bg-violet-950/30 border-violet-500/40",    dot: "bg-violet-400",  label: "APPROVED" },
  };

  const ACTOR_ICONS = {
    system:           { icon: Cpu,      label: "System" },
    report_agent:     { icon: FileText, label: "Report Agent" },
    duplicate_agent:  { icon: Layers,   label: "Duplicate Agent" },
    allocation_agent: { icon: Sliders,  label: "Allocation Agent" },
    needs_agent:      { icon: Bot,      label: "Needs Agent" },
    priority_agent:   { icon: Activity, label: "Priority Agent" },
    human:            { icon: Eye,      label: "Human Operator" },
  };

  const allTypes = ["ALL", ...Array.from(new Set(audit.map(e => e.event_type)))];

  const filtered = audit.filter(e => {
    const matchSearch = !search ||
      e.description?.toLowerCase().includes(search.toLowerCase()) ||
      e.event_type?.toLowerCase().includes(search.toLowerCase()) ||
      e.actor?.toLowerCase().includes(search.toLowerCase()) ||
      e.incident_id?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "ALL" || e.event_type === filterType;
    return matchSearch && matchType;
  });

  const counts = Object.fromEntries(
    Object.keys(EVENT_CONFIG).map(k => [k, audit.filter(e => e.event_type === k).length])
  );

  function getEventCfg(type) {
    return EVENT_CONFIG[type] || {
      color: "text-slate-400 bg-slate-900/40 border-slate-700/40",
      dot: "bg-slate-500",
      label: type?.split("_")[0] || "EVENT",
    };
  }

  function getActorCfg(actor) {
    return ACTOR_ICONS[actor] || { icon: Radio, label: actor || "Unknown" };
  }

  return (
    <Page title="Operational Audit Log">

      {/* ── SUMMARY STRIP ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-800/80 bg-[#080d16]/90 p-4">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">Total Events</p>
          <p className="mt-1.5 font-mono text-2xl font-extrabold text-white">{audit.length}</p>
        </div>
        <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-4">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-red-500/70">Incidents</p>
          <p className="mt-1.5 font-mono text-2xl font-extrabold text-red-300">{counts.INCIDENT_CREATED || 0}</p>
        </div>
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-amber-500/70">Duplicates</p>
          <p className="mt-1.5 font-mono text-2xl font-extrabold text-amber-300">{counts.DUPLICATE_DETECTED || 0}</p>
        </div>
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-500/70">Allocations</p>
          <p className="mt-1.5 font-mono text-2xl font-extrabold text-cyan-300">{(counts.ALLOCATION_OPTIMIZED || 0) + (counts.REALLOCATION_COMPLETED || 0)}</p>
        </div>
      </div>

      {/* ── MAIN PANEL ── */}
      <Panel
        title="Decision Audit Trail"
        subtitle="Complete agentic workflow trace — all events sourced from live backend"
        action={
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-emerald-400">Live</span>
          </div>
        }
      >
        {/* ── TOOLBAR ── */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-800/60 bg-slate-950/30 px-5 py-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events, actors, descriptions..."
              className="w-full rounded border border-slate-800 bg-[#06090e] py-1.5 pl-8 pr-3 font-mono text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
            />
          </div>
          {/* Filter pills */}
          <div className="flex flex-wrap gap-1.5">
            {allTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`rounded border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider transition-all ${
                  filterType === type
                    ? "border-cyan-500/60 bg-cyan-950/40 text-cyan-300"
                    : "border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                }`}
              >
                {type === "ALL" ? "All" : getEventCfg(type).label}
                {type !== "ALL" && (
                  <span className="ml-1.5 text-slate-600">
                    {audit.filter(e => e.event_type === type).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <span className="ml-auto font-mono text-[9px] text-slate-600">
            {filtered.length}/{audit.length} events
          </span>
        </div>

        {/* ── LOG ENTRIES ── */}
        <div className="divide-y divide-slate-800/50">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-slate-600">
              <FileClock className="h-8 w-8 opacity-30" />
              <p className="text-xs">No audit events match your filter</p>
            </div>
          ) : (
            filtered.map((event, i) => {
              const cfg = getEventCfg(event.event_type);
              const actorCfg = getActorCfg(event.actor);
              const ActorIcon = actorCfg.icon;
              const isExpanded = expandedId === event.log_id;
              const hasMetadata = event.metadata && Object.keys(event.metadata).length > 0;
              const ts = event.timestamp ? new Date(event.timestamp) : null;

              return (
                <div
                  key={event.log_id || i}
                  className={`group transition-colors duration-100 ${isExpanded ? "bg-slate-900/50" : "hover:bg-slate-900/30"}`}
                >
                  <div
                    className="flex items-start gap-4 px-5 py-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : event.log_id)}
                  >
                    {/* Timeline dot */}
                    <div className="relative mt-0.5 flex flex-col items-center">
                      <span className={`h-2.5 w-2.5 rounded-full border-2 border-[#080d16] ${cfg.dot}`} />
                      {i < filtered.length - 1 && (
                        <span className="absolute top-3 h-full w-px bg-slate-800/60" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Event Type Badge */}
                        <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${cfg.color}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                          {event.event_type?.replaceAll("_", " ")}
                        </span>

                        {/* Incident ID */}
                        {event.incident_id && (
                          <span className="rounded border border-slate-700/60 bg-slate-900/60 px-2 py-0.5 font-mono text-[9px] text-slate-400">
                            {event.incident_id}
                          </span>
                        )}

                        {/* Log ID */}
                        <span className="font-mono text-[9px] text-slate-700">
                          {event.log_id}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Actor + timestamp row */}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <ActorIcon className="h-3 w-3" />
                          <span className="font-mono">{actorCfg.label}</span>
                        </span>
                        {ts && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            <span className="font-mono">
                              {ts.toLocaleDateString()} {ts.toLocaleTimeString()}
                            </span>
                          </span>
                        )}
                        {hasMetadata && (
                          <span className={`flex items-center gap-1 font-mono text-[9px] transition-colors ${isExpanded ? "text-cyan-400" : "text-slate-600 group-hover:text-slate-500"}`}>
                            <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                            {isExpanded ? "Hide details" : "Show details"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded metadata */}
                  {isExpanded && hasMetadata && (
                    <div className="mx-5 mb-4 rounded border border-slate-800 bg-[#06090e]/80 p-4">
                      <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">Metadata</p>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(event.metadata).map(([k, v]) => (
                          <div key={k} className="rounded border border-slate-800/60 bg-slate-900/40 px-3 py-2">
                            <p className="font-mono text-[8px] uppercase tracking-wider text-slate-600">{k.replaceAll("_", " ")}</p>
                            <p className="mt-0.5 font-mono text-xs font-semibold text-slate-200">
                              {typeof v === "object" ? JSON.stringify(v) : String(v)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </Panel>
    </Page>
  );
}

function AgenciesPage({ summary }) {
  return (
    <Page title="Agency Coordination">

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {[
          "Fire Department",
          "Medical Response",
          "Police Department",
          "Relief Operations",
        ].map((agency) => (

          <div
            key={agency}
            className="border border-slate-800 bg-[#0b111b] p-5"
          >

            <div className="flex items-center justify-between">

              <Building2 className="h-5 w-5 text-cyan-400" />

              <span className="text-[9px] font-bold text-emerald-400">
                ONLINE
              </span>

            </div>

            <h3 className="mt-5 text-sm font-bold text-white">
              {agency}
            </h3>

            <div className="mt-4 space-y-2 text-[10px] text-slate-500">

              <div className="flex justify-between">
                <span>Personnel</span>
                <span className="text-slate-300">
                  Active
                </span>
              </div>

              <div className="flex justify-between">
                <span>Resources</span>
                <span className="text-slate-300">
                  Operational
                </span>
              </div>

              <div className="flex justify-between">
                <span>Response</span>
                <span className="text-cyan-400">
                  HIGH
                </span>
              </div>

            </div>

          </div>

        ))}

      </div>

    </Page>
  );
}

function AnalyticsPage({
  incidents,
  resources,
  missions,
}) {
  const critical = incidents.filter(
    (i) => i.severity === "CRITICAL"
  ).length;

  const high = incidents.filter(
    (i) => i.severity === "HIGH"
  ).length;

  return (
    <Page title="Operational Analytics">

      <div className="grid gap-4 md:grid-cols-3">

        <KPICard
          title="Critical Incidents"
          value={critical}
          subtitle="Immediate response"
          icon={ShieldAlert}
          accent="red"
        />

        <KPICard
          title="High Severity"
          value={high}
          subtitle="Priority response"
          icon={Siren}
          accent="orange"
        />

        <KPICard
          title="Tracked Resources"
          value={resources.length}
          subtitle="Inventory records"
          icon={Package}
        />

      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        <Panel
          title="Severity Distribution"
          subtitle="Current incident profile"
        >

          <div className="space-y-5 p-6">

            {[
              ["CRITICAL", critical],
              ["HIGH", high],
              [
                "MEDIUM",
                incidents.filter(
                  (i) =>
                    i.severity === "MEDIUM"
                ).length,
              ],
              [
                "LOW",
                incidents.filter(
                  (i) => i.severity === "LOW"
                ).length,
              ],
            ].map(([label, value]) => {

              const max =
                Math.max(incidents.length, 1);

              return (
                <div key={label}>

                  <div className="mb-2 flex justify-between">

                    <SeverityBadge level={label} />

                    <span className="text-xs text-slate-400">
                      {value}
                    </span>

                  </div>

                  <div className="h-1.5 bg-slate-800">

                    <div
                      className="h-full bg-cyan-500"
                      style={{
                        width: `${
                          (value / max) * 100
                        }%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>

        </Panel>

        <Panel
          title="Mission Activity"
          subtitle="Current operational missions"
        >

          <div className="p-6">

            <p className="text-4xl font-black text-white">
              {missions.length}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              missions currently tracked
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">

              <div className="border border-slate-800 bg-slate-950 p-4">

                <p className="text-[9px] text-slate-600">
                  DISPATCHED
                </p>

                <p className="mt-2 text-xl font-bold text-cyan-400">
                  {
                    missions.filter(
                      (m) =>
                        m.status ===
                        "DISPATCHED"
                    ).length
                  }
                </p>

              </div>

              <div className="border border-slate-800 bg-slate-950 p-4">

                <p className="text-[9px] text-slate-600">
                  IN PROGRESS
                </p>

                <p className="mt-2 text-xl font-bold text-orange-400">
                  {
                    missions.filter(
                      (m) =>
                        m.status ===
                        "IN_PROGRESS"
                    ).length
                  }
                </p>

              </div>

            </div>

          </div>

        </Panel>

      </div>

    </Page>
  );
}

function LiveMapPage({ zones }) {
  return (
    <Page title="Live Disaster Map">

      <div className="h-[calc(100vh-150px)] min-h-[600px] overflow-hidden border border-slate-800">

        <MapContainer
          center={[18.53, 73.82]}
          zoom={11}
          className="h-full w-full"
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {zones.map((zone) => {

            const color =
              zone.severity === "CRITICAL"
                ? "#ef4444"
                : zone.severity === "HIGH"
                ? "#f97316"
                : zone.severity === "MEDIUM"
                ? "#eab308"
                : "#22c55e";

            return (
              <CircleMarker
                key={zone.zone_id}
                center={[
                  zone.latitude,
                  zone.longitude,
                ]}
                radius={
                  zone.severity === "CRITICAL"
                    ? 16
                    : 12
                }
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.75,
                }}
              >

                <Popup>

                  <strong>
                    {zone.name}
                  </strong>

                  <br />

                  Severity: {zone.severity}

                  <br />

                  Priority:{" "}
                  {Math.round(
                    zone.priority_score || 0
                  )}

                </Popup>

              </CircleMarker>
            );
          })}

        </MapContainer>

      </div>

    </Page>
  );
}

/* =========================================================
   PAGE WRAPPER
========================================================= */

function Page({ title, children }) {
  return (
    <div className="space-y-6">

      <div>

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500">
          ResQAI Operations
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          {title}
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Emergency response coordination and operational intelligence
        </p>

      </div>

      {children}

    </div>
  );
}

/* =========================================================
   MAIN APPLICATION
========================================================= */

function Application() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [summary, setSummary] = useState({});
  const [incidents, setIncidents] = useState([]);
  const [resources, setResources] = useState([]);
  const [missions, setMissions] = useState([]);
  const [audit, setAudit] = useState([]);
  const [zones, setZones] = useState([]);

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    zone_id: "ZONE-A",
    disaster_type: "flood",
    report: "",
  });

  /* =====================================================
     REFRESH DATA
  ===================================================== */

  const refresh = async () => {

    try {

      const [
        summaryData,
        incidentsData,
        resourcesData,
        missionsData,
        auditData,
        zonesData,
      ] = await Promise.all([
        api.summary(),
        api.incidents(),
        api.resources(),
        api.missions(),
        api.audit(),
        api.zones(),
      ]);

      setSummary(summaryData || {});
      setIncidents(incidentsData || []);
      setResources(resourcesData || []);
      setMissions(missionsData || []);
      setAudit(auditData || []);
      setZones(zonesData || []);

    } catch (error) {

      console.error(
        "Failed to refresh ResQAI data:",
        error
      );

      setToast(
        error?.message ||
          "Failed to load operational data"
      );
    }
  };

  /* =====================================================
     WEBSOCKET
  ===================================================== */

  useEffect(() => {

    refresh();

    const ws = connectSocket(() => {
      refresh();
    });

    return () => {
      ws?.close();
    };

  }, []);

  /* =====================================================
     TOAST
  ===================================================== */

  useEffect(() => {

    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 4000);

    return () => clearTimeout(timer);

  }, [toast]);

  /* =====================================================
     ACTION
  ===================================================== */

  const action = async (fn, message) => {

    try {

      setBusy(true);

      await fn();

      await refresh();

      setToast(message);

    } catch (error) {

      console.error(error);

      setToast(
        error?.message ||
          "Operation failed"
      );

    } finally {

      setBusy(false);

    }
  };

  /* =====================================================
     CREATE INCIDENT
  ===================================================== */

  const create = async (event) => {

    event.preventDefault();

    await action(
      () => api.createIncident(form),
      "Incident analyzed and added"
    );

    setForm((previous) => ({
      ...previous,
      report: "",
    }));
  };

  /* =====================================================
     RANK INCIDENTS
  ===================================================== */

  const ranked = useMemo(
    () =>
      [...incidents].sort(
        (a, b) =>
          (b.priority_score || 0) -
          (a.priority_score || 0)
      ),
    [incidents]
  );

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-200">

      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <Topbar
        summary={summary}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      <main className="lg:ml-64 pt-16 transition-all duration-200">

        <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">

          {/* Toast */}
          {toast && (
            <div className="fixed right-6 top-20 z-[100] max-w-md border border-cyan-500/30 bg-[#0b111b] px-5 py-4 shadow-2xl">

              <div className="flex items-start gap-3">

                <Activity className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

                <p className="text-xs leading-relaxed text-cyan-200">
                  {toast}
                </p>

              </div>

            </div>
          )}

          <Routes>

            <Route
              path="/"
              element={
                <Dashboard
                  summary={summary}
                  ranked={ranked}
                  resources={resources}
                  missions={missions}
                  audit={audit}
                  zones={zones}
                  form={form}
                  setForm={setForm}
                  create={create}
                  busy={busy}
                  action={action}
                />
              }
            />

             {/* Victim Emergency Reporting */}
           <Route
              path="/report"
              element={<VictimReport zones={zones} />}
            />

            <Route
              path="/"
              element={
                <Dashboard
                  summary={summary}
                  ranked={ranked}
                  resources={resources}
                  missions={missions}
                  audit={audit}
                  zones={zones}
                  form={form}
                  setForm={setForm}
                  create={create}
                  busy={busy}
                  action={action}
                />
              }
            />


           <Route
            path="/incidents"
            element={
              <IncidentsPage
                incidents={incidents}
              />
            }
          />

          <Route
            path="/critical-incident"
            element={
              <CriticalIncident
                zones={zones}
              />
            }
            />

            <Route
              path="/resources"
              element={
                <ResourcesPage
                  resources={resources}
                />
              }
            />

            <Route
              path="/missions"
              element={
                <MissionsPage
                  missions={missions}
                />
              }
            />

            <Route
              path="/agencies"
              element={
                <AgenciesPage
                  summary={summary}
                />
              }
            />

            <Route
              path="/map"
              element={
                <LiveMapPage
                  zones={zones}
                />
              }
            />

            <Route
              path="/analytics"
              element={
                <AnalyticsPage
                  incidents={incidents}
                  resources={resources}
                  missions={missions}
                />
              }
            />

            <Route
              path="/audit"
              element={
                <AuditPage
                  audit={audit}
                />
              }
            />

            <Route
            
              path="/settings"
              element={
                <Page title="Settings">

                  <Panel
                    title="System Configuration"
                    subtitle="ResQAI operational settings"
                  >

                    <div className="p-8 text-sm text-slate-500">
                      Settings module will be connected to the backend configuration later.
                    </div>

                  </Panel>

                </Page>
              }
            />

          </Routes>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   ROOT
========================================================= */

export default function App() {
  return (
    <BrowserRouter>
      <Application />
    </BrowserRouter>
  );
}