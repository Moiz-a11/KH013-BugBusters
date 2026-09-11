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

const typeStyles = {
  MISSION: {
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  OPTIMIZATION: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  PRIORITY: {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  "AI ANALYSIS": {
    dot: "bg-violet-500",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
  },
  INCIDENT: {
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function LiveActivity() {
  return (
    <Panel
      title="Live Activity"
      subtitle="Real-time operational events"
    >
      <div className="divide-y divide-slate-100">

        {activities.map((activity, index) => {
          const style =
            typeStyles[activity.type] || {
              dot: "bg-slate-400",
              badge: "bg-slate-50 text-slate-600 border-slate-200",
            };

          return (
            <div
              key={`${activity.time}-${activity.type}`}
              className="
                group flex gap-3.5
                px-5 py-3.5
                transition-colors duration-200
                hover:bg-slate-50/70
              "
            >
              {/* Timeline */}
              <div className="flex w-16 shrink-0 flex-col items-end">
                <span className="font-mono text-[9px] font-medium text-slate-400">
                  {activity.time}
                </span>

                {index !== activities.length - 1 && (
                  <div className="mt-2 h-full w-px bg-slate-100" />
                )}
              </div>

              {/* Event marker */}
              <div className="relative flex shrink-0 justify-center">
                <span
                  className={`
                    mt-1.5 h-2 w-2 rounded-full
                    ring-4 ring-white
                    ${style.dot}
                  `}
                />
              </div>

              {/* Event content */}
              <div className="min-w-0 flex-1 pb-0.5">

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`
                      rounded-md border
                      px-1.5 py-0.5
                      text-[8px] font-bold
                      tracking-wider
                      ${style.badge}
                    `}
                  >
                    {activity.type}
                  </span>
                </div>

                <p
                  className="
                    mt-1.5
                    text-[11px] font-medium
                    leading-relaxed
                    text-slate-700
                    transition-colors
                    group-hover:text-slate-900
                  "
                >
                  {activity.text}
                </p>

              </div>
            </div>
          );
        })}

      </div>
    </Panel>
  );
}