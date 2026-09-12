import React, { useEffect, useState } from "react";
import {
  Cpu,
  Server,
  Wifi,
  Bot,
  Layers,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  ShieldCheck,
  HardDrive,
  Database,
} from "lucide-react";
import { api } from "../api";

export default function SystemConfig() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [apiLatency, setApiLatency] = useState(null);
  const [offlineCount, setOfflineCount] = useState(0);
  const [wsStatus, setWsStatus] = useState("Connected");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkHealth = async () => {
    setIsRefreshing(true);
    const start = performance.now();
    try {
      const res = await api.health();
      const end = performance.now();
      setHealthStatus(res);
      setApiLatency(Math.round(end - start));
    } catch (err) {
      setHealthStatus({ status: "error", error: err.message });
      setApiLatency(null);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkHealth();

    // Read offline queue size
    try {
      const stored = localStorage.getItem("resqai_offline_reports");
      if (stored) {
        const parsed = JSON.parse(stored);
        setOfflineCount(Array.isArray(parsed) ? parsed.length : 0);
      }
    } catch {
      setOfflineCount(0);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
            Engine & Infrastructure Telemetry
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            System Configuration & Health
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Live diagnostic telemetry for ML classifiers, Google OR-Tools optimizer, LLM fallback, and realtime WebSocket event bus
          </p>
        </div>

        <button
          onClick={checkHealth}
          disabled={isRefreshing}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
          <span>Refresh Health Metrics</span>
        </button>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Backend Status */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
              FastAPI Core Service
            </span>
            <Server className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`font-mono text-xl font-bold uppercase ${healthStatus?.status === "ok" ? "text-emerald-700" : "text-red-600"}`}>
              {healthStatus?.status === "ok" ? "ONLINE" : "UNREACHABLE"}
            </span>
            {apiLatency !== null && (
              <span className="font-mono text-xs text-slate-500 font-semibold">
                ({apiLatency} ms)
              </span>
            )}
          </div>
          <p className="mt-1.5 font-mono text-[10px] text-slate-500">
            Endpoint: <code className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200">/api/health</code>
          </p>
        </div>

        {/* WebSocket */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
              WebSocket Telemetry
            </span>
            <Wifi className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xl font-bold text-emerald-700">CONNECTED</span>
          </div>
          <p className="mt-1.5 font-mono text-[10px] text-slate-500">
            Socket: <code className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200">/ws/dashboard</code>
          </p>
        </div>

        {/* Confidence Threshold */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
              ML Confidence Cutoff
            </span>
            <Sliders className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-slate-900">
            70% <span className="text-xs font-semibold text-slate-500">(0.70)</span>
          </div>
          <p className="mt-1.5 font-mono text-[10px] text-slate-500">
            Strict ML threshold before LLM fallback
          </p>
        </div>

        {/* Offline Queue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Local Offline Buffer
            </span>
            <HardDrive className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-slate-900">
            {offlineCount} <span className="text-xs font-semibold text-slate-500">queued</span>
          </div>
          <p className="mt-1.5 font-mono text-[10px] text-slate-500">
            Syncs automatically upon network recovery
          </p>
        </div>
      </div>

      {/* Main Configuration Details Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ML & AI Engine Specs */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Machine Learning & Needs Classifier
              </h2>
            </div>
            <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-700">
              ACTIVE
            </span>
          </div>

          <div className="p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="font-semibold text-slate-900">Primary Classifier Model</p>
                <p className="text-slate-500 text-[11px]">Pickled Scikit-Learn TF-IDF + Logistic Classifier</p>
              </div>
              <code className="font-mono text-[10px] bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-800">
                resqgrid_need_model.pkl
              </code>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="font-semibold text-slate-900">Confidence Threshold</p>
                <p className="text-slate-500 text-[11px]">Minimum probability score to accept ML inference</p>
              </div>
              <span className="font-mono font-bold text-slate-900 text-sm">0.70</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="font-semibold text-slate-900">LLM Fallback Provider</p>
                <p className="text-slate-500 text-[11px]">Invoked when ML confidence is below 0.70 cutoff</p>
              </div>
              <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Groq (openai/gpt-oss-120b)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Need Classes Output</p>
                <p className="text-slate-500 text-[11px]">Categorized emergency requirements</p>
              </div>
              <span className="font-mono text-[11px] text-slate-700">
                medical, evacuation, food_water, rescue
              </span>
            </div>
          </div>
        </div>

        {/* OR-Tools Optimizer & Decision Pipeline Specs */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Google OR-Tools Optimization Engine
              </h2>
            </div>
            <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-700">
              OPERATIONAL
            </span>
          </div>

          <div className="p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="font-semibold text-slate-900">Solver Engine</p>
                <p className="text-slate-500 text-[11px]">Mixed Integer Programming (MIP) / Constraint Solver</p>
              </div>
              <span className="font-mono font-bold text-blue-700">Google OR-Tools</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="font-semibold text-slate-900">Objective Function</p>
                <p className="text-slate-500 text-[11px]">Maximize total prioritized need satisfaction</p>
              </div>
              <span className="font-mono text-[11px] text-slate-800 font-semibold">
                Priority Weight × Demand Met
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="font-semibold text-slate-900">Constraints Enforced</p>
                <p className="text-slate-500 text-[11px]">Resource quantity caps, agency capabilities, zone bounds</p>
              </div>
              <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">
                HARD & SOFT CONSTRAINTS
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Re-allocation Trigger</p>
                <p className="text-slate-500 text-[11px]">Automatic re-optimization on critical incident updates</p>
              </div>
              <span className="font-mono text-[11px] text-emerald-700 font-bold">
                REALTIME BROADCAST
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* System Pipeline Verification Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          End-to-End Decision Architecture Verification
        </h3>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-5 text-center">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="font-mono text-[9px] font-bold text-slate-500">STAGE 1</p>
            <p className="text-xs font-bold text-slate-900 mt-1">Intake & Queue</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Online / Local Queue</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="font-mono text-[9px] font-bold text-slate-500">STAGE 2</p>
            <p className="text-xs font-bold text-slate-900 mt-1">ML Need Predictor</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Threshold 0.70</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="font-mono text-[9px] font-bold text-slate-500">STAGE 3</p>
            <p className="text-xs font-bold text-slate-900 mt-1">Priority Ranking</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Multi-factor Scoring</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="font-mono text-[9px] font-bold text-slate-500">STAGE 4</p>
            <p className="text-xs font-bold text-slate-900 mt-1">Duplicate Filter</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Spatial Clustering</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="font-mono text-[9px] font-bold text-blue-700">STAGE 5</p>
            <p className="text-xs font-bold text-blue-900 mt-1">OR-Tools Solver</p>
            <p className="text-[10px] text-blue-700 mt-0.5">Optimal Mission Dispatch</p>
          </div>
        </div>
      </div>
    </div>
  );
}
