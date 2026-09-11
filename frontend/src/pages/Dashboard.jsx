import KPIBar from "../components/dashboard/KPIBar";
import CriticalIncidents from "../components/dashboard/CriticalIncidents";
import ResourceReadiness from "../components/dashboard/ResourceReadiness";
import ActiveMissions from "../components/dashboard/ActiveMissions";
import LiveActivity from "../components/dashboard/LiveActivity";
import AIWorkflow from "../components/dashboard/AIWorkflow";

export default function Dashboard() {
  return (
    <div className="space-y-6">

      {/* =====================================================
          COMMAND HEADER
      ====================================================== */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">

        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Emergency Operations Center
            </p>
          </div>

          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#0F2744]">
            Operational Command
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Real-time disaster response intelligence and coordination
          </p>
        </div>

        <button
          type="button"
          className="
            inline-flex items-center justify-center
            rounded-lg
            border border-red-200
            bg-red-50
            px-4 py-2.5
            text-[10px] font-bold
            uppercase tracking-wide
            text-red-700
            shadow-[0_1px_2px_rgba(15,23,42,0.03)]
            transition-all duration-200
            hover:border-red-300
            hover:bg-red-100
            hover:shadow-sm
            active:scale-[0.99]
          "
        >
          <span className="mr-2 text-sm">🚨</span>
          Trigger Emergency Simulation
        </button>

      </div>


      {/* =====================================================
          SITUATION SUMMARY
      ====================================================== */}
      <section>
        <KPIBar />
      </section>


      {/* =====================================================
          PRIMARY OPERATIONAL VIEW
      ====================================================== */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(340px,0.9fr)]">

        {/* -----------------------------------------------------
            OPERATIONAL MAP
        ------------------------------------------------------ */}
        <section
          className="
            overflow-hidden
            rounded-2xl
            border border-slate-200
            bg-white
            shadow-[0_2px_8px_rgba(15,23,42,0.05)]
          "
        >

          {/* Map header */}
          <div
            className="
              flex flex-col gap-3
              border-b border-slate-100
              px-5 py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600" />

                <h2 className="text-sm font-bold text-[#0F2744]">
                  Operational Map
                </h2>
              </div>

              <p className="mt-1 pl-4 text-[10px] text-slate-500">
                Live disaster zone intelligence
              </p>
            </div>

            {/* Map filters */}
            <div className="flex items-center gap-1.5">

              <button
                type="button"
                className="
                  rounded-md
                  border border-blue-200
                  bg-blue-50
                  px-3 py-1.5
                  text-[9px] font-bold
                  tracking-wide
                  text-blue-700
                "
              >
                ZONES
              </button>

              <button
                type="button"
                className="
                  rounded-md
                  border border-slate-200
                  bg-white
                  px-3 py-1.5
                  text-[9px] font-semibold
                  tracking-wide
                  text-slate-500
                  transition-colors
                  hover:bg-slate-50
                  hover:text-slate-700
                "
              >
                AGENCIES
              </button>

              <button
                type="button"
                className="
                  rounded-md
                  border border-slate-200
                  bg-white
                  px-3 py-1.5
                  text-[9px] font-semibold
                  tracking-wide
                  text-slate-500
                  transition-colors
                  hover:bg-slate-50
                  hover:text-slate-700
                "
              >
                MISSIONS
              </button>

            </div>
          </div>


          {/* Map area */}
          <div
            className="
              relative
              flex min-h-[480px]
              items-center justify-center
              overflow-hidden
              bg-slate-50
            "
          >

            {/* Subtle map grid */}
            <div
              className="
                pointer-events-none
                absolute inset-0
                opacity-50
              "
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                  linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                `,
                backgroundSize: "42px 42px",
              }}
            />

            {/* Map-style radial reference */}
            <div
              className="
                absolute
                h-[340px] w-[340px]
                rounded-full
                border border-blue-100
              "
            />

            <div
              className="
                absolute
                h-[250px] w-[250px]
                rounded-full
                border border-blue-100
              "
            />

            <div
              className="
                absolute
                h-[160px] w-[160px]
                rounded-full
                border border-blue-100
              "
            />

            {/* Simulated zone markers */}
            <div className="absolute left-[22%] top-[30%]">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-30" />
                <span className="relative h-3 w-3 rounded-full bg-red-500 ring-4 ring-red-100" />
              </span>
            </div>

            <div className="absolute right-[25%] top-[38%]">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-20" />
                <span className="relative h-3 w-3 rounded-full bg-orange-500 ring-4 ring-orange-100" />
              </span>
            </div>

            <div className="absolute left-[42%] bottom-[25%]">
              <span className="h-3 w-3 rounded-full bg-amber-500 ring-4 ring-amber-100" />
            </div>

            {/* Center information */}
            <div className="relative z-10 rounded-xl border border-white bg-white/90 px-7 py-5 text-center shadow-lg backdrop-blur-sm">

              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <span className="text-lg">⌖</span>
              </div>

              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0F2744]">
                Live GIS
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                React-Leaflet operational map
              </p>

            </div>

            {/* Map legend */}
            <div
              className="
                absolute bottom-4 left-4
                flex items-center gap-4
                rounded-lg
                border border-slate-200
                bg-white/95
                px-3 py-2
                shadow-sm
                backdrop-blur
              "
            >
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-[8px] font-semibold text-slate-500">
                  CRITICAL
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-[8px] font-semibold text-slate-500">
                  HIGH
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-[8px] font-semibold text-slate-500">
                  MEDIUM
                </span>
              </div>
            </div>

          </div>
        </section>


        {/* -----------------------------------------------------
            CRITICAL INCIDENTS
        ------------------------------------------------------ */}
        <CriticalIncidents />

      </div>


      {/* =====================================================
          OPERATIONAL INTELLIGENCE
      ====================================================== */}
      <div className="grid gap-5 xl:grid-cols-3">

        <ResourceReadiness />

        <ActiveMissions />

        <LiveActivity />

      </div>


      {/* =====================================================
          AGENTIC AI PIPELINE
      ====================================================== */}
      <AIWorkflow />

    </div>
  );
}