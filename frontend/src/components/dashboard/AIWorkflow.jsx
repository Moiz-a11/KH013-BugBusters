import Panel from "../common/Panel";

const steps = [
  "REPORT RECEIVED",
  "REPORT AGENT",
  "NEEDS ASSESSMENT",
  "PRIORITY AGENT",
  "DUPLICATE DETECTION",
  "ALLOCATION AGENT",
  "OR-TOOLS",
  "COORDINATION AGENT",
  "MISSION DISPATCH",
];

export default function AIWorkflow() {
  return (
    <Panel
      title="AI Operations Pipeline"
      subtitle="Agentic emergency decision workflow"
    >

      <div className="overflow-x-auto p-5">

        <div className="flex min-w-max items-center gap-2">

          {steps.map((step, index) => (

            <div key={step} className="flex items-center gap-2">

              <div
                className={`
                  border px-3 py-2
                  ${
                    index === 5
                      ? "border-cyan-400/40 bg-cyan-500/10"
                      : "border-slate-800 bg-slate-900"
                  }
                `}
              >

                <p
                  className={`text-[9px] font-bold tracking-wider ${
                    index === 5
                      ? "text-cyan-400"
                      : "text-slate-400"
                  }`}
                >
                  {step}
                </p>

                <p className="mt-1 text-[8px] text-slate-600">
                  {index === 5
                    ? "PROCESSING"
                    : index < 5
                    ? "COMPLETED"
                    : "READY"}
                </p>

              </div>

              {index < steps.length - 1 && (
                <span className="text-slate-700">
                  →
                </span>
              )}

            </div>

          ))}

        </div>

      </div>

    </Panel>
  );
}