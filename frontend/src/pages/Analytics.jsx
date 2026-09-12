import React, { useMemo } from "react";
import {
  BarChart3,
  ShieldAlert,
  Siren,
  Package,
  Truck,
  Building2,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  PieChart,
} from "lucide-react";

/* KPI Card Helper */
function KPICard({ title, value, subtitle, icon: Icon, accent = "cyan" }) {
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
      border: "border-amber-200 hover:border-amber-300",
      line: "bg-amber-500",
      iconBg: "border-amber-200 bg-amber-50 text-amber-700",
      num: "text-slate-900",
    },
    emerald: {
      border: "border-emerald-200 hover:border-emerald-300",
      line: "bg-emerald-500",
      iconBg: "border-emerald-200 bg-emerald-50 text-emerald-700",
      num: "text-slate-900",
    },
  };

  const current = accentClasses[accent] || accentClasses.cyan;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${current.border} bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className={`absolute left-0 top-0 h-[2px] w-full ${current.line}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
            {title}
          </p>
          <p className={`mt-1.5 font-mono text-3xl font-black tracking-tight ${current.num}`}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`rounded-xl border p-3 ${current.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Analytics({
  incidents = [],
  resources = [],
  missions = [],
  summary = {},
}) {
  /* Metrics Computation */
  const metrics = useMemo(() => {
    const totalIncidents = incidents.length;

    const critical = incidents.filter(
      (i) => String(i.severity).toUpperCase() === "CRITICAL"
    ).length;
    const high = incidents.filter(
      (i) => String(i.severity).toUpperCase() === "HIGH"
    ).length;
    const medium = incidents.filter(
      (i) => String(i.severity).toUpperCase() === "MEDIUM"
    ).length;
    const low = incidents.filter(
      (i) => String(i.severity).toUpperCase() === "LOW"
    ).length;

    const totalResources = resources.reduce(
      (acc, r) => acc + (Number(r.quantity) || 0),
      0
    );
    const availableResources = resources.reduce(
      (acc, r) => acc + (Number(r.available_quantity) || 0),
      0
    );
    const allocatedResources = Math.max(0, totalResources - availableResources);

    /* Resource allocation by type */
    const resourceByType = {};
    resources.forEach((r) => {
      const type = r.type || "OTHER";
      if (!resourceByType[type]) {
        resourceByType[type] = { total: 0, available: 0, allocated: 0 };
      }
      resourceByType[type].total += Number(r.quantity) || 0;
      resourceByType[type].available += Number(r.available_quantity) || 0;
      resourceByType[type].allocated += Math.max(
        0,
        (Number(r.quantity) || 0) - (Number(r.available_quantity) || 0)
      );
    });

    /* Mission Statuses */
    const totalMissions = missions.length;
    const dispatchedMissions = missions.filter(
      (m) => String(m.status).toLowerCase() === "dispatched"
    ).length;
    const inProgressMissions = missions.filter(
      (m) => String(m.status).toLowerCase() === "in_progress"
    ).length;
    const completedMissions = missions.filter(
      (m) => String(m.status).toLowerCase() === "completed"
    ).length;

    /* Zone Priority Averages */
    const zoneScores = {};
    incidents.forEach((i) => {
      const zone = i.zone_id ? i.zone_id.replace("ZONE-", "Zone ") : "Unknown";
      if (!zoneScores[zone]) {
        zoneScores[zone] = { totalScore: 0, count: 0, criticalCount: 0 };
      }
      zoneScores[zone].totalScore += Number(i.priority_score) || 0;
      zoneScores[zone].count += 1;
      if (String(i.severity).toUpperCase() === "CRITICAL") {
        zoneScores[zone].criticalCount += 1;
      }
    });

    return {
      totalIncidents,
      critical,
      high,
      medium,
      low,
      totalResources,
      availableResources,
      allocatedResources,
      resourceByType,
      totalMissions,
      dispatchedMissions,
      inProgressMissions,
      completedMissions,
      zoneScores,
    };
  }, [incidents, resources, missions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
          Operational Intelligence & Performance Analytics
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Analytics Dashboard
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Real-time statistical synthesis of disaster severity, OR-Tools resource allocation, mission dispatch, and priority trends
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard
          title="Total Incidents Tracked"
          value={metrics.totalIncidents}
          subtitle={`${metrics.critical} Critical · ${metrics.high} High`}
          icon={Siren}
          accent="red"
        />
        <KPICard
          title="Active Missions"
          value={metrics.totalMissions}
          subtitle={`${metrics.dispatchedMissions} Dispatched · ${metrics.inProgressMissions} In-Progress`}
          icon={Truck}
          accent="orange"
        />
        <KPICard
          title="Allocated Units"
          value={metrics.allocatedResources}
          subtitle={`Out of ${metrics.totalResources} total inventory units`}
          icon={Package}
          accent="cyan"
        />
        <KPICard
          title="Available Inventory"
          value={metrics.availableResources}
          subtitle={`${Math.round(
            metrics.totalResources > 0
              ? (metrics.availableResources / metrics.totalResources) * 100
              : 0
          )}% reserve ready`}
          icon={Building2}
          accent="emerald"
        />
      </div>

      {/* Main Charts Grid 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Severity Distribution Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <PieChart className="h-4 w-4 text-blue-600" />
                Severity Breakdown & Distribution
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Proportion of active emergency incidents by severity grade
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
              {metrics.totalIncidents} Total
            </span>
          </div>

          <div className="space-y-4">
            {[
              { label: "CRITICAL", count: metrics.critical, color: "bg-red-600", text: "text-red-700", border: "border-red-200 bg-red-50" },
              { label: "HIGH", count: metrics.high, color: "bg-amber-500", text: "text-amber-700", border: "border-amber-200 bg-amber-50" },
              { label: "MEDIUM", count: metrics.medium, color: "bg-yellow-500", text: "text-yellow-800", border: "border-yellow-200 bg-yellow-50" },
              { label: "LOW", count: metrics.low, color: "bg-blue-600", text: "text-blue-700", border: "border-blue-200 bg-blue-50" },
            ].map((item) => {
              const pct =
                metrics.totalIncidents > 0
                  ? Math.round((item.count / metrics.totalIncidents) * 100)
                  : 0;

              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[9px] font-bold ${item.border} ${item.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${item.color}`} />
                      {item.label}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {item.count} <span className="text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission Status Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-600" />
                Mission Execution Status
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Current deployment phase of emergency response units
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
              {metrics.totalMissions} Active Missions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-center">
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
              <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-blue-700">Dispatched</p>
              <p className="mt-1 font-mono text-2xl font-black text-blue-900">{metrics.dispatchedMissions}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-amber-700">In Progress</p>
              <p className="mt-1 font-mono text-2xl font-black text-amber-900">{metrics.inProgressMissions}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
              <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-700">Completed</p>
              <p className="mt-1 font-mono text-2xl font-black text-emerald-900">{metrics.completedMissions}</p>
            </div>
          </div>

          {metrics.totalMissions === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No active missions dispatched yet. Run OR-Tools optimization to dispatch resources.
            </div>
          ) : (
            <div className="space-y-3">
              {missions.slice(0, 4).map((m) => (
                <div key={m.mission_id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-2.5 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 font-mono">{m.mission_id}</span>
                    <span className="text-slate-500 ml-2">({m.zone_id?.replace("ZONE-", "Zone ")})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded font-semibold">
                      {m.resource_type?.replace("_", " ")} ({m.quantity})
                    </span>
                    <span className="rounded bg-blue-100 text-blue-800 text-[9px] font-bold uppercase px-2 py-0.5">
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Charts Grid 2: Resource Allocation by Type & Zone Trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Resource Allocation by Type Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Package className="h-4 w-4 text-indigo-600" />
                Resource Allocation by Inventory Type
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Total available versus allocated emergency supply units
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.keys(metrics.resourceByType).length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No resource inventory records found.
              </div>
            ) : (
              Object.entries(metrics.resourceByType).map(([type, data]) => {
                const allocPct =
                  data.total > 0 ? Math.round((data.allocated / data.total) * 100) : 0;

                return (
                  <div key={type} className="rounded-lg border border-slate-100 bg-slate-50/60 p-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900 uppercase font-mono">
                        {type.replaceAll("_", " ")}
                      </span>
                      <span className="font-mono text-xs text-slate-600">
                        <span className="font-bold text-blue-700">{data.allocated} allocated</span> / {data.total} total
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                        style={{ width: `${allocPct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Zone Priority & Severity Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                Zone Priority Trends & Critical Concentration
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Average calculated priority score per operational disaster zone
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {Object.keys(metrics.zoneScores).length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active zone data available. Seed scenario to populate zone analytics.
              </div>
            ) : (
              Object.entries(metrics.zoneScores).map(([zone, info]) => {
                const avgScore = info.count > 0 ? Math.round(info.totalScore / info.count) : 0;

                return (
                  <div key={zone} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">{zone}</span>
                        {info.criticalCount > 0 && (
                          <span className="rounded bg-red-100 border border-red-200 text-red-700 text-[8px] font-bold uppercase px-1.5 py-0.5">
                            {info.criticalCount} Critical
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {info.count} incident report{info.count !== 1 ? "s" : ""} logged
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono text-base font-black text-slate-900">{avgScore}</p>
                      <p className="text-[8px] uppercase tracking-wider text-slate-400 font-mono">Avg Priority</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
