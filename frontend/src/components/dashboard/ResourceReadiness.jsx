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

export default function ResourceReadiness() {
  return (
    <Panel
      title="Resource Readiness"
      subtitle="Current operational availability"
    >

      <div className="space-y-5 p-5">

        {resources.map((resource) => (

          <div key={resource.name}>

            <div className="mb-2 flex items-center justify-between">

              <span className="text-xs font-medium text-slate-300">
                {resource.name}
              </span>

              <span className="text-xs text-slate-400">
                {resource.value}
              </span>

            </div>

            <div className="h-1.5 overflow-hidden bg-slate-800">

              <div
                className="h-full bg-cyan-500"
                style={{
                  width: `${resource.available}%`,
                }}
              />

            </div>

            <div className="mt-1 text-right text-[9px] text-slate-600">
              {resource.available}% available
            </div>

          </div>

        ))}

      </div>

    </Panel>
  );
}