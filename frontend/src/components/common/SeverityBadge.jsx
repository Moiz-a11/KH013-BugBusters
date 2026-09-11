const styles = {
  critical:
    "border-red-500/30 bg-red-500/10 text-red-400",

  high:
    "border-orange-500/30 bg-orange-500/10 text-orange-400",

  medium:
    "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",

  low:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

export default function SeverityBadge({ severity = "medium" }) {

  const normalized = severity.toLowerCase();

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-md border px-2 py-1
        text-[10px] font-bold uppercase tracking-wider
        ${styles[normalized] || styles.medium}
      `}
    >

      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {severity}

    </span>
  );
}