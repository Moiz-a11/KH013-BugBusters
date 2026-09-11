import { useEffect, useRef, useState } from "react";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Info,
  Loader2,
  MapPin,
  Mic,
  MicOff,
  Send,
  ShieldAlert,
  SquarePen,
  Volume2,
} from "lucide-react";

import { api } from "../api";

export default function VictimReport({ onBack, zones = [] }) {
  const [report, setReport] = useState("");
  const [zoneId, setZoneId] = useState("");

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState("");

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const recognitionRef = useRef(null);

  // -----------------------------------------
  // Speech Recognition
  // -----------------------------------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError("");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);

      switch (event.error) {
        case "not-allowed":
          setSpeechError(
            "Microphone permission was denied. You can type your report instead."
          );
          break;

        case "no-speech":
          setSpeechError(
            "No speech was detected. Please try again."
          );
          break;

        case "audio-capture":
          setSpeechError(
            "Microphone could not be accessed. Please check your microphone."
          );
          break;

        default:
          setSpeechError(
            "Voice recognition failed. Please try again."
          );
      }
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        }
      }

      if (finalTranscript.trim()) {
        setReport((previous) => {
          const separator = previous.trim() ? " " : "";

          return (
            previous.trim() +
            separator +
            finalTranscript.trim()
          );
        });
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Already stopped
      }
    };
  }, []);

  // -----------------------------------------
  // Start Voice
  // -----------------------------------------
  const startListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      setSpeechError(
        "Voice recognition is not supported in this browser."
      );
      return;
    }

    setSpeechError("");
    setSubmitError("");

    try {
      recognitionRef.current.start();
    } catch {
      setIsListening(true);
    }
  };

  // -----------------------------------------
  // Stop Voice
  // -----------------------------------------
  const stopListening = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
    } catch {
      setIsListening(false);
    }
  };

  // -----------------------------------------
  // Submit Emergency Report
  // -----------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");

    const cleanedReport = report.trim();

    if (!zoneId) {
      setSubmitError(
        "Please select the zone where you need help."
      );
      return;
    }

    if (!cleanedReport) {
      setSubmitError(
        "Please describe your emergency before submitting."
      );
      return;
    }

    if (cleanedReport.length < 10) {
      setSubmitError(
        "Please provide a little more information about your situation."
      );
      return;
    }

    if (isListening) {
      stopListening();
    }

    setIsSubmitting(true);

    try {
      const response = await api.createIncident({
        zone_id: zoneId,
        report: cleanedReport,
      });

      console.log(
        "Emergency report submitted:",
        response
      );

      setResult({
        incidentId:
          response?.incident_id || "Pending",

        priority:
          response?.severity || "RECEIVED",

        priorityScore:
          response?.priority_score,
      });

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Emergency report submission failed:",
        error
      );

      setSubmitError(
        error?.message ||
          "Unable to submit your emergency report. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------------------
  // New Report
  // -----------------------------------------
  const handleNewReport = () => {
    setReport("");
    setZoneId("");
    setSpeechError("");
    setSubmitError("");
    setResult(null);
    setSubmitted(false);
  };

  // -----------------------------------------
  // SUCCESS SCREEN
  // -----------------------------------------
  if (submitted && result) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] text-slate-900">

        {/* Top Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-7">

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F2744]">
                <ShieldAlert
                  size={19}
                  className="text-white"
                />
              </div>

              <div>
                <p className="text-sm font-bold tracking-tight text-[#0F2744]">
                  RESQAI
                </p>

                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Emergency Response System
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-500">
                RESPONSE SYSTEM ONLINE
              </span>
            </div>

          </div>
        </header>

        {/* Success Content */}
        <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-4xl items-center px-5 py-10 sm:px-7">

          <div className="w-full">

            {/* Success Banner */}
            <div className="mb-5 flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-emerald-200">
                <CheckCircle2
                  size={24}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Report Received
                </p>

                <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Emergency report successfully submitted
                </h1>

                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  Your report has been received by the disaster
                  response command center and assigned an incident
                  reference.
                </p>
              </div>

            </div>

            {/* Main Result Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Card Header */}
              <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">

                <div className="flex flex-wrap items-center justify-between gap-3">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Incident Confirmation
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      Emergency response reference
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    RECEIVED
                  </span>

                </div>

              </div>

              {/* Result Grid */}
              <div className="grid grid-cols-1 gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">

                {/* Incident ID */}
                <div className="bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Incident ID
                  </p>

                  <p className="mt-2 break-all font-mono text-base font-bold text-[#0F2744]">
                    {result.incidentId}
                  </p>
                </div>

                {/* Priority */}
                <div className="bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Severity
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />

                    <p className="text-base font-bold uppercase text-orange-700">
                      {String(result.priority).toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Priority Score */}
                <div className="bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Priority Score
                  </p>

                  <p className="mt-2 text-base font-bold text-slate-900">
                    {result.priorityScore !== undefined &&
                    result.priorityScore !== null
                      ? Math.round(result.priorityScore)
                      : "—"}
                  </p>
                </div>

                {/* Zone */}
                <div className="bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Affected Zone
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <MapPin
                      size={15}
                      className="text-blue-600"
                    />

                    <p className="text-base font-bold text-slate-900">
                      {zoneId}
                    </p>
                  </div>
                </div>

              </div>

              {/* What Happens Next */}
              <div className="border-t border-slate-100 px-5 py-5 sm:px-6">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                    <Info
                      size={18}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      What happens next?
                    </p>

                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                      Your incident is now available to the response
                      coordination system for assessment and
                      prioritization. Follow instructions from emergency
                      responders and remain in a safe location whenever
                      possible.
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Safety Notice */}
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">

              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <p className="text-xs leading-relaxed text-amber-800">
                If your situation becomes more dangerous, contact
                emergency services directly. Do not put yourself at
                additional risk while waiting for assistance.
              </p>

            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <ArrowLeft size={17} />
                  Return to Command Center
                </button>
              )}

              <button
                type="button"
                onClick={handleNewReport}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2744] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16375F]"
              >
                <Send size={17} />
                Submit Another Report
              </button>

            </div>

          </div>

        </main>
      </div>
    );
  }

  // -----------------------------------------
  // REPORT FORM
  // -----------------------------------------
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900">

      {/* =====================================
          HEADER
      ====================================== */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 sm:px-7">

          {/* Brand / Back */}
          <div className="flex items-center gap-4">

            {onBack && (
              <>
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                  aria-label="Go back"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="hidden h-6 w-px bg-slate-200 sm:block" />
              </>
            )}

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F2744]">
                <ShieldAlert
                  size={19}
                  className="text-white"
                />
              </div>

              <div>
                <p className="text-sm font-bold tracking-tight text-[#0F2744]">
                  RESQAI
                </p>

                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
                  Emergency Reporting
                </p>
              </div>

            </div>

          </div>

          {/* System Status */}
          <div className="hidden items-center gap-2 sm:flex">

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Response System Online
            </span>

          </div>

        </div>

      </header>

      {/* =====================================
          MAIN
      ====================================== */}
      <main className="mx-auto w-full max-w-5xl px-5 py-7 sm:px-7 sm:py-10">

        {/* =====================================
            PAGE INTRO
        ====================================== */}
        <div className="mb-7">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50">
              <AlertTriangle
                size={25}
                className="text-red-600"
              />
            </div>

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-red-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Emergency Intake
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Public Reporting Channel
                </span>

              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0F2744] sm:text-3xl">
                Report an Emergency
              </h1>

              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
                Provide your location and describe what is happening.
                Your report will be sent to the disaster response
                coordination system for assessment.
              </p>

            </div>

          </div>

        </div>

        {/* =====================================
            PROGRESS / PROCESS INDICATOR
        ====================================== */}
        <div className="mb-5 grid grid-cols-1 overflow-hidden rounded-xl border border-slate-200 bg-white sm:grid-cols-3">

          {/* Step 1 */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:border-b-0 sm:border-r">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">
              01
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Step 1
              </p>
              <p className="text-xs font-semibold text-slate-800">
                Identify Zone
              </p>
            </div>

          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:border-b-0 sm:border-r">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">
              02
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Step 2
              </p>
              <p className="text-xs font-semibold text-slate-800">
                Describe Emergency
              </p>
            </div>

          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3 px-4 py-3.5">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-xs font-bold text-red-700">
              03
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Step 3
              </p>
              <p className="text-xs font-semibold text-slate-800">
                Submit Report
              </p>
            </div>

          </div>

        </div>

        {/* =====================================
            FORM CARD
        ====================================== */}
        <form onSubmit={handleSubmit}>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Form Header */}
            <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Emergency Information
                  </p>

                  <h2 className="mt-1 text-sm font-bold text-slate-900">
                    Tell the response center what you need
                  </h2>

                </div>

                <span className="hidden rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 sm:block">
                  Required Information
                </span>

              </div>

            </div>

            <div className="p-5 sm:p-6">

              {/* =================================
                  ZONE
              ================================== */}
              <div>

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <label
                      htmlFor="zone"
                      className="flex items-center gap-2 text-sm font-bold text-slate-800"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                        <MapPin
                          size={15}
                          className="text-blue-600"
                        />
                      </span>

                      Affected Zone
                    </label>

                    <p className="mt-1.5 pl-9 text-xs leading-relaxed text-slate-500">
                      Select the area where emergency assistance is
                      required.
                    </p>

                  </div>

                  <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-red-700">
                    Required
                  </span>

                </div>

                <select
                  id="zone"
                  value={zoneId}
                  onChange={(event) => {
                    setZoneId(event.target.value);
                    setSubmitError("");
                  }}
                  className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="">
                    Select your affected zone
                  </option>

                  {zones.map((zone) => {
                    const id =
                      zone.zone_id || zone.id;

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

              {/* Divider */}
              <div className="my-6 h-px bg-slate-100" />

              {/* =================================
                  DESCRIPTION
              ================================== */}
              <div>

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <label
                      htmlFor="emergency-report"
                      className="flex items-center gap-2 text-sm font-bold text-slate-800"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                        <Edit3
                          size={15}
                          className="text-blue-600"
                        />
                      </span>

                      Emergency Description
                    </label>

                    <p className="mt-1.5 pl-9 text-xs leading-relaxed text-slate-500">
                      Describe what happened, how many people are
                      affected, and what assistance is needed.
                    </p>

                  </div>

                  <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-red-700">
                    Required
                  </span>

                </div>

                <div className="relative mt-4">

                  <textarea
                    id="emergency-report"
                    value={report}
                    onChange={(event) => {
                      setReport(event.target.value);
                      setSubmitError("");
                    }}
                    placeholder="Example: I am trapped in a flooded house with 5 people. My mother is injured and we need medical help and a boat."
                    rows={7}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm leading-relaxed text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-white/90 px-2 py-1 text-[9px] font-medium text-slate-400">
                    {report.length} characters
                  </div>

                </div>

              </div>

              {/* =================================
                  VOICE INPUT
              ================================== */}
              <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
                      <Volume2
                        size={18}
                        className="text-slate-500"
                      />
                    </div>

                    <div>

                      <p className="text-sm font-bold text-slate-800">
                        Voice Input
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        Speak your emergency if you cannot type.
                        Your speech will be converted into text.
                      </p>

                    </div>

                  </div>

                  {speechSupported ? (
                    <button
                      type="button"
                      onClick={
                        isListening
                          ? stopListening
                          : startListening
                      }
                      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                        isListening
                          ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                      }`}
                      aria-label={
                        isListening
                          ? "Stop recording"
                          : "Start voice recording"
                      }
                    >
                      {isListening ? (
                        <>
                          <MicOff size={16} />
                          Stop Listening
                        </>
                      ) : (
                        <>
                          <Mic size={16} />
                          Start Voice Input
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-semibold text-amber-700">
                      Voice input unavailable
                    </span>
                  )}

                </div>

                {isListening && (
                  <div className="flex items-center gap-2 border-t border-red-100 bg-red-50 px-4 py-3">

                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                    </span>

                    <span className="text-xs font-bold text-red-700">
                      LISTENING
                    </span>

                    <span className="text-xs text-red-600">
                      Speak clearly. Your words will appear above.
                    </span>

                  </div>
                )}

                {speechError && (
                  <div className="border-t border-red-100 bg-red-50 px-4 py-3">

                    <div className="flex items-start gap-2">

                      <AlertTriangle
                        size={16}
                        className="mt-0.5 shrink-0 text-red-600"
                      />

                      <p className="text-xs leading-relaxed text-red-700">
                        {speechError}
                      </p>

                    </div>

                  </div>
                )}

              </div>

              {/* =================================
                  REVIEW
              ================================== */}
              {report.trim() && (
                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-blue-100">
                      <SquarePen
                        size={15}
                        className="text-blue-600"
                      />
                    </div>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-blue-800">
                        Review Before Submission
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-blue-700/80">
                        Please make sure your description accurately
                        explains the situation and assistance you need.
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* =================================
                  ERROR
              ================================== */}
              {submitError && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-red-200">
                      <AlertTriangle
                        size={17}
                        className="text-red-600"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-red-800">
                        Unable to Submit
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-red-700">
                        {submitError}
                      </p>
                    </div>

                  </div>

                </div>
              )}

              {/* =================================
                  SUBMIT
              ================================== */}
              <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="hidden items-center gap-2 sm:flex">

                  <ShieldAlert
                    size={16}
                    className="text-slate-400"
                  />

                  <span className="text-[10px] font-medium text-slate-400">
                    Emergency reports are processed by ResQAI.
                  </span>

                </div>

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !report.trim()
                  }
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Emergency Report
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

          {/* =====================================
              SAFETY NOTICE
          ====================================== */}
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5">

            <ShieldAlert
              size={17}
              className="mt-0.5 shrink-0 text-slate-400"
            />

            <p className="text-[11px] leading-relaxed text-slate-500">
              Only provide information relevant to the emergency.
              Avoid putting yourself or others at additional risk
              while preparing or submitting this report.
            </p>

          </div>

        </form>

      </main>

    </div>
  );
}