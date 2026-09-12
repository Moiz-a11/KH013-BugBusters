import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
  Navigate,
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
  HelpCircle,
  Info,
  CheckCircle2,
  HeartHandshake,
  LogOut,
  UserCheck,
  Lock,
  Plus,
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
import LandingPage from "./components/LandingPage";
import ReliefPartners from "./pages/ReliefPartners";
import SystemConfig from "./pages/SystemConfig";
import Analytics from "./pages/Analytics";
import AuditPage from "./pages/AuditLog";
import PendingReportsPanel from "./components/dashboard/PendingReportsPanel";
import "./index.css";

/* =========================================================
   NAVIGATION
========================================================= */

const responderNavigation = [
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
    name: "Relief Partners",
    path: "/partners",
    icon: HeartHandshake,
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
    "text-red-700 bg-red-50 border-red-200 font-semibold",

  HIGH:
    "text-amber-700 bg-amber-50 border-amber-200 font-semibold",

  MEDIUM:
    "text-yellow-800 bg-yellow-50 border-yellow-200 font-semibold",

  LOW:
    "text-blue-700 bg-blue-50 border-blue-200 font-semibold",

  MONITORING:
    "text-slate-700 bg-slate-100 border-slate-200 font-semibold",
};

function SeverityBadge({ level }) {
  const normalized = (level || "MONITORING").toUpperCase();
  const cls = severityClass[normalized] || severityClass.MONITORING;
  const isCritical = normalized === "CRITICAL";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-md border px-2 py-0.5
        font-mono text-[10px] uppercase tracking-wider
        ${cls}
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isCritical ? "bg-red-500 animate-pulse" : "bg-current"}`} />

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
      border: "border-slate-200 hover:border-blue-300",
      line: "bg-blue-600",
      iconBg: "border-blue-200 bg-blue-50 text-blue-700",
      num: "text-slate-900",
    },
    red: {
      border: "border-red-200 hover:border-red-300 bg-red-50/30",
      line: "bg-red-600",
      iconBg: "border-red-200 bg-red-50 text-red-600",
      num: "text-red-700",
    },
    orange: {
      border: "border-slate-200 hover:border-amber-300",
      line: "bg-amber-500",
      iconBg: "border-amber-200 bg-amber-50 text-amber-700",
      num: "text-slate-900",
    },
    emerald: {
      border: "border-slate-200 hover:border-emerald-300",
      line: "bg-emerald-500",
      iconBg: "border-emerald-200 bg-emerald-50 text-emerald-700",
      num: "text-slate-900",
    },
  };

  const current = accentClasses[accent] || accentClasses.cyan;

  return (
    <div className={`relative overflow-hidden rounded-xl border ${current.border} bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
      <div className={`absolute left-0 top-0 h-[2px] w-full ${current.line}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
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
          <div className={`rounded-xl border p-2.5 ${current.iconBg}`}>
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
        relative overflow-hidden rounded-xl
        border border-slate-200
        bg-white shadow-sm
        transition-all duration-200
        ${className}
      `}
    >
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-700 via-blue-500 to-transparent" />
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-0.5 text-[11px] text-slate-500">
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

