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
    "text-red-300 bg-red-500/10 border-red-500/30",

  HIGH:
    "text-orange-300 bg-orange-500/10 border-orange-500/30",

  MEDIUM:
    "text-yellow-300 bg-yellow-500/10 border-yellow-500/30",

  LOW:
    "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",

  MONITORING:
    "text-slate-300 bg-slate-500/10 border-slate-500/30",
};

function SeverityBadge({ level }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-md border px-2 py-1
        text-[10px] font-bold uppercase tracking-wider
        ${severityClass[level] || severityClass.MONITORING}
      `}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {level || "MONITORING"}
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
    cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
    red: "border-red-500/20 bg-red-500/10 text-red-400",
    orange:
      "border-orange-500/20 bg-orange-500/10 text-orange-400",
    emerald:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  };

  return (
    <div className="border border-slate-800 bg-[#0b111b] p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-wider text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-[10px] text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`rounded-lg border p-2 ${
              accentClasses[accent]
            }`}
          >
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
        overflow-hidden
        border border-slate-800
        bg-[#0b111b]
        ${className}
      `}
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-white">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-[10px] text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-800 bg-[#080d16]">

      {/* Logo */}
      <div className="border-b border-slate-800 px-5 py-5">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10">
            <ShieldAlert className="h-6 w-6 text-red-500" />
          </div>

          <div>
            <h1 className="text-lg font-black tracking-wider text-white">
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
                group flex items-center gap-3
                rounded-lg px-3 py-2.5
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

              <span>{item.name || item.label}</span>
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

        <div className="border border-emerald-500/20 bg-emerald-500/5 p-3">

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-xs font-semibold text-emerald-400">
              SYSTEM ONLINE
            </span>

          </div>

          <p className="mt-2 text-[10px] text-slate-500">
            Real-time services operational
          </p>

        </div>

      </div>

    </aside>
  );
}

/* =========================================================
   TOPBAR
========================================================= */

function Topbar({ summary }) {
  return (
    <header className="fixed left-64 right-0 top-0 z-40 h-16 border-b border-slate-800 bg-[#0a101a]/95 backdrop-blur">

      <div className="flex h-full items-center justify-between px-6">

        {/* Operational status */}
        <div className="flex items-center gap-5">

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-xs font-bold tracking-wider text-emerald-400">
              LIVE SYSTEM
            </span>

          </div>

          <div className="h-5 w-px bg-slate-800" />

          <div className="hidden items-center gap-2 text-xs text-slate-400 md:flex">

            <Activity className="h-4 w-4 text-cyan-400" />

            Operational Status:

            <span className="font-semibold text-white">
              ACTIVE
            </span>

          </div>

          <div className="hidden items-center gap-2 text-xs text-slate-500 lg:flex">

            <Siren className="h-3.5 w-3.5" />

            {summary?.active_incidents || 0} active incidents

          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Search */}
          <div className="hidden items-center gap-2 border border-slate-800 bg-slate-900/60 px-3 py-2 lg:flex">

            <Search className="h-4 w-4 text-slate-500" />

            <input
              type="text"
              placeholder="Search operations..."
              className="w-44 bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
            />

          </div>

          {/* WebSocket */}
          <div className="flex items-center gap-2 border border-slate-800 px-3 py-2">

            <Wifi className="h-4 w-4 text-emerald-400" />

            <span className="hidden text-[10px] text-slate-400 md:block">
              Connected
            </span>

          </div>

          {/* Notifications */}
          <button className="relative border border-slate-800 p-2 text-slate-400 hover:bg-slate-800 hover:text-white">

            <Bell className="h-4 w-4" />

            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />

          </button>

          {/* Profile */}
          <div className="hidden items-center gap-3 border-l border-slate-800 pl-4 sm:flex">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-bold text-cyan-400">
              OP
            </div>

            <div>

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
  return (
    <Page title="Audit Log">
      <Table
        headers={[
          "Time",
          "Event",
          "Actor",
          "Description",
        ]}
        rows={audit.map((event) => [
          new Date(
            event.timestamp
          ).toLocaleTimeString(),

          event.event_type,

          event.actor,

          event.description,
        ])}
      />
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
    <div className="min-h-screen bg-[#060b12]">

      <Sidebar />

      <Topbar summary={summary} />

      <main className="ml-64 pt-16">

        <div className="min-h-[calc(100vh-4rem)] p-6">

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