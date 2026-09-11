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
  },
  {
    label: "CRITICAL ZONES",
    value: "02",
    change: "+1 urgent",
    icon: AlertTriangle,
  },
  {
    label: "RESOURCES AVAILABLE",
    value: "1,284",
    change: "82% ready",
    icon: Package,
  },
  {
    label: "ACTIVE MISSIONS",
    value: "12",
    change: "8 dispatched",
    icon: Truck,
  },
  {
    label: "AGENCIES ACTIVE",
    value: "08",
    change: "100% online",
    icon: Building2,
  },
];

export default function KPIBar() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

      {cards.map((card) => {

        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="border border-slate-800 bg-[#0b111b] p-4"
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[10px] font-semibold tracking-wider text-slate-500">
                  {card.label}
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-white">
                  {card.value}
                </p>

              </div>

              <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-2">
                <Icon className="h-4 w-4 text-cyan-400" />
              </div>

            </div>

            <p className="mt-2 text-[10px] text-slate-500">
              {card.change}
            </p>

          </div>
        );
      })}

    </div>
  );
}