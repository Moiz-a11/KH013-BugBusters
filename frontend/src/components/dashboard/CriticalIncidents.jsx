import Panel from "../common/Panel";
import SeverityBadge from "../common/SeverityBadge";

const incidents = [
  {
    zone: "Zone B",
    type: "Flood",
    severity: "critical",
    priority: 98,
    affected: 720,
    time: "2m ago",
    status: "Response active",
  },
  {
    zone: "Zone C",
    type: "Flood",
    severity: "high",
    priority: 86,
    affected: 510,
    time: "8m ago",
    status: "Teams dispatched",
  },
  {
    zone: "Zone A",
    type: "Cyclone",
    severity: "critical",
    priority: 94,
    affected: 860,
    time: "12m ago",
    status: "Evacuation",
  },
  {
    zone: "Zone E",
    type: "Flood",
    severity: "medium",
    priority: 61,
    affected: 300,
    time: "21m ago",
    status: "Monitoring",
  },
];

export default function CriticalIncidents() {
  return (
    <Panel
      title="Critical Incidents"
      subtitle="Priority-ranked emergency situations"
    >

      <div className="divide-y divide-slate-800">

        {incidents.map((incident) => (

          <div
            key={incident.zone}
            className="group cursor-pointer px-5 py-4 hover:bg-slate-900/60"
          >

            <div className="flex items-start justify-between gap-4">

              <div>

                <div className="flex items-center gap-3">

                  <span className="text-sm font-semibold text-white">
                    {incident.zone}
                  </span>

                  <SeverityBadge severity={incident.severity} />

                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {incident.type} · {incident.affected} people affected
                </p>

              </div>

              <div className="text-right">

                <p className="text-lg font-bold text-white">
                  {incident.priority}
                </p>

                <p className="text-[9px] uppercase tracking-wider text-slate-600">
                  Priority
                </p>

              </div>

            </div>

            <div className="mt-3 flex items-center justify-between">

              <span className="text-[10px] text-slate-500">
                {incident.status}
              </span>

              <span className="text-[10px] text-slate-600">
                {incident.time}
              </span>

            </div>

          </div>

        ))}

      </div>

    </Panel>
  );
}