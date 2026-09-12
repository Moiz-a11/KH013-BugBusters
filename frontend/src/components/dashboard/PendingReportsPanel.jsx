import React, { useState } from "react";
import { Clock, CheckCircle2, XCircle, AlertCircle, ShieldAlert, Loader2, MapPin } from "lucide-react";
import { api } from "../../api";

export default function PendingReportsPanel({ pendingIncidents = [], onActionSuccess }) {
  const [busyId, setBusyId] = useState(null);

  const safePending = Array.isArray(pendingIncidents) ? pendingIncidents : [];

  if (!safePending || safePending.length === 0) {
    return null;
  }

  const handleApprove = async (id) => {
    try {
      setBusyId(id);
      await api.approveIncident(id);
      if (onActionSuccess) onActionSuccess(`Approved report ${id}. AI workflow & OR-Tools allocation activated.`);
    } catch (err) {
      console.error("Failed to approve incident:", err);
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setBusyId(id);
      await api.rejectIncident(id);
      if (onActionSuccess) onActionSuccess(`Rejected report ${id}.`);
    } catch (err) {
      console.error("Failed to reject incident:", err);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-xl border border-amber-300 bg-amber-50/50 shadow-sm animate-in fade-in">
      <div className="flex items-center justify-between border-b border-amber-200/80 bg-amber-100/70 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-600" />
          </span>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-2">
              <span>New Incoming Reports</span>
              <span className="rounded bg-amber-200 border border-amber-300 px-2 py-0.5 font-mono text-[9px] text-amber-900">
                {safePending.length} Awaiting EOC Review
              </span>
            </h2>
          </div>
        </div>

        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-amber-800">
          Responder Action Required
        </span>
      </div>

      <div className="divide-y divide-amber-200/60 bg-white">
        {safePending.map((item) => {
          const isBusy = busyId === item.incident_id;

          return (
            <div key={item.incident_id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-amber-50/30 transition">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-slate-900 text-xs bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                    {item.incident_id}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded uppercase">
                    <Clock className="h-3 w-3 text-amber-700" />
                    Awaiting EOC Review
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-blue-600" />
                    {item.zone_id?.replace("ZONE-", "Zone ")}
                  </span>
                </div>

                <p className="mt-2 text-xs font-medium text-slate-800 leading-relaxed bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                  "{item.report}"
                </p>

                <p className="mt-1 font-mono text-[9px] text-slate-400">
                  Received: {item.created_at ? new Date(item.created_at).toLocaleTimeString() : "Just now"}
                </p>
              </div>

              {/* Responder Decision Buttons */}
              <div className="flex items-center gap-2 shrink-0 sm:self-center">
                <button
                  type="button"
                  onClick={() => handleApprove(item.incident_id)}
                  disabled={isBusy}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm transition disabled:opacity-50"
                >
                  {isBusy ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  <span>Approve Help</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleReject(item.incident_id)}
                  disabled={isBusy}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition disabled:opacity-50"
                >
                  {isBusy ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  <span>Reject</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
