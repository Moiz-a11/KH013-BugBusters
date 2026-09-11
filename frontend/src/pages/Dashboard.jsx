import KPIBar from "../components/dashboard/KPIBar";
import CriticalIncidents from "../components/dashboard/CriticalIncidents";
import ResourceReadiness from "../components/dashboard/ResourceReadiness";
import ActiveMissions from "../components/dashboard/ActiveMissions";
import LiveActivity from "../components/dashboard/LiveActivity";
import AIWorkflow from "../components/dashboard/AIWorkflow";

export default function Dashboard() {
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

        <button className="border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/20">
          🚨 TRIGGER EMERGENCY SIMULATION
        </button>

      </div>

      {/* KPIs */}
      <KPIBar />

      {/* Main */}
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">

        {/* Map placeholder */}
        <div className="min-h-[480px] border border-slate-800 bg-[#0b111b]">

          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

            <div>

              <h2 className="text-sm font-semibold text-white">
                Operational Map
              </h2>

              <p className="mt-1 text-[10px] text-slate-500">
                Live disaster zone intelligence
              </p>

            </div>

            <div className="flex gap-2">

              <button className="border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[9px] font-bold text-cyan-400">
                ZONES
              </button>

              <button className="border border-slate-800 px-3 py-1.5 text-[9px] text-slate-500">
                AGENCIES
              </button>

              <button className="border border-slate-800 px-3 py-1.5 text-[9px] text-slate-500">
                MISSIONS
              </button>

            </div>

          </div>

          <div className="relative flex h-[420px] items-center justify-center bg-[#08111b]">

            <div className="absolute h-64 w-64 rounded-full border border-cyan-500/10" />
            <div className="absolute h-44 w-44 rounded-full border border-cyan-500/10" />
            <div className="absolute h-24 w-24 rounded-full border border-cyan-500/10" />

            <div className="text-center">

              <p className="text-xs font-bold tracking-widest text-cyan-400">
                LIVE GIS
              </p>

              <p className="mt-2 text-[10px] text-slate-600">
                React-Leaflet operational map
              </p>

            </div>

          </div>

        </div>

        {/* Critical */}
        <CriticalIncidents />

      </div>

      {/* Operational panels */}
      <div className="grid gap-6 xl:grid-cols-3">

        <ResourceReadiness />

        <ActiveMissions />

        <LiveActivity />

      </div>

      {/* AI */}
      <AIWorkflow />

    </div>
  );
}