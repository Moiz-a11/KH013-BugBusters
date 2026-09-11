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
      <div className="overflow-x-auto px-5 py-6">
        <div className="flex min-w-max items-start">

          {steps.map((step, index) => {
            const isProcessing = index === 5;
            const isCompleted = index < 5;
            const isReady = index > 5;

            return (
              <div
                key={step}
                className="flex items-start"
              >
                {/* Workflow node */}
                <div className="flex w-[122px] flex-col items-center">

                  {/* Node */}
                  <div
                    className={`
                      relative flex h-10 w-10
                      items-center justify-center
                      rounded-full border-2
                      ${
                        isProcessing
                          ? "border-blue-500 bg-blue-50 shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                          : isCompleted
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 bg-slate-50"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <span className="text-sm font-bold text-emerald-600">
                        ✓
                      </span>
                    ) : isProcessing ? (
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-40" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-600" />
                      </span>
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    )}

                    {/* Processing label */}
                    {isProcessing && (
                      <span
                        className="
                          absolute -top-2
                          rounded-full
                          bg-blue-600
                          px-1.5 py-0.5
                          text-[7px] font-bold
                          tracking-wider text-white
                        "
                      >
                        LIVE
                      </span>
                    )}
                  </div>

                  {/* Step title */}
                  <p
                    className={`
                      mt-3 text-center
                      text-[9px] font-bold
                      leading-tight tracking-wide
                      ${
                        isProcessing
                          ? "text-blue-700"
                          : isCompleted
                          ? "text-slate-700"
                          : "text-slate-400"
                      }
                    `}
                  >
                    {step}
                  </p>

                  {/* Step state */}
                  <span
                    className={`
                      mt-1 text-[8px]
                      font-semibold uppercase
                      tracking-wider
                      ${
                        isProcessing
                          ? "text-blue-500"
                          : isCompleted
                          ? "text-emerald-600"
                          : "text-slate-300"
                      }
                    `}
                  >
                    {isProcessing
                      ? "Processing"
                      : isCompleted
                      ? "Completed"
                      : "Ready"}
                  </span>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="flex w-7 items-center pt-5">
                    <div
                      className={`
                        h-[2px] w-full
                        ${
                          index < 5
                            ? "bg-emerald-300"
                            : index === 5
                            ? "bg-blue-300"
                            : "bg-slate-200"
                        }
                      `}
                    />
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>
    </Panel>
  );
}