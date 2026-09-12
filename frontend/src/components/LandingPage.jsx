import React, { useState } from "react";
import {
  ShieldAlert,
  Radio,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Sliders,
  Activity,
  X,
} from "lucide-react";

export default function LandingPage({ onSelectRole, onResponderLogin }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleResponderSubmit = (e) => {
    e.preventDefault();
    if (
      passcode.trim() === "" ||
      passcode.trim() === "RESQ2026" ||
      passcode.trim().toLowerCase() === "demo"
    ) {
      onResponderLogin();
    } else {
      setError("Invalid access code. Use demo code: RESQ2026");
    }
  };

  const handleQuickDemoLogin = () => {
    onResponderLogin();
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900 flex flex-col justify-between font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Official RESQAI Dashboard Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-blue-900 bg-blue-900 text-white shadow-xs">
              <ShieldAlert className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-mono text-base font-black tracking-widest text-slate-900">
                  RESQAI
                </h1>
                <span className="rounded bg-red-50 px-1 py-0.2 font-mono text-[8px] font-bold text-red-700 border border-red-200">
                  EOC
                </span>
              </div>

              <p className="font-mono text-[8px] font-semibold tracking-[0.2em] text-slate-500">
                DISASTER COMMAND
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3 py-1.5 flex items-center gap-2 font-mono text-[10px] font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SYSTEM ONLINE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Operational Access Content */}
      <main className="max-w-4xl mx-auto w-full px-6 py-10 flex-1 flex flex-col justify-center">
        {/* Title Header */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
            OPERATIONAL ACCESS
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Access RESQAI
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Select how you are accessing the emergency response system.
          </p>
        </div>

        {/* Two Clean Operational Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Card 1: PUBLIC / VICTIM */}
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md flex flex-col justify-between">
            <div className="absolute left-0 top-0 h-[2px] w-full bg-amber-500" />
            
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  <Radio className="h-3.5 w-3.5 text-amber-600" />
                  PUBLIC / VICTIM
                </span>
              </div>

              <h2 className="mt-4 text-base font-bold text-slate-900">
                Public Emergency Intake
              </h2>

              <p className="mt-1 text-xs text-slate-500 font-medium">
                Report an emergency and request assistance.
              </p>

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Emergency reporting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Offline report queue</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Report status / confirmation</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onSelectRole("public")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-600 shadow-sm transition"
              >
                <span>REPORT AN EMERGENCY</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Card 2: AUTHORIZED RESPONDER */}
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md flex flex-col justify-between">
            <div className="absolute left-0 top-0 h-[2px] w-full bg-blue-600" />

            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-blue-800">
                  <Lock className="h-3.5 w-3.5 text-blue-700" />
                  AUTHORIZED RESPONDER
                </span>
              </div>

              <h2 className="mt-4 text-base font-bold text-slate-900">
                Command Console Access
              </h2>

              <p className="mt-1 text-xs text-slate-500 font-medium">
                Emergency Operations Center access.
              </p>

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>Review incoming reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>Approve emergency response</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>Resource allocation & missions</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition"
              >
                <Lock className="h-4 w-4" />
                <span>EOC RESPONDER ACCESS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Compact System Status Strip */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm flex flex-wrap items-center justify-around gap-4 text-center font-mono text-[10px] font-bold text-slate-600 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-blue-600" />
            <span>ML NEEDS CLASSIFIER</span>
          </div>
          <span className="hidden sm:inline text-slate-300 font-normal">|</span>
          <div className="flex items-center gap-2">
            <Sliders className="h-3.5 w-3.5 text-indigo-600" />
            <span>OR-TOOLS OPTIMIZER</span>
          </div>
          <span className="hidden sm:inline text-slate-300 font-normal">|</span>
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-emerald-600" />
            <span>REAL-TIME TELEMETRY</span>
          </div>
        </div>
      </main>

      {/* Responder Authentication Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">EOC Responder Login</h3>
                  <p className="text-xs text-slate-500 font-medium">Enter passcode or use demo access</p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleResponderSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Authorization Passcode
                </label>
                <input
                  type="password"
                  placeholder="Enter code (Default: RESQ2026)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-700 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-2xs"
                >
                  Verify Access Code
                </button>

                <div className="relative my-1 text-center">
                  <span className="bg-white px-2 font-mono text-[9px] font-bold uppercase text-slate-400">or</span>
                  <div className="absolute inset-y-1/2 left-0 right-0 -z-10 h-px bg-slate-100" />
                </div>

                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full rounded-lg border border-emerald-300 bg-emerald-50 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs"
                >
                  ⚡ One-Click Demo Responder Access
                </button>
              </div>
            </form>

            <div className="rounded-lg bg-slate-50 border border-slate-200 p-2 text-[10px] text-slate-500 text-center font-mono">
              Demo Authorization Code: <span className="text-blue-700 font-bold">RESQ2026</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-3.5 text-center font-mono text-[10px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>RESQAI Emergency Operations & Incident Coordination System</span>
          <span>Disaster Command Console</span>
        </div>
      </footer>
    </div>
  );
}
