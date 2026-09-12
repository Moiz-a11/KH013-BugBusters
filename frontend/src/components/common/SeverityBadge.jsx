const styles = {
  critical: {
    badge: "border-red-200 bg-red-50 text-red-700 font-semibold",
    dot: "bg-red-500 animate-pulse",
  },
  high: {
    badge: "border-amber-200 bg-amber-50 text-amber-700 font-semibold",
    dot: "bg-amber-500",
  },
  medium: {
    badge: "border-yellow-200 bg-yellow-50 text-yellow-800 font-semibold",
    dot: "bg-yellow-500",
  },
  low: {
    badge: "border-blue-200 bg-blue-50 text-blue-700 font-semibold",
    dot: "bg-blue-500",
  },
  monitoring: {
    badge: "border-slate-200 bg-slate-100 text-slate-700 font-semibold",
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
        rounded-md border px-2 py-0.5
        font-mono text-[10px] uppercase tracking-wider
        ${activeStyle.badge}
        ${className}
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${activeStyle.dot}`} />
      {severity || "MONITORING"}
    </span>
  );
}