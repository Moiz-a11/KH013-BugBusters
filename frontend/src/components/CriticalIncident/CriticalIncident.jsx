import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  MapPin,
  Send,
} from "lucide-react";

import Panel from "../common/Panel";
import { api } from "../../api";

export default function CriticalIncidents({ zones = [] }) {
  const [zoneId, setZoneId] = useState("");
  const [report, setReport] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);

    const cleanedReport = report.trim();

    if (!zoneId) {
      setError("Please select an affected zone.");
      return;
    }

    if (!cleanedReport) {
      setError("Please describe the emergency situation.");
      return;
    }

    if (cleanedReport.length < 10) {
      setError("Please provide more details about the emergency.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.createIncident({
        zone_id: zoneId,
        report: cleanedReport,
      });

      setResult(response);

      setZoneId("");
      setReport("");
    } catch (err) {
      console.error("Critical incident submission failed:", err);

      setError(
        err?.message ||
          "Unable to submit the incident. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-white">
              Critical Incidents
            </h1>

            <p className="text-sm text-slate-400">
              Emergency incident intake and priority assessment
            </p>
          </div>
        </div>
      </div>

      {/* EMERGENCY INCIDENT INTAKE */}
      <Panel
        title="Emergency Incident Intake"
        subtitle="Report and assess an urgent emergency situation"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-5"
        >

          {/* ZONE */}
          <div>
            <label
              htmlFor="critical-zone"
              className="flex items-center gap-2 text-sm font-medium text-slate-200"
            >
              <MapPin className="h-4 w-4 text-cyan-400" />
              Affected Zone
            </label>

            <select
              id="critical-zone"
              value={zoneId}
              onChange={(event) => setZoneId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
            >
              <option value="">
                Select affected zone
              </option>

              {zones.map((zone) => {
                const id = zone.zone_id || zone.id;
                const name =
                  zone.name ||
                  zone.zone_name ||
                  id;

                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* REPORT */}
          <div>
            <label
              htmlFor="critical-report"
              className="text-sm font-medium text-slate-200"
            >
              Emergency Report
            </label>

            <textarea
              id="critical-report"
              value={report}
              onChange={(event) =>
                setReport(event.target.value)
              }
              rows={7}
              placeholder="Describe the emergency situation, people affected, immediate dangers, and resources required..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-600">
              <span>
                Provide as much operational detail as possible.
              </span>

              <span>
                {report.length} characters
              </span>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing Incident...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Critical Incident
              </>
            )}
          </button>
        </form>
      </Panel>

      {/* RESULT */}
      {result && (
        <Panel
          title="Incident Received"
          subtitle="Emergency incident has entered the response workflow"
        >
          <div className="p-5">

            <div className="flex items-start gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

              <div>
                <p className="font-semibold text-emerald-300">
                  Incident submitted successfully
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  The incident has been forwarded to the
                  disaster response workflow.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-600">
                  Incident ID
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  {result.incident_id || "Pending"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-600">
                  Severity
                </p>

                <p className="mt-2 text-sm font-semibold uppercase text-white">
                  {result.severity || "Received"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-600">
                  Priority Score
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  {result.priority_score ?? "—"}
                </p>
              </div>

            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}