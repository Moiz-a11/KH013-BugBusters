import { useState, useMemo, useEffect } from "react";
import {
  AlertOctagon,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  Cpu,
  Eye,
  FileText,
  Info,
  Loader2,
  MapPin,
  Radio,
  RotateCcw,
  Send,
  ShieldAlert,
  Activity,
  Bot,
  ChevronRight,
} from "lucide-react";

import Panel from "../common/Panel";
import SeverityBadge from "../common/SeverityBadge";
import PendingReportsPanel from "../dashboard/PendingReportsPanel";
import { api } from "../../api";

/**
 * Normalize confidence returned by the backend.
 *
 * Supports:
 * 0.9195 -> 92%
 * 91     -> 91%
 * 0.3309 -> 33%
 */
function normalizeConfidence(val) {
  if (val === undefined || val === null) return null;

  const num = typeof val === "string" ? parseFloat(val) : val;

  if (Number.isNaN(num)) return null;

  const percent = num <= 1 ? num * 100 : num;
  const rounded = Math.round(percent);

  let level = "LOW";
  let colorClass = "text-red-600";
  let barColor = "bg-red-500";

  if (rounded >= 90) {
    level = "HIGH";
    colorClass = "text-emerald-600";
    barColor = "bg-emerald-500";
  } else if (rounded >= 70) {
    level = "MODERATE";
    colorClass = "text-amber-600";
    barColor = "bg-amber-500";
  }

  return {
    raw: num,
    percent: rounded,
    exact: percent.toFixed(1),
    level,
    colorClass,
    barColor,
  };
}

const workflowStages = [
  "Incident Received",
  "Needs Assessment",
  "Priority Scoring",
  "Duplicate Detection",
  "Resource Optimization",
  "AI Recommendation",
  "Human Approval",
  "Action",
];

const disasterTypes = [
  { id: "fire", label: "Fire", emoji: "🔥" },
  { id: "flood", label: "Flood", emoji: "🌊" },
  { id: "cyclone", label: "Cyclone / Storm", emoji: "🌪️" },
  { id: "earthquake", label: "Earthquake", emoji: "🏚️" },
  { id: "landslide", label: "Landslide", emoji: "⛰️" },
  { id: "hazmat", label: "Hazardous Material", emoji: "☣️" },
  { id: "medical", label: "Medical Emergency", emoji: "🚑" },
  { id: "infrastructure", label: "Infrastructure Failure", emoji: "⚡" },
  { id: "tsunami", label: "Tsunami", emoji: "🌊" },
  { id: "wildfire", label: "Wildfire", emoji: "🔥" },
  { id: "other", label: "Other", emoji: "❓" },
];

