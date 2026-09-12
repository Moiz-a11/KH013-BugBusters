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
        relative overflow-hidden rounded-xl border
        ${isEmergency ? "border-red-200 bg-white shadow-sm ring-1 ring-red-100" : "border-slate-200 bg-white shadow-sm"}
        transition-all duration-200
        ${className}
      `}
    >
      {/* Top accent line */}
      <div 
        className={`h-[2px] w-full ${
          isEmergency 
            ? "bg-gradient-to-r from-red-600 via-red-500 to-transparent" 
            : "bg-gradient-to-r from-blue-700 via-blue-500 to-transparent"
        }`} 
      />

      {(title || subtitle || action || badge) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            {isEmergency ? (
              <span className="h-2 w-2 rounded-full bg-red-500 beacon-critical" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-blue-600" />
            )}
            <div>
              <div className="flex items-center gap-2">
                {title && (
                  <h2 className="text-xs font-bold tracking-wider uppercase text-slate-900">
                    {title}
                  </h2>
                )}
                {badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="mt-0.5 text-[11px] text-slate-500">
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