import {
  Siren,
  AlertTriangle,
  Package,
  Truck,
  Building2,
} from "lucide-react";

const cards = [
  {
    label: "ACTIVE INCIDENTS",
    value: "05",
    change: "+2 today",
    icon: Siren,
    tone: "blue",
  },
  {
    label: "CRITICAL ZONES",
    value: "02",
    change: "+1 urgent",
    icon: AlertTriangle,
    tone: "red",
  },
  {
    label: "RESOURCES AVAILABLE",
    value: "1,284",
    change: "82% ready",
    icon: Package,
    tone: "green",
  },
  {
    label: "ACTIVE MISSIONS",
    value: "12",
    change: "8 dispatched",
    icon: Truck,
    tone: "amber",
  },
  {
    label: "AGENCIES ACTIVE",
    value: "08",
    change: "100% online",
    icon: Building2,
    tone: "navy",
  },
];

const toneStyles = {
  blue: {
    icon: "bg-blue-50 text-blue-600 border-blue-100",
    accent: "bg-blue-500",
    change: "text-blue-600",
  },
  red: {
    icon: "bg-red-50 text-red-600 border-red-100",
    accent: "bg-red-500",
    change: "text-red-600",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600 border-emerald-100",
    accent: "bg-emerald-500",
    change: "text-emerald-600",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 border-amber-100",
    accent: "bg-amber-500",
    change: "text-amber-600",
  },
  navy: {
    icon: "bg-slate-50 text-[#0F2744] border-slate-200",
    accent: "bg-[#0F2744]",
    change: "text-slate-600",
  },
};

export default function KPIBar() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

      {cards.map((card) => {
        const Icon = card.icon;
        const style = toneStyles[card.tone];

        return (
          <div
            key={card.label}
            className="
              group relative overflow-hidden
              rounded-xl
              border border-slate-200
              bg-white
              px-4 py-4
              shadow-[0_1px_3px_rgba(15,23,42,0.04)]
              transition-all duration-200
              hover:-translate-y-[1px]
              hover:border-slate-300
              hover:shadow-md
            "
          >
            {/* Top accent */}
            <div
              className={`
                absolute left-0 top-0
                h-[3px] w-full
                ${style.accent}
              `}
            />

            <div className="flex items-start justify-between gap-3">

              {/* KPI information */}
              <div className="min-w-0">

                <p
                  className="
                    truncate
                    text-[9px] font-bold
                    uppercase tracking-[0.11em]
                    text-slate-400
                  "
                >
                  {card.label}
                </p>

                <p
                  className="
                    mt-2
                    text-[26px]
                    font-bold
                    leading-none
                    tracking-tight
                    text-[#0F2744]
                  "
                >
                  {card.value}
                </p>

                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className={`
                      h-1.5 w-1.5 rounded-full
                      ${style.accent}
                    `}
                  />

                  <span
                    className={`
                      text-[9px] font-semibold
                      ${style.change}
                    `}
                  >
                    {card.change}
                  </span>
                </div>

              </div>

              {/* Icon */}
              <div
                className={`
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-lg border
                  ${style.icon}
                `}
              >
                <Icon
                  className="h-[17px] w-[17px]"
                  strokeWidth={1.9}
                />
              </div>

            </div>
          </div>
        );
      })}

    </div>
  );
}