export default function CriticalIncidents({
  zones = [],
  pendingIncidents = [],
  action,
  incidents = [],
}) {
  const effectivePending = useMemo(() => {
    if (Array.isArray(pendingIncidents) && pendingIncidents.length > 0) {
      return pendingIncidents;
    }
    if (Array.isArray(incidents)) {
      return incidents.filter((i) => i.status === "pending");
    }
    return [];
  }, [pendingIncidents, incidents]);

  const [zoneId, setZoneId] = useState("");
  const [report, setReport] = useState("");
  const [disasterType, setDisasterType] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [result, setResult] = useState(null);
  const [mlData, setMlData] = useState(null);

  const [activeStage, setActiveStage] = useState(-1);

  const [approvalStatus, setApprovalStatus] = useState("pending");
  const [isApproving, setIsApproving] = useState(false);
  const [approvalResult, setApprovalResult] = useState(null);
  const [showReviewDetails, setShowReviewDetails] = useState(false);

  const selectedZone = useMemo(() => {
    if (!zoneId) return null;

    return (
      zones.find(
        (z) => (z.zone_id || z.id) === zoneId
      ) || null
    );
  }, [zoneId, zones]);

  /*
   * Visual workflow progression.
   * The actual backend workflow remains unchanged.
   */
  useEffect(() => {
    if (!result) {
      setActiveStage(-1);
      return;
    }

    let stage = 0;

    setActiveStage(0);

    const interval = setInterval(() => {
      stage += 1;

      if (stage <= 6) {
        setActiveStage(stage);
      } else {
        clearInterval(interval);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [result]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);
    setMlData(null);
    setApprovalStatus("pending");
    setApprovalResult(null);
    setShowReviewDetails(false);
    setActiveStage(-1);

    const cleanedReport = report.trim();

    if (!zoneId) {
      setError(
        "Please select an affected disaster zone before submitting the incident."
      );
      return;
    }

    if (!cleanedReport) {
      setError(
        "Please describe the emergency situation before submitting the incident."
      );
      return;
    }

    if (cleanedReport.length < 10) {
      setError(
        "Report must contain at least 10 characters for needs assessment."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const [incidentRes, mlRes] = await Promise.all([
        api.createIncident({
          zone_id: zoneId,
          report: cleanedReport,
          ...(disasterType && disasterType !== "other"
            ? { disaster_type: disasterType }
            : {}),
        }),

        api.predictNeed(cleanedReport).catch((err) => {
          console.warn("ML predictNeed fallback warning:", err);
          return null;
        }),
      ]);

      setResult(incidentRes);
      setMlData(mlRes);

      setZoneId("");
      setReport("");
      setDisasterType("");
    } catch (err) {
      console.error("Critical incident submission failed:", err);

      setError(
        err?.message ||
          "Emergency dispatch communication error. Please verify the backend connection and retry."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!result) return;

    setIsApproving(true);
    setError("");

    try {
      let optResult;
      if (result.incident_id) {
        optResult = await api.approveIncident(result.incident_id);
      } else {
        optResult = await api.optimize();
      }

      setApprovalResult(optResult);
      setApprovalStatus("approved");
      setActiveStage(7);
    } catch (err) {
      console.error("Failed to approve allocation:", err);

      setError(
        "Failed to execute mission dispatch: " +
          (err?.message || "Server error")
      );
    } finally {
      setIsApproving(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setMlData(null);
    setApprovalStatus("pending");
    setApprovalResult(null);
    setShowReviewDetails(false);
    setActiveStage(-1);
    setError("");
  };

  const charCount = report.length;
  const isMinMet = charCount >= 10;

  const conf = useMemo(
    () => normalizeConfidence(mlData?.confidence),
    [mlData]
  );

  // Preserved from existing implementation.
  const modelName = "LogisticRegression";

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <section
        className="
          overflow-hidden rounded-2xl
          border border-slate-200
          bg-white
          shadow-[0_2px_8px_rgba(15,23,42,0.05)]
        "
      >
        <div className="h-1 bg-red-500" />

        <div className="flex flex-col justify-between gap-5 p-5 md:flex-row md:items-center">

          <div className="flex items-start gap-4">

            <div
              className="
                relative flex h-12 w-12 shrink-0
                items-center justify-center
                rounded-xl
                border border-red-200
                bg-red-50
                text-red-600
              "
            >
              <ShieldAlert className="h-6 w-6" />

              <span
                className="
                  absolute -right-1 -top-1
                  h-2.5 w-2.5
                  rounded-full bg-red-500
                  ring-2 ring-white
                "
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="
                    text-[9px] font-bold uppercase
                    tracking-[0.18em]
                    text-red-600
                  "
                >
                  Disaster Relief Protocol
                </span>

                <span
                  className="
                    rounded-full border border-red-200
                    bg-red-50 px-2 py-0.5
                    text-[8px] font-bold
                    uppercase tracking-wide
                    text-red-700
                  "
                >
                  Priority Level 1
                </span>
              </div>

              <h1 className="mt-1 text-xl font-bold tracking-tight text-[#0F2744] sm:text-2xl">
                Critical Incident Management
              </h1>

              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">
                Real-time incident intake, ML needs assessment, priority
                scoring, duplicate detection and Human-in-the-Loop response
                coordination.
              </p>
            </div>
          </div>

          <div
            className="
              flex shrink-0 items-center gap-2
              rounded-xl
              border border-emerald-200
              bg-emerald-50
              px-3.5 py-2.5
            "
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                Intake Online
              </p>

              <p className="mt-0.5 text-[9px] text-emerald-600">
                Agentic Pipeline Ready
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Pending Public Reports Panel for EOC Responder Review */}
      {effectivePending && effectivePending.length > 0 && (
        <PendingReportsPanel
          pendingIncidents={effectivePending}
          onActionSuccess={(msg) => action && action(() => Promise.resolve(), msg)}
        />
      )}

      {/* =====================================================
          AGENTIC WORKFLOW
      ====================================================== */}
      {result && (
        <section
          className="
            overflow-hidden rounded-2xl
            border border-blue-200
            bg-white
            shadow-[0_3px_12px_rgba(15,23,42,0.06)]
            animate-fadeIn
          "
        >
          {/* Workflow header */}
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Cpu className="h-4 w-4" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F2744]">
                    Agentic Decision Workflow
                  </h2>

                  <span
                    className={`
                      rounded-full border px-2 py-0.5
                      text-[8px] font-bold uppercase tracking-wide
                      ${
                        approvalStatus === "approved"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }
                    `}
                  >
                    {approvalStatus === "approved"
                      ? "Action Executed"
                      : "Awaiting Human Approval"}
                  </span>
                </div>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Incident {result.incident_id} · Zone {result.zone_id}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="
                inline-flex items-center gap-1.5
                self-start rounded-lg
                border border-slate-200
                bg-white px-3 py-1.5
                text-[9px] font-semibold
                text-slate-500
                transition
                hover:bg-slate-50
                hover:text-slate-800
                lg:self-auto
              "
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>


          {/* Horizontal workflow */}
          <div className="overflow-x-auto px-5 py-6">
            <div className="flex min-w-[1120px] items-start">

              {workflowStages.map((stage, index) => {
                const isAction = index === 7;

                const completed =
                  index < 6 ||
                  (index === 6 && approvalStatus === "approved") ||
                  (index === 7 && approvalStatus === "approved");

                const running =
                  !completed &&
                  !isAction &&
                  activeStage === index;

                const awaitingApproval =
                  index === 6 &&
                  activeStage >= 6 &&
                  approvalStatus === "pending";

                return (
                  <div
                    key={stage}
                    className="flex flex-1 items-start"
                  >

                    {/* Node */}
                    <div className="flex min-w-[112px] flex-1 flex-col items-center">

                      <div
                        className={`
                          relative flex h-9 w-9
                          items-center justify-center
                          rounded-full border-2
                          ${
                            completed
                              ? "border-emerald-500 bg-emerald-50"
                              : awaitingApproval
                              ? "border-amber-500 bg-amber-50 shadow-[0_0_0_4px_rgba(245,158,11,0.08)]"
                              : running
                              ? "border-blue-500 bg-blue-50 shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                              : "border-slate-200 bg-slate-50"
                          }
                        `}
                      >
                        {completed ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : running ? (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        ) : awaitingApproval ? (
                          <Clock className="h-4 w-4 text-amber-600" />
                        ) : (
                          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                        )}
                      </div>

                      <p
                        className={`
                          mt-2.5 text-center
                          text-[9px] font-bold
                          leading-tight
                          ${
                            completed
                              ? "text-slate-700"
                              : awaitingApproval
                              ? "text-amber-700"
                              : running
                              ? "text-blue-700"
                              : "text-slate-400"
                          }
                        `}
                      >
                        {stage}
                      </p>

                      <span
                        className={`
                          mt-1 text-[7px] font-bold
                          uppercase tracking-wider
                          ${
                            completed
                              ? "text-emerald-600"
                              : awaitingApproval
                              ? "text-amber-600"
                              : running
                              ? "text-blue-600"
                              : "text-slate-300"
                          }
                        `}
                      >
                        {completed
                          ? "Completed"
                          : awaitingApproval
                          ? "Awaiting"
                          : running
                          ? "Running"
                          : "Pending"}
                      </span>
                    </div>

                    {/* Connector */}
                    {index < workflowStages.length - 1 && (
                      <div className="flex w-7 shrink-0 items-center pt-[18px]">
                        <div
                          className={`
                            h-[2px] w-full
                            ${
                              completed
                                ? "bg-emerald-300"
                                : activeStage > index
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


          {/* Stage details */}
          <div className="grid border-t border-slate-100 bg-slate-50/60 sm:grid-cols-2 lg:grid-cols-4">

            <div className="border-b border-slate-100 p-4 lg:border-b-0 lg:border-r">
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                Incident
              </p>

              <p className="mt-1 text-xs font-bold text-[#0F2744]">
                {result.incident_id}
              </p>

              <p className="mt-0.5 text-[9px] text-slate-500">
                Zone {result.zone_id}
              </p>
            </div>

            <div className="border-b border-slate-100 p-4 lg:border-b-0 lg:border-r">
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                Needs Assessment
              </p>

              <p className="mt-1 text-xs font-bold text-[#0F2744]">
                {modelName}
              </p>

              <p className="mt-0.5 text-[9px] text-slate-500">
                Model confidence{" "}
                <strong className={conf?.colorClass || "text-slate-600"}>
                  {conf ? `${conf.percent}%` : "Evaluating"}
                </strong>
              </p>
            </div>

            <div className="border-b border-slate-100 p-4 sm:border-r lg:border-b-0">
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                Priority Decision
              </p>

              <div className="mt-1 flex items-center gap-2">
                <SeverityBadge severity={result.severity} />

                <span className="text-xs font-bold text-[#0F2744]">
                  {Math.round(result.priority_score || 0)}/100
                </span>
              </div>
            </div>

            <div className="p-4">
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                Duplicate Detection
              </p>

              <p
                className={`
                  mt-1 text-xs font-bold
                  ${
                    result.duplicate_check?.detected
                      ? "text-amber-700"
                      : "text-emerald-700"
                  }
                `}
              >
                {result.duplicate_check?.detected
                  ? "Potential overlap detected"
                  : "No overlap detected"}
              </p>
            </div>

          </div>
        </section>
      )}


      {/* =====================================================
          AI RECOMMENDATION
      ====================================================== */}
      {result && (
        <section
          className="
            overflow-hidden rounded-2xl
            border border-blue-200
            bg-white
            shadow-[0_2px_10px_rgba(15,23,42,0.05)]
            animate-fadeIn
          "
        >
          <div className="h-1 bg-blue-600" />

          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                <Bot className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-[#0F2744]">
                  AI Response Recommendation
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Synthesized response proposition for Zone {result.zone_id}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] text-slate-500">
                Priority:
                <strong className="ml-1 text-red-600">
                  {result.severity} ·{" "}
                  {Math.round(result.priority_score || 0)}
                </strong>
              </span>

              <span className="hidden h-4 w-px bg-slate-200 sm:block" />

              <span className="text-[10px] text-slate-500">
                Model Confidence:
                <strong
                  className={`ml-1 ${
                    conf?.level === "HIGH"
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {conf ? `${conf.percent}%` : "Evaluated"}
                </strong>
              </span>
            </div>
          </div>


          {/* Proposed action */}
          <div className="p-5">

            <div
              className="
                rounded-xl
                border border-blue-100
                bg-blue-50/60
                p-4
              "
            >
              <div className="flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-blue-600" />

                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700">
                  Proposed Operational Action
                </span>
              </div>

              <p className="mt-2 text-sm font-semibold leading-relaxed text-[#0F2744]">
                Deploy emergency relief assets and coordinate multi-agency
                mission dispatch to Sector {result.zone_id}.
              </p>
            </div>


            {/* Decision telemetry */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">

              {/* ML */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">

                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                    Needs Assessment
                  </span>

                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                </div>

                <p className="mt-2 text-xs font-bold text-[#0F2744]">
                  {modelName}
                </p>

                <div className="mt-3 border-t border-slate-100 pt-3">

                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                      Model Confidence
                    </span>

                    <span
                      className={`text-[10px] font-bold ${
                        conf?.level === "HIGH"
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      {conf ? `${conf.percent}%` : "Evaluated"}
                    </span>
                  </div>

                  {conf && (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${conf.barColor}`}
                        style={{
                          width: `${conf.percent}%`,
                        }}
                      />
                    </div>
                  )}

                  <p className="mt-1.5 text-[8px] text-slate-400">
                    Actual score returned by trained ML predictor
                  </p>
                </div>
              </div>


              {/* Priority */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">

                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Priority & Severity
                </span>

                <div className="mt-2 flex items-center gap-2">
                  <SeverityBadge severity={result.severity} />

                  <span className="text-sm font-bold text-[#0F2744]">
                    {Math.round(result.priority_score || 0)}
                  </span>
                </div>

                <p className="mt-3 text-[9px] leading-relaxed text-slate-500">
                  Priority score generated by the incident decision pipeline.
                </p>
              </div>


              {/* Resources */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">

                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Recommended Allocations
                </span>

                <div className="mt-2 flex flex-wrap gap-1.5">

                  {result.needs?.rescue_team > 0 && (
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-semibold text-slate-600">
                      Rescue: {result.needs.rescue_team}
                    </span>
                  )}

                  {result.needs?.ambulance > 0 && (
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-semibold text-slate-600">
                      Ambulances: {result.needs.ambulance}
                    </span>
                  )}

                  {result.needs?.water_bottle > 0 && (
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-semibold text-slate-600">
                      Water: {result.needs.water_bottle}
                    </span>
                  )}

                  {result.needs?.food_packet > 0 && (
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-semibold text-slate-600">
                      Food: {result.needs.food_packet}
                    </span>
                  )}

                  {result.needs?.medical_kit > 0 && (
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-semibold text-slate-600">
                      Medical: {result.needs.medical_kit}
                    </span>
                  )}

                </div>
              </div>

            </div>


            {/* Why */}
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">

              <div className="flex items-center gap-2">
                <Info className="h-3.5 w-3.5 text-blue-600" />

                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  Decision Rationale
                </span>
              </div>

              <ul className="mt-3 space-y-2">

                <li className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-600">
                  <span className="font-bold text-blue-600">1.</span>
                  <span>
                    {result.people_affected && Number(result.people_affected) > 0 ? (
                      <>
                        <strong className="text-slate-800">
                          {result.people_affected} people affected
                        </strong>{" "}
                        in Sector {result.zone_id}.
                      </>
                    ) : (
                      <strong className="text-slate-800">
                        Population impact: Not specified in report
                      </strong>
                    )}
                  </span>
                </li>

                <li className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-600">
                  <span className="font-bold text-blue-600">2.</span>
                  <span>
                    <strong className="text-slate-800">
                      {result.severity} severity
                    </strong>{" "}
                    rating computed with a priority score of{" "}
                    <strong className="text-slate-800">
                      {Math.round(result.priority_score || 0)}/100
                    </strong>
                    .
                  </span>
                </li>

                <li className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-600">
                  <span className="font-bold text-blue-600">3.</span>
                  <span>
                    Critical situation factors:{" "}
                    <strong className="text-slate-800">
                      {result.priority_reasons?.join(", ") ||
                        "Immediate life safety concern"}
                    </strong>
                    .
                  </span>
                </li>

                {conf && (
                  <li className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-600">
                    <span className="font-bold text-blue-600">4.</span>

                    <span>
                      Trained ML model{" "}
                      <strong className="text-slate-800">
                        {modelName}
                      </strong>{" "}
                      identified the primary resource deficit as{" "}
                      <strong className="text-blue-700">
                        {mlData?.need || "EMERGENCY AID"}
                      </strong>{" "}
                      with{" "}
                      <strong
                        className={
                          conf.level === "HIGH"
                            ? "text-emerald-700"
                            : "text-amber-700"
                        }
                      >
                        {conf.percent}% model confidence
                      </strong>
                      .
                    </span>
                  </li>
                )}

              </ul>
            </div>


            {/* =================================================
                HUMAN APPROVAL
            ================================================== */}
            {approvalStatus === "pending" && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 p-4">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex items-start gap-3">

                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <Clock className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        Awaiting Operator Approval
                      </p>

                      <p className="mt-1 max-w-xl text-[10px] leading-relaxed text-amber-700/80">
                        Human verification is required before the optimization
                        and mission dispatch action is executed.
                      </p>
                    </div>

                  </div>

                  <div className="flex w-full gap-2 lg:w-auto">

                    <button
                      type="button"
                      onClick={() =>
                        setShowReviewDetails(!showReviewDetails)
                      }
                      className="
                        flex flex-1 items-center
                        justify-center gap-2
                        rounded-lg
                        border border-slate-200
                        bg-white
                        px-4 py-2.5
                        text-[10px] font-bold
                        text-slate-600
                        shadow-sm
                        transition
                        hover:bg-slate-50
                        lg:flex-none
                      "
                    >
                      <Eye className="h-3.5 w-3.5" />

                      {showReviewDetails
                        ? "Hide Review"
                        : "Review Decision"}
                    </button>

                    <button
                      type="button"
                      disabled={isApproving}
                      onClick={handleApprove}
                      className="
                        flex flex-1 items-center
                        justify-center gap-2
                        rounded-lg
                        bg-[#0F2744]
                        px-5 py-2.5
                        text-[10px] font-bold
                        uppercase tracking-wide
                        text-white
                        shadow-sm
                        transition
                        hover:bg-[#17395f]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        lg:flex-none
                      "
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Optimizing...
                        </>
                      ) : (
                        <>
                          <CheckCheck className="h-4 w-4" />
                          Approve Response
                        </>
                      )}
                    </button>

                  </div>
                </div>


                {/* Review details */}
                {showReviewDetails && (
                  <div
                    className="
                      mt-4
                      rounded-lg
                      border border-amber-200
                      bg-white
                      p-4
                      animate-fadeIn
                    "
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      Operational Review Details
                    </p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">

                      <p className="text-[10px] text-slate-600">
                        Incident:
                        <strong className="ml-1 text-slate-800">
                          {result.incident_id}
                        </strong>
                      </p>

                      <p className="text-[10px] text-slate-600">
                        Zone:
                        <strong className="ml-1 text-slate-800">
                          {result.zone_id}
                        </strong>
                      </p>

                      <p className="text-[10px] text-slate-600">
                        Trained Classifier:
                        <strong className="ml-1 text-slate-800">
                          {modelName}
                        </strong>
                      </p>

                      <p className="text-[10px] text-slate-600">
                        Model Confidence:
                        <strong className="ml-1 text-slate-800">
                          {conf
                            ? `${conf.percent}%`
                            : "N/A"}
                        </strong>
                      </p>

                      <p className="text-[10px] text-slate-600">
                        Optimizer:
                        <strong className="ml-1 text-slate-800">
                          Google OR-Tools
                        </strong>
                      </p>

                      <p className="text-[10px] text-slate-600">
                        Duplicate Status:
                        <strong className="ml-1 text-slate-800">
                          {result.duplicate_check?.detected
                            ? "Overlap detected"
                            : "Unique incident"}
                        </strong>
                      </p>

                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </section>
      )}


      {/* =====================================================
          POST APPROVAL
      ====================================================== */}
      {approvalStatus === "approved" && (
        <section
          className="
            overflow-hidden rounded-2xl
            border border-emerald-200
            bg-white
            shadow-[0_2px_10px_rgba(15,23,42,0.05)]
            animate-fadeIn
          "
        >
          <div className="h-1 bg-emerald-500" />

          <div className="p-5">

            <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-700">
                  Action Executed — Missions Dispatched
                </h3>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Google OR-Tools optimization completed and response resources
                  allocated.
                </p>
              </div>

            </div>


            <div className="mt-4 grid gap-3 sm:grid-cols-2">

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Missions Created & Dispatched
                </p>

                <p className="mt-1 text-xl font-bold text-[#0F2744]">
                  {approvalResult?.missions
                    ? approvalResult.missions.length
                    : "Missions Created"}
                </p>

                <p className="mt-1 text-[9px] text-slate-500">
                  Field coordination missions generated by the optimization
                  workflow.
                </p>
              </div>


              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Resource Allocations
                </p>

                <p className="mt-1 text-xl font-bold text-[#0F2744]">
                  {approvalResult?.allocations
                    ? approvalResult.allocations.length
                    : "Resources Allocated"}
                </p>

                <p className="mt-1 text-[9px] text-slate-500">
                  Resources allocated through the response optimization
                  process.
                </p>
              </div>

            </div>


            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

              <span className="flex items-center gap-2 text-[9px] font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Response action completed successfully.
              </span>

              <button
                type="button"
                onClick={handleReset}
                className="
                  inline-flex items-center
                  justify-center gap-2
                  rounded-lg
                  border border-slate-200
                  bg-white
                  px-3 py-2
                  text-[9px] font-bold
                  text-slate-600
                  transition
                  hover:bg-slate-50
                "
              >
                <RotateCcw className="h-3 w-3" />
                Intake Another Incident
              </button>

            </div>

          </div>
        </section>
      )}


      {/* =====================================================
          INTAKE FORM
      ====================================================== */}
      {!result && (
        <Panel
          title="Emergency Incident Intake"
          subtitle="Submit an urgent incident for ML assessment and multi-agent response coordination."
          variant="emergency"
          badge="EOC INTAKE"
          action={
            <div className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2 py-1">
              <Radio className="h-3 w-3 animate-pulse text-red-500" />

              <span className="text-[8px] font-bold uppercase tracking-wider text-red-700">
                Priority Direct
              </span>
            </div>
          }
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-5 sm:p-6"
          >

            {/* =================================================
                ZONE
            ================================================== */}
            <div>

              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">

                <label
                  htmlFor="critical-zone"
                  className="
                    flex items-center gap-2
                    text-[10px] font-bold
                    uppercase tracking-wider
                    text-slate-700
                  "
                >
                  <MapPin className="h-3.5 w-3.5 text-blue-600" />

                  Affected Disaster Zone

                  <span className="text-red-500">*</span>
                </label>

                <span className="text-[9px] text-slate-400">
                  {zones.length} active sectors monitored
                </span>

              </div>

              <p className="mt-1 text-[10px] text-slate-500">
                Select the geographical sector requiring immediate response.
              </p>

              <div className="relative mt-2.5">

                <select
                  id="critical-zone"
                  value={zoneId}
                  onChange={(event) => setZoneId(event.target.value)}
                  className="
                    w-full appearance-none
                    rounded-lg
                    border border-slate-200
                    bg-white
                    px-4 py-3
                    text-xs text-slate-800
                    outline-none
                    transition
                    hover:border-slate-300
                    focus:border-blue-400
                    focus:ring-2
                    focus:ring-blue-50
                  "
                >
                  <option value="">
                    -- Select Target Disaster Zone --
                  </option>

                  {zones.map((zone) => {
                    const id = zone.zone_id || zone.id;
                    const name =
                      zone.name || zone.zone_name || id;

                    const severityText = zone.severity
                      ? `[${zone.severity}]`
                      : "";

                    const priorityText = zone.priority_score
                      ? `• Priority ${Math.round(zone.priority_score)}`
                      : "";

                    return (
                      <option key={id} value={id}>
                        {name} ({id}) {severityText} {priorityText}
                      </option>
                    );
                  })}
                </select>

                <ChevronRight
                  className="
                    pointer-events-none
                    absolute right-4 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    rotate-90
                    text-slate-400
                  "
                />

              </div>


              {/* Selected zone telemetry */}
              {selectedZone && (
                <div
                  className="
                    mt-3
                    overflow-hidden
                    rounded-xl
                    border border-blue-100
                    bg-blue-50/50
                    animate-fadeIn
                  "
                >
                  <div className="flex items-center justify-between border-b border-blue-100 px-4 py-2.5">

                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-blue-600" />

                      <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700">
                        Sector Intelligence
                      </span>
                    </div>

                    <span className="font-mono text-[8px] text-blue-600">
                      ID: {selectedZone.zone_id || selectedZone.id}
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-px bg-blue-100 sm:grid-cols-4">

                    <div className="bg-white p-3">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        Sector
                      </p>

                      <p className="mt-1 truncate text-[10px] font-semibold text-slate-700">
                        {selectedZone.name ||
                          selectedZone.zone_id}
                      </p>
                    </div>

                    <div className="bg-white p-3">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        Status
                      </p>

                      <div className="mt-1">
                        <SeverityBadge
                          severity={
                            selectedZone.severity ||
                            "MONITORING"
                          }
                        />
                      </div>
                    </div>

                    <div className="bg-white p-3">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        Priority
                      </p>

                      <p className="mt-1 text-xs font-bold text-blue-700">
                        {selectedZone.priority_score
                          ? Math.round(
                              selectedZone.priority_score
                            )
                          : "Baseline"}
                      </p>
                    </div>

                    <div className="bg-white p-3">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        Coordinates
                      </p>

                      <p className="mt-1 truncate font-mono text-[9px] text-slate-600">
                        {selectedZone.latitude
                          ? `${selectedZone.latitude.toFixed(
                              3
                            )}°, ${selectedZone.longitude.toFixed(
                              3
                            )}°`
                          : "Telemetry Active"}
                      </p>
                    </div>

                  </div>
                </div>
              )}

            </div>


            {/* =================================================
                REPORT
            ================================================== */}
            <div>

              <div className="flex items-center justify-between gap-3">

                <label
                  htmlFor="critical-report"
                  className="
                    flex items-center gap-2
                    text-[10px] font-bold
                    uppercase tracking-wider
                    text-slate-700
                  "
                >
                  <FileText className="h-3.5 w-3.5 text-red-500" />

                  Emergency Situation Report

                  <span className="text-red-500">*</span>
                </label>

                <span
                  className={`
                    text-[9px] font-semibold
                    ${isMinMet ? "text-emerald-600" : "text-slate-400"}
                  `}
                >
                  {charCount} / 10 minimum
                </span>

              </div>

              <p className="mt-1 text-[10px] text-slate-500">
                Provide field observations for ML needs assessment and
                resource calculation.
              </p>


              {/* Classification */}
              <div className="mt-4">

                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Emergency Classification
                  </span>

                  <span className="text-[8px] text-slate-400">
                    Optional
                  </span>
                </div>

                <div className="overflow-x-auto pb-1">
                  <div className="flex min-w-max gap-1.5">

                    {disasterTypes.map(
                      ({ id, label, emoji }) => {
                        const isActive =
                          disasterType === id;

                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() =>
                              setDisasterType(
                                isActive ? "" : id
                              )
                            }
                            className={`
                              flex items-center gap-1.5
                              rounded-full
                              border
                              px-2.5 py-1.5
                              text-[9px] font-semibold
                              transition
                              ${
                                isActive
                                  ? "border-blue-300 bg-blue-50 text-blue-700"
                                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                              }
                            `}
                          >
                            <span>{emoji}</span>

                            <span>{label}</span>

                            {isActive && (
                              <Check className="h-3 w-3" />
                            )}
                          </button>
                        );
                      }
                    )}

                  </div>
                </div>

                {disasterType &&
                  disasterType !== "other" && (
                    <p className="mt-2 text-[9px] text-blue-600">
                      Classification{" "}
                      <strong>
                        {disasterType.toUpperCase()}
                      </strong>{" "}
                      will be passed to the incident pipeline.
                    </p>
                  )}

              </div>


              <textarea
                id="critical-report"
                value={report}
                onChange={(event) =>
                  setReport(event.target.value)
                }
                rows={6}
                placeholder="Example: 500 residents urgently need clean drinking water. Flooding has contaminated the sector reservoir and 20 people require immediate medical evacuation..."
                className="
                  mt-3 w-full resize-y
                  rounded-xl
                  border border-slate-200
                  bg-white
                  p-4
                  text-xs leading-relaxed
                  text-slate-800
                  outline-none
                  placeholder:text-slate-400
                  transition
                  hover:border-slate-300
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-50
                "
              />

              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <span className="flex items-center gap-1.5 text-[9px] text-slate-400">
                  <Info className="h-3 w-3" />
                  Trained ML model evaluates the report for resource needs.
                </span>

                <span
                  className={`
                    text-[9px] font-semibold
                    ${
                      isMinMet
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }
                  `}
                >
                  {isMinMet
                    ? "✓ Minimum detail met"
                    : "Awaiting sufficient detail"}
                </span>

              </div>

            </div>


            {/* =================================================
                ERROR
            ================================================== */}
            {error && (
              <div
                className="
                  flex items-start gap-3
                  rounded-xl
                  border border-red-200
                  bg-red-50
                  p-4
                  animate-fadeIn
                "
              >
                <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-red-700">
                    Submission Rejected
                  </p>

                  <p className="mt-1 text-[10px] leading-relaxed text-red-600">
                    {error}
                  </p>
                </div>
              </div>
            )}


            {/* =================================================
                SUBMIT
            ================================================== */}
            <div className="border-t border-slate-100 pt-5 flex justify-end">

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  group flex h-[46px] w-[340px]
                  items-center justify-center
                  gap-2.5
                  rounded-xl
                  bg-red-600
                  px-6
                  text-[10px] font-bold
                  uppercase tracking-wider
                  text-white
                  shadow-sm
                  transition
                  hover:bg-red-700
                  hover:shadow-md
                  active:scale-[0.995]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Executing Intake & ML Inference...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Critical Incident To EOC Pipeline
                  </>
                )}
              </button>

            </div>

          </form>
        </Panel>
      )}

    </div>
  );
}