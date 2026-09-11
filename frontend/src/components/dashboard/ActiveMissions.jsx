import Panel from "../common/Panel";

const missions = [
  {
    id: "#1024",
    agency: "Fire Department",
    zone: "Zone D",
    resources: "Rescue Team × 2",
    status: "DISPATCHED",
  },
  {
    id: "#1025",
    agency: "Medical Response",
    zone: "Zone B",
    resources: "Ambulance × 3",
    status: "ON ROUTE",
  },
  {
    id: "#1026",
    agency: "NDRF",
    zone: "Zone C",
    resources: "Boat × 2",
    status: "IN PROGRESS",
  },
];

const statusStyles = {
  DISPATCHED: {
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
    progress: 2,
  },
  "ON ROUTE": {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    progress: 3,
  },
  "IN PROGRESS": {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    progress: 4,
  },
};

export default function ActiveMissions() {
  return (
    <Panel
      title="Active Missions"
      subtitle="Current emergency response operations"
    >
      <div className="divide-y divide-slate-100">

        {missions.map((mission) => {
          const style =
            statusStyles[mission.status] || statusStyles.DISPATCHED;

          return (
            <div
              key={mission.id}
              className="
                px-5 py-4
                transition-colors duration-200
                hover:bg-slate-50/70
              "
            >
              {/* Mission Header */}
              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        h-2 w-2 shrink-0 rounded-full
                        ${style.dot}
                      `}
                    />

                    <p className="text-xs font-bold tracking-tight text-slate-900">
                      MISSION {mission.id}
                    </p>
                  </div>

                  <p className="mt-1.5 pl-4 text-[10px] font-medium text-slate-500">
                    {mission.agency}
                    <span className="mx-1.5 text-slate-300">•</span>
                    {mission.zone}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`
                    shrink-0 rounded-md border
                    px-2 py-1
                    text-[9px] font-bold
                    tracking-wide
                    ${style.badge}
                  `}
                >
                  {mission.status}
                </span>
              </div>

              {/* Resources */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Resources
                </span>

                <span className="text-xs font-semibold text-slate-700">
                  {mission.resources}
                </span>
              </div>

              {/* Mission Progress */}
              <div className="mt-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`
                        h-1 flex-1 rounded-full
                        transition-colors duration-300
                        ${
                          step <= style.progress
                            ? "bg-blue-600"
                            : "bg-slate-100"
                        }
                      `}
                    />
                  ))}
                </div>

                <div className="mt-1.5 flex justify-between">
                  <span className="text-[9px] text-slate-400">
                    Deployment
                  </span>

                  <span className="text-[9px] font-medium text-slate-400">
                    {style.progress}/5
                  </span>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </Panel>
  );
}