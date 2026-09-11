const styles = {
  critical: {
    badge: "border-red-500/40 bg-red-950/40 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.15)]",
    dot: "bg-red-400 animate-pulse",
  },
  high: {
    badge: "border-amber-500/40 bg-amber-950/30 text-amber-300",
    dot: "bg-amber-400",
  },
  medium: {
    badge: "border-yellow-500/30 bg-yellow-950/20 text-yellow-300",
    dot: "bg-yellow-400",
  },
  low: {
    badge: "border-emerald-500/30 bg-emerald-950/20 text-emerald-300",
    dot: "bg-emerald-400",
  },
  monitoring: {
    badge: "border-slate-700 bg-slate-900/60 text-slate-300",
    dot: "bg-slate-400",
  },
};

export default function SeverityBadge({ severity = "medium", className = "" }) {
  const normalized = (severity || "medium").toLowerCase();
  const activeStyle = styles[normalized] || styles.monitoring;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded border px-2 py-0.5
        font-mono text-[10px] font-semibold uppercase tracking-wider
        ${activeStyle.badge}
        ${className}
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${activeStyle.dot}`} />
      {severity || "MONITORING"}
    </span>
  );
}