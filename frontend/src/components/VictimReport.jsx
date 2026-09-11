import { useEffect, useRef, useState } from "react";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Edit3,
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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">

          <div className="rounded-3xl border border-emerald-400/20 bg-slate-900 p-7 sm:p-10 shadow-2xl">

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/30">
                <CheckCircle2
                  size={48}
                  className="text-emerald-400"
                />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold">
                Emergency Report Submitted
              </h1>

              <p className="mt-3 text-slate-300 leading-relaxed">
                Your situation has been forwarded to the
                disaster response command center.
              </p>
            </div>

            {/* Result Cards */}
            <div className="mt-7 space-y-4">

              {/* Report ID */}
              <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Report ID
                </p>

                <p className="mt-1 text-xl font-bold text-white break-all">
                  {result.incidentId}
                </p>
              </div>

              {/* Priority */}
              <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Priority
                </p>

                <p className="mt-1 text-xl font-bold text-orange-400">
                  {String(result.priority).toUpperCase()}
                </p>

                {result.priorityScore !== undefined && (
                  <p className="mt-2 text-sm text-slate-500">
                    Priority Score:{" "}
                    {Math.round(result.priorityScore)}
                  </p>
                )}
              </div>

              {/* Affected Zone */}
              <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Affected Zone
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {zoneId}
                </p>
              </div>

            </div>

            {/* Safety Message */}
            <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
              <div className="flex gap-3">

                <AlertTriangle
                  size={22}
                  className="mt-0.5 shrink-0 text-amber-400"
                />

                <p className="text-sm leading-relaxed text-slate-300">
                  Please stay safe and follow instructions
                  from emergency responders.
                </p>

              </div>
            </div>

            {/* New Report */}
            <button
              type="button"
              onClick={handleNewReport}
              className="mt-7 w-full rounded-2xl bg-white px-5 py-4 text-base font-bold text-slate-900 transition hover:bg-slate-200"
            >
              Submit Another Report
            </button>

            {/* Back */}
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mt-3 w-full rounded-2xl border border-slate-700 px-5 py-4 text-base font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                Return to Command Center
              </button>
            )}

          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // REPORT FORM
  // -----------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">

          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <ShieldAlert
              size={20}
              className="text-red-400"
            />

            Emergency Reporting
          </div>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">

        {/* Title */}
        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-400/20">
            <AlertTriangle
              size={34}
              className="text-red-400"
            />
          </div>

          <h1 className="mt-5 text-3xl sm:text-4xl font-bold">
            Report an Emergency
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-slate-400 leading-relaxed">
            Tell us what is happening. You can type your
            situation or use your voice.
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-7 shadow-xl">

            {/* Zone */}
            <div>
              <label
                htmlFor="zone"
                className="flex items-center gap-2 text-sm font-semibold text-slate-200"
              >
                <MapPin size={17} />
                Select your affected zone
              </label>

              <select
                id="zone"
                value={zoneId}
                onChange={(event) =>
                  setZoneId(event.target.value)
                }
                className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-base text-white outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
              >
                <option value="">
                  Select your zone
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

            {/* Emergency Description */}
            <div className="mt-7">

              <label
                htmlFor="emergency-report"
                className="flex items-center gap-2 text-sm font-semibold text-slate-200"
              >
                <Edit3 size={17} />
                Describe your situation
              </label>

              <p className="mt-2 text-sm text-slate-500">
                Tell us what happened, how many people
                need help, and what assistance is needed.
              </p>

              <textarea
                id="emergency-report"
                value={report}
                onChange={(event) =>
                  setReport(event.target.value)
                }
                placeholder="Example: I am trapped in a flooded house with 5 people. My mother is injured and we need medical help and a boat."
                rows={7}
                className="mt-5 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-base leading-relaxed text-white outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
              />

            </div>

            {/* Voice */}
            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">

              <div className="flex flex-col items-center text-center">

                <p className="text-sm font-semibold text-slate-300">
                  Can't type?
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Speak your emergency and we will convert
                  it into text.
                </p>

                {speechSupported ? (
                  <button
                    type="button"
                    onClick={
                      isListening
                        ? stopListening
                        : startListening
                    }
                    className={`mt-5 flex h-20 w-20 items-center justify-center rounded-full transition ${
                      isListening
                        ? "bg-red-500 shadow-lg shadow-red-500/20"
                        : "bg-white text-slate-950 hover:bg-slate-200"
                    }`}
                    aria-label={
                      isListening
                        ? "Stop recording"
                        : "Start voice recording"
                    }
                  >
                    {isListening ? (
                      <MicOff size={32} />
                    ) : (
                      <Mic size={32} />
                    )}
                  </button>
                ) : (
                  <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-300">
                    Voice recognition is not supported
                    in this browser. Please type your report.
                  </div>
                )}

                {isListening && (
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-400">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-400" />
                    Listening... Speak clearly
                  </div>
                )}

                {!isListening && speechSupported && (
                  <p className="mt-4 text-xs text-slate-500">
                    Tap the microphone to start speaking.
                  </p>
                )}

              </div>

              {speechError && (
                <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                  {speechError}
                </div>
              )}

            </div>

            {/* Review */}
            {report.trim() && (
              <div className="mt-5 rounded-2xl border border-blue-400/10 bg-blue-400/5 p-4">

                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
                  <SquarePen size={15} />
                  Review before submitting
                </div>

                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  You can edit the report above before sending
                  it to the response center.
                </p>

              </div>
            )}

            {/* Error */}
            {submitError && (
              <div className="mt-5 flex gap-3 rounded-2xl border border-red-400/20 bg-red-400/5 p-4">

                <AlertTriangle
                  size={21}
                  className="mt-0.5 shrink-0 text-red-400"
                />

                <p className="text-sm leading-relaxed text-red-300">
                  {submitError}
                </p>

              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !report.trim()
              }
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 px-5 py-5 text-base font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={21}
                    className="animate-spin"
                  />
                  Submitting Emergency Report...
                </>
              ) : (
                <>
                  <Send size={21} />
                  Submit Emergency Report
                </>
              )}
            </button>

          </div>

          {/* Safety */}
          <div className="mt-5 flex gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">

            <ShieldAlert
              size={20}
              className="mt-0.5 shrink-0 text-slate-500"
            />

            <p className="text-xs leading-relaxed text-slate-500">
              Only submit information relevant to your
              emergency. Your report will be processed by
              the disaster response system.
            </p>

          </div>

        </form>

      </main>
    </div>
  );
}