function Sidebar({ mobileOpen = false, onClose = () => {}, userRole = "responder", onSwitchRole = () => {} }) {
  const isPublic = userRole === "public";

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header / Insignia */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl border text-white shadow-xs ${
              isPublic ? "border-amber-600 bg-amber-600" : "border-blue-900 bg-blue-900"
            }`}>
              <ShieldAlert className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-mono text-base font-black tracking-widest text-slate-900">
                  RESQAI
                </h1>
                <span className={`rounded px-1 py-0.2 font-mono text-[8px] font-bold border ${
                  isPublic
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {isPublic ? "PUBLIC" : "EOC"}
                </span>
              </div>

              <p className="font-mono text-[8px] font-semibold tracking-[0.2em] text-slate-500">
                {isPublic ? "VICTIM PORTAL" : "DISASTER COMMAND"}
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {isPublic ? "Public Services" : "Operations Console"}
          </p>

          {!isPublic &&
            responderNavigation.map((item) => {
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
                          ? "border-l-4 border-red-600 bg-red-50 text-red-900 font-semibold"
                          : "border-l-4 border-blue-700 bg-blue-50 text-blue-900 font-semibold"
                        : "border-l-4 border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? isCritical
                              ? "text-red-600"
                              : "text-blue-700"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />

                      <span className="truncate">{item.name || item.label}</span>

                      {isCritical && (
                        <span className="ml-auto font-mono text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                          URGENT
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}

          <div className="my-3 border-t border-slate-100" />

          {/* Victim reporting public link */}
          <NavLink
            to="/report"
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition ${
                isActive
                  ? "border-l-4 border-amber-500 bg-amber-50 text-amber-900 font-semibold"
                  : "border-l-4 border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <Radio className="h-4 w-4 text-amber-600" />
            <div className="min-w-0">
              <span className="block truncate font-medium">Victim Reporting</span>
              <span className="block text-[9px] text-slate-400">Public Emergency Input</span>
            </div>
          </NavLink>

          <NavLink
            to="/partners"
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition ${
                isActive
                  ? "border-l-4 border-blue-600 bg-blue-50 text-blue-900 font-semibold"
                  : "border-l-4 border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <HeartHandshake className="h-4 w-4 text-blue-600" />
            <div className="min-w-0">
              <span className="block truncate font-medium">Relief Partners</span>
              <span className="block text-[9px] text-slate-400">Verified Organizations</span>
            </div>
          </NavLink>

          {!isPublic && (
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Settings className="h-4 w-4 text-slate-400" />
              <span>System Configuration</span>
            </NavLink>
          )}

          {/* Switch Role Button */}
          <div className="pt-4">
            <button
              onClick={() => onSwitchRole(null)}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition shadow-2xs"
            >
              <LogOut className="h-3.5 w-3.5 text-slate-500" />
              <span>{isPublic ? "EOC Responder Login" : "Switch Mode / Landing"}</span>
            </button>
          </div>
        </nav>

        {/* System Health Card */}
        <div className="border-t border-slate-100 p-3.5 bg-slate-50/60">
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  SYSTEM ONLINE
                </span>
              </div>
              <span className="font-mono text-[9px] text-slate-500">
                v1.0.0
              </span>
            </div>

            <p className="mt-1 font-mono text-[9px] text-emerald-700">
              {isPublic ? "Public Offline Sync Enabled" : "Live WebSocket telemetry active"}
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

function Topbar({ summary, onToggleMobileMenu = () => {}, userRole = "responder", onSwitchRole = () => {}, connectionStatus = "CONNECTED" }) {
  const isPublic = userRole === "public";

  return (
    <header className="fixed left-0 right-0 lg:left-64 top-0 z-40 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile hamburger toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Operational status */}
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-700">
              {isPublic ? "PUBLIC INTAKE PORTAL" : "LIVE SYSTEM"}
            </span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-200" />

          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
            <Activity className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-[11px] text-slate-500">Mode:</span>
            <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${
              isPublic
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-slate-100 text-slate-800 border-slate-200"
            }`}>
              {isPublic ? "PUBLIC / VICTIM" : "AUTHORIZED RESPONDER"}
            </span>
          </div>

          {!isPublic && (
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
              <Siren className="h-3.5 w-3.5 text-red-600" />
              <span className="font-mono text-xs font-bold text-slate-900">
                {summary?.active_incidents || 0}
              </span>
              <span className="text-[11px] text-slate-500">Active Incidents</span>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          {!isPublic && (
            <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 md:flex focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search sectors, missions..."
                className="w-40 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:w-52 transition-all duration-200"
              />
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[9px] text-slate-400 shadow-2xs">
                /
              </kbd>
            </div>
          )}

          {/* Telemetry Stream / WebSocket & API indicator */}
          <div
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs transition-all ${
              connectionStatus === "CONNECTED"
                ? "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50"
                : connectionStatus === "RECONNECTING"
                ? "border-amber-200 bg-amber-50/50 hover:bg-amber-50"
                : "border-red-200 bg-red-50/50 hover:bg-red-50"
            }`}
            title="API + Live WebSocket"
          >
            {connectionStatus === "CONNECTED" && (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-mono text-[9px] font-bold text-emerald-800 leading-none">
                    CONNECTED
                  </span>
                  <span className="text-[7.5px] font-medium text-slate-500 leading-none mt-0.5">
                    API + Live WebSocket
                  </span>
                </div>
              </>
            )}

            {connectionStatus === "RECONNECTING" && (
              <>
                <RefreshCw className="h-3.5 w-3.5 text-amber-600 animate-spin" />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-mono text-[9px] font-bold text-amber-800 leading-none">
                    RECONNECTING
                  </span>
                  <span className="text-[7.5px] font-medium text-slate-500 leading-none mt-0.5">
                    WebSocket Reconnecting...
                  </span>
                </div>
              </>
            )}

            {connectionStatus === "DISCONNECTED" && (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                <Wifi className="h-3.5 w-3.5 text-red-500 opacity-60" />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-mono text-[9px] font-bold text-red-800 leading-none">
                    OFFLINE
                  </span>
                  <span className="text-[7.5px] font-medium text-slate-500 leading-none mt-0.5">
                    API / WS Unavailable
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Role Switch Action */}
          <button
            onClick={() => onSwitchRole(null)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <LogOut className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Switch Role</span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2.5 border-l border-slate-200 pl-2.5 sm:pl-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-xs font-bold text-white shadow-2xs ${
              isPublic ? "border-amber-600 bg-amber-600" : "border-blue-900 bg-blue-900"
            }`}>
              {isPublic ? "PUB" : "OP"}
            </div>

            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {isPublic ? "Public User" : "EOC Officer"}
              </p>
              <p className="font-mono text-[9px] text-slate-500 leading-tight">
                {isPublic ? "Emergency Portal" : "Disaster Ops Cmd"}
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
  onWhyPriorityClick,
  pendingIncidents = [],
}) {
  return (
    <div className="space-y-6">

      {/* Pending Public Reports Panel for EOC Responder Review */}
      <PendingReportsPanel
        pendingIncidents={pendingIncidents}
        onActionSuccess={(msg) => action(() => Promise.resolve(), msg)}
      />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
            Emergency Operations Center
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
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
            className="flex items-center gap-2 rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 shadow-sm transition-all"
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
            className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-50 shadow-sm transition-all"
          >
            <Zap className="h-3.5 w-3.5 text-blue-600" />

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
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50 shadow-sm transition-all"
          >
            🚨

            Emergency Simulation
          </button>

        </div>

      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:grid-cols-5">

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
          title="Available Resource Units"
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
          value={summary.active_agencies || 4}
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
            <div className="flex gap-1.5">

              <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700">
                ZONES
              </span>

              <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-600">
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
                      fillOpacity: 0.75,
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

          <div className="divide-y divide-slate-100">

            {ranked.length === 0 ? (

              <div className="p-10 text-center">

                <Siren className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-3 text-xs text-slate-500">
                  No incidents available.
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  Seed the five-zone scenario to begin.
                </p>

              </div>

            ) : (

              ranked.slice(0, 6).map((incident, index) => (

                <div
                  key={incident.incident_id}
                  className="cursor-pointer px-5 py-3.5 transition hover:bg-slate-50/80"
                >

                  <div className="flex items-start gap-3">

                    <div className="text-base font-black text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="text-sm font-semibold text-slate-900">
                          {incident.zone_id?.replace(
                            "ZONE-",
                            "Zone "
                          )}
                        </span>

                        <SeverityBadge
                          level={incident.severity}
                        />

                      </div>

                      <p className="mt-0.5 truncate text-[10px] text-slate-500">
                        {incident.disaster_type} ·{" "}
                        {incident.people_affected} people affected
                      </p>

                      {onWhyPriorityClick && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onWhyPriorityClick(incident);
                          }}
                          className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 hover:text-blue-900 hover:underline transition"
                        >
                          <HelpCircle className="h-3 w-3 text-blue-600" />
                          Why this priority?
                        </button>
                      )}

                    </div>

                    <div className="text-right">

                      <p className="text-base font-black text-slate-900">
                        {Math.round(
                          incident.priority_score || 0
                        )}
                      </p>

                      <p className="text-[8px] uppercase tracking-wider text-slate-400">
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

          <div className="divide-y divide-slate-100">

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
                  className="px-5 py-3.5"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-xs font-medium text-slate-800">
                      {resource.type?.replaceAll(
                        "_",
                        " "
                      )}
                    </span>

                    <span className="font-mono text-[10px] text-slate-500 font-semibold">
                      {resource.available_quantity}/
                      {resource.quantity}
                    </span>

                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

            {resources.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
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

          <div className="divide-y divide-slate-100">

            {missions.slice(0, 5).map((mission) => (

              <div
                key={mission.mission_id}
                className="px-5 py-3.5"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold text-slate-900">
                      {mission.mission_id}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {mission.agency_id} ·{" "}
                      {mission.zone_id?.replace(
                        "ZONE-",
                        "Zone "
                      )}
                    </p>

                  </div>

                  <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[8px] font-bold text-blue-700">
                    {mission.status}
                  </span>

                </div>

                <div className="mt-2.5 flex gap-1">

                  {[1, 2, 3, 4, 5].map(
                    (step) => (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full ${
                          step <= 3
                            ? "bg-blue-600"
                            : "bg-slate-100"
                        }`}
                      />
                    )
                  )}

                </div>

              </div>

            ))}

            {missions.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
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

          <div className="divide-y divide-slate-100">

            {audit.slice(0, 6).map((event, index) => (

              <div
                key={event.id || index}
                className="flex gap-3 px-5 py-3"
              >

                <span className="whitespace-nowrap font-mono text-[9px] text-slate-400">
                  {new Date(
                    event.timestamp
                  ).toLocaleTimeString()}
                </span>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-wider text-blue-700">
                    {event.event_type}
                  </p>

                  <p className="mt-0.5 text-[10px] leading-relaxed text-slate-600">
                    {event.description}
                  </p>

                </div>

              </div>

            ))}

            {audit.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                Waiting for operational events...
              </div>
            )}

          </div>

        </Panel>

      </div>

      {/* AI Decision Pipeline */}
      <Panel
        title="AI Decision Pipeline"
        subtitle="Agentic disaster intake, ML evaluation, priority ranking, and OR-Tools optimization workflow"
      >

        <div className="overflow-x-auto p-5">

          <div className="flex min-w-max items-center justify-between gap-2 sm:gap-3">

            {[
              { name: "REPORT", tag: "INTAKE" },
              { name: "NEEDS (ML)", tag: "INFERENCE" },
              { name: "PRIORITY", tag: "SCORING" },
              { name: "DUPLICATE CHECK", tag: "FILTER" },
              { name: "OR-TOOLS", tag: "OPTIMIZATION" },
              { name: "COORDINATION", tag: "DISPATCH" },
              { name: "MISSION", tag: "EXECUTION" },
            ].map((step, index) => (

              <React.Fragment key={step.name}>

                <div
                  className={`
                    min-w-[130px] rounded-xl border px-3.5 py-3 text-center shadow-2xs transition-all
                    ${
                      step.name === "OR-TOOLS"
                        ? "border-blue-300 bg-blue-50/80 font-bold ring-2 ring-blue-100"
                        : "border-slate-200 bg-white"
                    }
                  `}
                >

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-900">
                    {step.name}
                  </p>

                  <span
                    className={`mt-1.5 inline-block rounded px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider ${
                      step.name === "OR-TOOLS"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {step.tag}
                  </span>

                </div>

                {index < 6 && (
                  <span className="px-1 text-sm font-bold text-slate-300">
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
    <div className="overflow-x-auto border border-slate-200 bg-white rounded-xl shadow-sm">

      <table className="w-full text-left text-sm">

        <thead className="bg-slate-50 border-b border-slate-200">

          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="whitespace-nowrap px-4 py-3.5 text-[9px] font-bold uppercase tracking-wider text-slate-600"
              >
                {header}
              </th>
            ))}
          </tr>

        </thead>

        <tbody className="divide-y divide-slate-100">

          {rows.length === 0 ? (

            <tr>

              <td
                colSpan={headers.length}
                className="p-12 text-center text-xs text-slate-400"
              >
                No data available.
              </td>

            </tr>

          ) : (

            rows.map((row, index) => (

              <tr
                key={index}
                className="transition hover:bg-slate-50/80"
              >

                {row.map((cell, cellIndex) => (

                  <td
                    key={cellIndex}
                    className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-800 font-medium"
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
   PRIORITY REASON MODAL
========================================================= */

function PriorityWhyModal({ incident, onClose }) {
  if (!incident) return null;

  const score = Math.round(incident.priority_score || 0);
  const reasons = Array.isArray(incident.priority_reasons) ? incident.priority_reasons : [];
  const needs = incident.needs || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Priority Score Breakdown
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {incident.zone_id?.replace("ZONE-", "Zone ")} · {incident.disaster_type?.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Priority Score Banner */}
        <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-4">
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-blue-700">
              Calculated Priority Score
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-black text-blue-900">{score}</span>
              <span className="font-mono text-xs text-blue-600 font-semibold">/ 100</span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              Severity Level
            </p>
            <SeverityBadge level={incident.severity} />
          </div>
        </div>

        {/* Priority Reasons (Backend data) */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-blue-600" />
            Key Priority Drivers & Components
          </h3>
          {reasons.length > 0 ? (
            <div className="space-y-2">
              {reasons.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="capitalize">{reason}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 italic">
              Score evaluated from severity baseline, victim report count, and population density.
            </div>
          )}
        </div>

        {/* Incident Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">People Affected</p>
            <p className="mt-1 font-mono text-base font-bold text-slate-900">
              {incident.people_affected && Number(incident.people_affected) > 0 ? incident.people_affected : "Not specified"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">Resource Demands</p>
            <p className="mt-1 font-mono text-xs font-semibold text-slate-800 truncate">
              {Object.entries(needs).filter(([, v]) => v > 0).map(([k, v]) => `${k}: ${v}`).join(", ") || "None"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-100 pt-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   DATA PAGES
========================================================= */

function IncidentsPage({ incidents, onWhyPriorityClick, pendingIncidents = [], action }) {
  const activeIncidents = incidents.filter((i) => i.status === "active" || !i.status);
  const ranked = [...activeIncidents].sort(
    (a, b) =>
      (b.priority_score || 0) -
      (a.priority_score || 0)
  );

  return (
    <Page title="Incident Management">
      {pendingIncidents.length > 0 && (
        <PendingReportsPanel
          pendingIncidents={pendingIncidents}
          onActionSuccess={(msg) => action && action(() => Promise.resolve(), msg)}
        />
      )}
      <Table
        headers={[
          "Zone",
          "Disaster",
          "Affected",
          "Severity",
          "Priority Score",
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

          <div key="priority" className="flex items-center gap-3">
            <span className="font-mono font-bold text-slate-900 text-sm">
              {Math.round(incident.priority_score || 0)}
            </span>
            {onWhyPriorityClick && (
              <button
                type="button"
                onClick={() => onWhyPriorityClick(incident)}
                className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition"
              >
                <HelpCircle className="h-3 w-3 text-blue-600" />
                Why this priority?
              </button>
            )}
          </div>,

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

 function ResourcesPage({ resources, action }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    type: "rescue_team",
    quantity: 5,
    agency_id: "AG-001",
    zone_id: "ZONE-A",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      setIsSubmitting(true);
      await api.createResource({
        type: form.type,
        quantity: Number(form.quantity),
        agency_id: form.agency_id,
        zone_id: form.zone_id,
      });
      if (action) {
        await action(() => Promise.resolve(), `Resource ${form.type.replaceAll("_", " ")} (Qty: ${form.quantity}) saved to MongoDB & active inventory!`);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create resource:", err);
      setErrorMessage(err?.message || "Failed to create resource. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Panel
      title="Resource Management"
      subtitle="Operational emergency supplies and response unit inventory"
      action={
        <button
          onClick={() => {
            setErrorMessage("");
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-800 transition"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add Resource</span>
        </button>
      }
    >
      <Table
        headers={[
          "Resource",
          "Type",
          "Available / Total",
          "Agency",
          "Location / Zone",
          "Status",
        ]}
        rows={resources.map((resource) => [
          resource.resource_id,

          resource.type?.replaceAll("_", " "),

          `${resource.available_quantity} / ${resource.quantity}`,

          resource.agency_id,

          resource.zone_id?.replace("ZONE-", "Zone ") || "Zone A",

          <span key={resource.resource_id} className={`inline-flex rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase border ${
            resource.status === "available" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
            "bg-amber-50 text-amber-700 border-amber-200"
          }`}>
            {resource.status}
          </span>,
        ])}
      />

      {/* Add Resource Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                <span>Add Emergency Resource</span>
              </h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resource Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-600 font-medium text-slate-800"
                >
                  <option value="rescue_team">Rescue Team</option>
                  <option value="ambulance">Ambulance</option>
                  <option value="medical_kit">Medical Kit</option>
                  <option value="food_packet">Food Packet</option>
                  <option value="water_bottle">Water Bottle</option>
                  <option value="shelter">Shelter</option>
                  <option value="boat">Rescue Boat</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-600 font-medium text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Managing Agency</label>
                <select
                  value={form.agency_id}
                  onChange={(e) => setForm({ ...form, agency_id: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-600 font-medium text-slate-800"
                >
                  <option value="AG-001">AG-001 · Fire Department</option>
                  <option value="AG-002">AG-002 · Health Department</option>
                  <option value="AG-003">AG-003 · Relief NGO</option>
                  <option value="AG-004">AG-004 · Police Department</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Disaster Zone / Location</label>
                <select
                  value={form.zone_id}
                  onChange={(e) => setForm({ ...form, zone_id: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-600 font-medium text-slate-800"
                >
                  <option value="ZONE-A">Zone A</option>
                  <option value="ZONE-B">Zone B</option>
                  <option value="ZONE-C">Zone C</option>
                  <option value="ZONE-D">Zone D</option>
                  <option value="ZONE-E">Zone E</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-700 px-5 py-2 font-bold text-white hover:bg-blue-800 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Panel>
  );
}

function MissionsPage({ missions = [] }) {
  const formatMissionTime = (ts) => {
    if (!ts) return "—";
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return ts;
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " (" + d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ")";
    } catch {
      return ts;
    }
  };

  const getElapsed = (m) => {
    if (m.status === "completed") {
      return m.completed_at ? `Completed at ${formatMissionTime(m.completed_at)}` : "Completed";
    }
    const ts = m.dispatched_at || m.created_at;
    if (!ts) return "—";
    const start = new Date(ts).getTime();
    if (isNaN(start)) return "—";
    const mins = Math.floor(Math.max(0, Date.now() - start) / 60000);
    if (mins < 1) return "< 1m ago";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m ago`;
  };

  return (
    <Page title="Mission Control & Timings">
      <Table
        headers={[
          "Mission ID",
          "Zone",
          "Agency",
          "Resource Type",
          "Quantity",
          "Status",
          "Dispatched Time",
          "Elapsed / Completion"
        ]}
        rows={missions.map((mission) => [
          mission.mission_id,
          mission.zone_id?.replace("ZONE-", "Zone ") || "—",
          mission.agency_id || "—",
          mission.resource_type?.replaceAll("_", " ") || "—",
          mission.quantity || 0,
          <span key={mission.mission_id} className={`inline-flex rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase border ${
            mission.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
            mission.status === "in_progress" ? "bg-amber-50 text-amber-700 border-amber-200" :
            "bg-blue-50 text-blue-700 border-blue-200"
          }`}>
            {mission.status}
          </span>,
          formatMissionTime(mission.dispatched_at || mission.created_at),
          getElapsed(mission)
        ])}
      />
    </Page>
  );
}

function AgenciesPage({ summary, agencies = [], resources = [], missions = [], audit = [] }) {
  const defaultAgencies = [
    { agency_id: "AG-001", name: "Fire Department", capabilities: ["rescue_team", "boat"], status: "active" },
    { agency_id: "AG-002", name: "Health Department", capabilities: ["ambulance", "medical_kit"], status: "active" },
    { agency_id: "AG-003", name: "Relief NGO", capabilities: ["food_packet", "water_bottle", "shelter"], status: "active" },
    { agency_id: "AG-004", name: "Police Department", capabilities: ["evacuation", "security"], status: "active" },
  ];

  const effectiveAgencies = agencies.length > 0 ? agencies : defaultAgencies;

  return (
    <Page title="Agency Operations & Operational Telemetry">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
        {effectiveAgencies.map((agency) => {
          const aid = agency.agency_id || agency.id;
          const agencyResources = resources.filter(r => r.agency_id === aid);
          const totalQty = agencyResources.reduce((acc, r) => acc + (Number(r.quantity) || 0), 0);
          const availQty = agencyResources.reduce((acc, r) => acc + (Number(r.available_quantity) || 0), 0);
          const allocQty = Math.max(0, totalQty - availQty);
          const workloadPct = totalQty > 0 ? Math.round((allocQty / totalQty) * 100) : 0;

          const agencyMissions = missions.filter(m => m.agency_id === aid);
          const activeMissionsCount = agencyMissions.filter(m => m.status !== "completed").length;

          const activeZonesSet = new Set();
          agencyResources.forEach(r => { if (r.zone_id) activeZonesSet.add(r.zone_id.replace("ZONE-", "Zone ")); });
          agencyMissions.forEach(m => { if (m.zone_id) activeZonesSet.add(m.zone_id.replace("ZONE-", "Zone ")); });
          const responseZones = Array.from(activeZonesSet);

          const agencyType = agency.type || (
            agency.name.includes("Fire") ? "Emergency Response & Rescue" :
            agency.name.includes("Health") ? "Medical & Emergency Healthcare" :
            agency.name.includes("Relief") || agency.name.includes("NGO") ? "Relief & Humanitarian Support" :
            "Public Safety & Evacuation"
          );

          const latestAudit = audit.find(e =>
            e.metadata?.agency_id === aid ||
            (e.description && e.description.includes(aid))
          );
          const lastActivityTime = latestAudit?.timestamp ? new Date(latestAudit.timestamp).toLocaleTimeString() : "Live System Sync";

          return (
            <div
              key={aid}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-2.5 text-blue-700">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {agency.name}
                    </h3>
                    <p className="font-mono text-[9px] font-semibold text-slate-500 mt-0.5">
                      {aid} · {agencyType}
                    </p>
                  </div>
                </div>

                <span className="rounded border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[9px] font-bold text-emerald-700">
                  {agency.status ? agency.status.toUpperCase() : "ONLINE"}
                </span>
              </div>

              {/* Operational Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5">
                  <p className="font-mono text-[8px] font-bold uppercase text-slate-500">Resource Stock</p>
                  <p className="mt-1 font-mono text-base font-black text-slate-900">{totalQty.toLocaleString()}</p>
                  <p className="text-[8px] text-slate-400 mt-0.5">{agencyResources.length} Item Types</p>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5">
                  <p className="font-mono text-[8px] font-bold uppercase text-slate-500">Allocated</p>
                  <p className="mt-1 font-mono text-base font-black text-blue-700">{allocQty.toLocaleString()}</p>
                  <p className="text-[8px] text-slate-400 mt-0.5">{workloadPct}% Workload</p>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5">
                  <p className="font-mono text-[8px] font-bold uppercase text-slate-500">Active Missions</p>
                  <p className="mt-1 font-mono text-base font-black text-amber-600">{activeMissionsCount}</p>
                  <p className="text-[8px] text-slate-400 mt-0.5">{agencyMissions.length} Total</p>
                </div>
              </div>

              {/* Capabilities & Zone Badges */}
              <div className="space-y-2 text-xs">
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Capabilities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(agency.capabilities || []).map(cap => (
                      <span key={cap} className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[9px] font-medium text-slate-700">
                        {cap.replaceAll("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-500">
                  <span>Assigned Zones: <strong className="text-slate-800">{responseZones.length > 0 ? responseZones.join(", ") : "All Zones"}</strong></span>
                  <span className="font-mono text-[9px]">Last Sync: {lastActivityTime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
}


function LiveMapPage({ zones }) {
  return (
    <Page title="Live Disaster Map">

      <div className="h-[calc(100vh-150px)] min-h-[600px] overflow-hidden border border-slate-200 rounded-xl shadow-sm">

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

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
          ResQAI Operations
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
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
  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem("resqai_role") || null;
  });

  const [summary, setSummary] = useState({});
  const [incidents, setIncidents] = useState([]);
  const [resources, setResources] = useState([]);
  const [missions, setMissions] = useState([]);
  const [audit, setAudit] = useState([]);
  const [zones, setZones] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [wsStatus, setWsStatus] = useState("RECONNECTING");
  const [apiReachable, setApiReachable] = useState(true);
  const [selectedWhyIncident, setSelectedWhyIncident] = useState(null);

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    zone_id: "ZONE-A",
    disaster_type: "flood",
    report: "",
  });

  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    if (role === null) {
      sessionStorage.removeItem("resqai_role");
      setUserRole(null);
      navigate("/");
    } else if (role === "responder") {
      sessionStorage.setItem("resqai_role", "responder");
      setUserRole("responder");
      navigate("/");
    } else if (role === "public") {
      sessionStorage.setItem("resqai_role", "public");
      setUserRole("public");
      navigate("/report");
    }
  };

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
        agenciesData,
      ] = await Promise.all([
        api.summary(),
        api.incidents(),
        api.resources(),
        api.missions(),
        api.audit(),
        api.zones(),
        api.agencies(),
      ]);

      setSummary(summaryData || {});
      setIncidents(incidentsData || []);
      setResources(resourcesData || []);
      setMissions(missionsData || []);
      setAudit(auditData || []);
      setZones(zonesData || []);
      setAgencies(agenciesData || []);
      setApiReachable(true);

    } catch (error) {
      console.error("Failed to refresh ResQAI data:", error);
      setApiReachable(false);
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

    const ws = connectSocket(
      (event) => {
        refresh();
      },
      (status) => {
        setWsStatus(status);
      }
    );

    return () => {
      ws?.close();
    };
  }, []);

  const connectionStatus = useMemo(() => {
    if (!apiReachable) return "DISCONNECTED";
    return wsStatus;
  }, [apiReachable, wsStatus]);

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
     RANK INCIDENTS & FILTER PENDING
  ===================================================== */

  const pendingIncidents = useMemo(
    () => incidents.filter((i) => i.status === "pending"),
    [incidents]
  );

  const activeIncidents = useMemo(
    () => incidents.filter((i) => i.status === "active" || !i.status),
    [incidents]
  );

  const ranked = useMemo(
    () =>
      [...activeIncidents].sort(
        (a, b) =>
          (b.priority_score || 0) -
          (a.priority_score || 0)
      ),
    [activeIncidents]
  );

  // If no role is selected, show initial landing screen
  if (!userRole) {
    return (
      <LandingPage
        onSelectRole={(role) => handleRoleSelect(role)}
        onResponderLogin={() => handleRoleSelect("responder")}
      />
    );
  }

  const isPublic = userRole === "public";

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900 selection:bg-blue-100 selection:text-blue-900">

      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        userRole={userRole}
        onSwitchRole={handleRoleSelect}
      />

      <Topbar
        summary={summary}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        userRole={userRole}
        onSwitchRole={handleRoleSelect}
        connectionStatus={connectionStatus}
      />

      {/* Priority Why Modal */}
      {selectedWhyIncident && (
        <PriorityWhyModal
          incident={selectedWhyIncident}
          onClose={() => setSelectedWhyIncident(null)}
        />
      )}

      <main className="lg:ml-64 pt-16 transition-all duration-200">

        <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">

          {/* Toast */}
          {toast && (
            <div className="fixed right-6 top-20 z-[100] max-w-md rounded-xl border border-blue-200 bg-white px-5 py-4 shadow-xl">

              <div className="flex items-start gap-3">

                <Activity className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                <p className="text-xs leading-relaxed font-medium text-slate-800">
                  {toast}
                </p>

              </div>

            </div>
          )}

          <Routes>

            {/* Public Access Only Routes */}
            {isPublic ? (
              <>
                <Route
                  path="/report"
                  element={<VictimReport zones={zones} />}
                />
                <Route
                  path="/partners"
                  element={<ReliefPartners />}
                />
                {/* Fallback all other routes to /report for public role */}
                <Route
                  path="*"
                  element={<Navigate to="/report" replace />}
                />
              </>
            ) : (
              <>
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
                      onWhyPriorityClick={(inc) => setSelectedWhyIncident(inc)}
                      pendingIncidents={pendingIncidents}
                    />
                  }
                />

                <Route
                  path="/report"
                  element={<VictimReport zones={zones} />}
                />

                <Route
                  path="/incidents"
                  element={
                    <IncidentsPage
                      incidents={activeIncidents}
                      pendingIncidents={pendingIncidents}
                      action={action}
                      onWhyPriorityClick={(inc) => setSelectedWhyIncident(inc)}
                    />
                  }
                />

                <Route
                  path="/critical-incident"
                  element={
                    <CriticalIncident
                      zones={zones}
                      pendingIncidents={pendingIncidents}
                      incidents={incidents}
                      action={action}
                    />
                  }
                />

                <Route
                  path="/resources"
                  element={
                    <ResourcesPage
                      resources={resources}
                      action={action}
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
                      agencies={agencies}
                      resources={resources}
                      missions={missions}
                      audit={audit}
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
                    <Analytics
                      incidents={incidents}
                      resources={resources}
                      missions={missions}
                      summary={summary}
                      agencies={agencies}
                    />
                  }
                />


                <Route
                  path="/partners"
                  element={<ReliefPartners />}
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
                  element={<SystemConfig />}
                />

                <Route
                  path="*"
                  element={<Navigate to="/" replace />}
                />
              </>
            )}

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