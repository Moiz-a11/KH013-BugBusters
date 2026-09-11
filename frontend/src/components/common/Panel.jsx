export default function Panel({
  title,
  subtitle,
  badge,
  children,
  action,
  className = "",
  variant = "default",
}) {
  const isEmergency = variant === "emergency";

  return (
    <section
      className={`
        relative overflow-hidden rounded-lg border
        ${isEmergency ? "border-red-500/30 bg-[#0c0d14]/95 shadow-[0_4px_24px_-4px_rgba(239,68,68,0.1)]" : "border-slate-800/80 bg-[#080d16]/95"}
        backdrop-blur-sm transition-all duration-200
        ${className}
      `}
    >
      {/* Top micro-telemetry accent line */}
      <div 
        className={`h-[1.5px] w-full ${
          isEmergency 
            ? "bg-gradient-to-r from-red-500/60 via-red-500 to-transparent" 
            : "bg-gradient-to-r from-cyan-500/40 via-slate-700/30 to-transparent"
        }`} 
      />

      {(title || subtitle || action || badge) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 px-5 py-3.5 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            {isEmergency ? (
              <span className="h-2 w-2 rounded-full bg-red-500 beacon-critical" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            )}
            <div>
              <div className="flex items-center gap-2">
                {title && (
                  <h2 className="text-xs font-bold tracking-wide uppercase text-slate-100">
                    {title}
                  </h2>
                )}
                {badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}

      <div>{children}</div>
    </section>
  );
}