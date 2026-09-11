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

export default function ActiveMissions() {
  return (
    <Panel
      title="Active Missions"
      subtitle="Current emergency response operations"
    >

      <div className="divide-y divide-slate-800">

        {missions.map((mission) => (

          <div
            key={mission.id}
            className="px-5 py-4"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold text-white">
                  MISSION {mission.id}
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  {mission.agency} · {mission.zone}
                </p>

              </div>

              <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[9px] font-bold text-cyan-400">
                {mission.status}
              </span>

            </div>

            <p className="mt-3 text-xs text-slate-400">
              {mission.resources}
            </p>

            <div className="mt-3 flex gap-1">

              {[1, 2, 3, 4, 5].map((step) => (

                <div
                  key={step}
                  className={`h-1 flex-1 ${
                    step <= 3
                      ? "bg-cyan-500"
                      : "bg-slate-800"
                  }`}
                />

              ))}

            </div>

          </div>

        ))}

      </div>

    </Panel>
  );
}