import React from "react";
import Panel from "../components/common/Panel";

export default function AuditLog({ audit = [] }) {
  const events = Array.isArray(audit) ? audit : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
          ResQAI Operations
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Audit Log
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Complete record of emergency operational decisions, human approvals, and AI workflow events
        </p>
      </div>

      <Panel
        title="System Audit Trail"
        subtitle="Chronological log of system actions and EOC review decisions"
      >
        <div className="divide-y divide-slate-100">
          {events.map((event, index) => (
            <div
              key={event.id || index}
              className="flex items-start gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors"
            >
              <span className="whitespace-nowrap font-mono text-xs text-slate-400">
                {event.timestamp
                  ? new Date(event.timestamp).toLocaleTimeString()
                  : "Live Event"}
              </span>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-blue-700 border border-blue-200">
                    {event.event_type || "EVENT"}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No audit log entries recorded yet. Operational events will appear here in real time.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
