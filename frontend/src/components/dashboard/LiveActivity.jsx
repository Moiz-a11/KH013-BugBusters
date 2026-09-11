import Panel from "../common/Panel";

const activities = [
  {
    time: "14:31:12",
    type: "MISSION",
    text: "Fire Department dispatched to Zone B",
  },
  {
    time: "14:31:10",
    type: "OPTIMIZATION",
    text: "2 rescue teams reallocated",
  },
  {
    time: "14:31:07",
    type: "PRIORITY",
    text: "Zone B priority increased to 98",
  },
  {
    time: "14:31:05",
    type: "AI ANALYSIS",
    text: "Needs assessment completed",
  },
  {
    time: "14:31:02",
    type: "INCIDENT",
    text: "New Zone B report received",
  },
];

export default function LiveActivity() {
  return (
    <Panel
      title="Live Activity"
      subtitle="Real-time operational events"
    >

      <div className="divide-y divide-slate-800">

        {activities.map((activity) => (

          <div
            key={`${activity.time}-${activity.type}`}
            className="flex gap-4 px-5 py-4"
          >

            <span className="font-mono text-[10px] text-slate-600">
              {activity.time}
            </span>

            <div>

              <p className="text-[9px] font-bold tracking-wider text-cyan-400">
                {activity.type}
              </p>

              <p className="mt-1 text-xs text-slate-300">
                {activity.text}
              </p>

            </div>

          </div>

        ))}

      </div>

    </Panel>
  );
}