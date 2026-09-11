import Panel from "../common/Panel";

const resources = [
  {
    name: "Food",
    available: 82,
    value: "4,820",
  },
  {
    name: "Water",
    available: 71,
    value: "8,240",
  },
  {
    name: "Medical Kits",
    available: 64,
    value: "2,140",
  },
  {
    name: "Rescue Teams",
    available: 88,
    value: "44",
  },
  {
    name: "Ambulances",
    available: 56,
    value: "18",
  },
  {
    name: "Rescue Boats",
    available: 73,
    value: "27",
  },
];

function getAvailabilityStyle(percentage) {
  if (percentage >= 80) {
    return {
      bar: "bg-emerald-500",
      text: "text-emerald-700",
      label: "READY",
    };
  }

  if (percentage >= 65) {
    return {
      bar: "bg-blue-500",
      text: "text-blue-700",
      label: "AVAILABLE",
    };
  }

  return {
    bar: "bg-amber-500",
    text: "text-amber-700",
    label: "LIMITED",
  };
}

export default function ResourceReadiness() {
  return (
    <Panel
      title="Resource Readiness"
      subtitle="Current operational availability"
    >
      <div className="divide-y divide-slate-100">

        {resources.map((resource) => {
          const style = getAvailabilityStyle(resource.available);

          return (
            <div
              key={resource.name}
              className="
                px-5 py-4
                transition-colors duration-200
                hover:bg-slate-50/70
              "
            >
              {/* Resource information */}
              <div className="flex items-center justify-between gap-4">

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        h-2 w-2 shrink-0 rounded-full
                        ${style.bar}
                      `}
                    />

                    <span className="truncate text-xs font-semibold text-slate-800">
                      {resource.name}
                    </span>
                  </div>

                  <span
                    className={`
                      ml-4 text-[9px] font-bold
                      uppercase tracking-wider
                      ${style.text}
                    `}
                  >
                    {style.label}
                  </span>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold tracking-tight text-[#0F2744]">
                    {resource.value}
                  </p>

                  <p className="text-[9px] text-slate-400">
                    available units
                  </p>
                </div>
              </div>

              {/* Availability bar */}
              <div className="mt-3 flex items-center gap-3">

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`
                      h-full rounded-full
                      transition-all duration-500
                      ${style.bar}
                    `}
                    style={{
                      width: `${resource.available}%`,
                    }}
                  />
                </div>

                <span
                  className={`
                    w-10 text-right
                    text-[10px] font-bold
                    ${style.text}
                  `}
                >
                  {resource.available}%
                </span>
              </div>
            </div>
          );
        })}

      </div>
    </Panel>
  );
}