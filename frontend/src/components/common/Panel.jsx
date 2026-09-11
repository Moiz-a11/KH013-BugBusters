export default function Panel({
  title,
  subtitle,
  children,
  action,
  className = "",
}) {
  return (
    <section
      className={`
        overflow-hidden rounded-xl border border-slate-800
        bg-[#0b111b]
        ${className}
      `}
    >

      {(title || subtitle || action) && (
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

          <div>
            {title && (
              <h2 className="text-sm font-semibold text-white">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1 text-[10px] text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          {action}
        </div>
      )}

      <div>
        {children}
      </div>

    </section>
  );
}