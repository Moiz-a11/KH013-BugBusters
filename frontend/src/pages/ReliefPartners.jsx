import React from "react";
import { ExternalLink, Heart, Shield, Globe, Info, CheckCircle2, Building2 } from "lucide-react";

export default function ReliefPartners() {
  const partners = [
    {
      id: "goonj",
      name: "Goonj",
      focus: "Disaster Relief, Material Resource Management & Community Rehabilitation",
      description:
        "Goonj is a leading non-governmental organization in India focusing on disaster relief, humanitarian aid, and sustainable rural community development using urban surplus material.",
      website: "https://goonj.org",
      supportAreas: [
        "Disaster Relief Rations & Essentials",
        "Clothing & Household Rehabilitation Supplies",
        "Community Infrastructure Reconstruction",
        "Rural Healthcare & Hygiene Initiatives",
      ],
      tag: "Disaster Relief & Material Management",
      accent: "amber",
    },
    {
      id: "seeds",
      name: "SEEDS",
      fullName: "Sustainable Environment and Ecological Development Society",
      focus: "Disaster Preparedness, Climate Resilience & Post-Disaster Shelter Construction",
      description:
        "SEEDS is a humanitarian organization dedicated to empowering vulnerable communities to withstand and recover from natural disasters through resilient shelter design and community disaster preparedness.",
      website: "https://www.seedsindia.org",
      supportAreas: [
        "Emergency Disaster Shelter & Housing",
        "Clean Water, Sanitation & Hygiene (WASH)",
        "School Reconstruction & Safety",
        "Climate Risk Reduction & Training",
      ],
      tag: "Habitat & Climate Resilience",
      accent: "emerald",
    },
    {
      id: "ircs",
      name: "Indian Red Cross Society",
      focus: "Emergency Medical Care, First Response, Blood Services & Humanitarian Aid",
      description:
        "Indian Red Cross Society is a nationwide voluntary humanitarian organization providing emergency medical relief, first aid response, blood services, and disaster assistance across all Indian states.",
      website: "https://www.indianredcross.org",
      supportAreas: [
        "Emergency First Aid & Medical Units",
        "Disaster Relief Supply Distribution",
        "Blood Bank & Emergency Transfusion",
        "Water Purification & Disease Prevention",
      ],
      tag: "Medical & Humanitarian Response",
      accent: "red",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
          Disaster Support Ecosystem
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Relief & Humanitarian Partners
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Verified public relief organizations actively operating in Indian disaster response and community rehabilitation
        </p>
      </div>

      {/* Transparency / Verification Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-700">
            <p className="font-bold text-slate-900 mb-0.5">
              Verified Public Information & Direct External Portal Links
            </p>
            <p>
              RESQAI provides information about established disaster response organizations to support coordination awareness. RESQAI does not accept donations or process financial transactions directly. Click "Support / Visit Official Website" to visit each organization’s official verified site.
            </p>
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {partners.map((org) => {
          const accentBorders = {
            amber: "border-amber-200 hover:border-amber-300",
            emerald: "border-emerald-200 hover:border-emerald-300",
            red: "border-red-200 hover:border-red-300",
          };

          const accentBadges = {
            amber: "border-amber-200 bg-amber-50 text-amber-800",
            emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
            red: "border-red-200 bg-red-50 text-red-800",
          };

          return (
            <div
              key={org.id}
              className={`flex flex-col justify-between rounded-xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                accentBorders[org.accent] || "border-slate-200"
              }`}
            >
              <div>
                {/* Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`rounded-md border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider ${
                      accentBadges[org.accent]
                    }`}
                  >
                    {org.tag}
                  </span>
                  <Globe className="h-4 w-4 text-slate-400" />
                </div>

                {/* Name */}
                <h2 className="text-lg font-extrabold text-slate-900">
                  {org.name}
                </h2>
                {org.fullName && (
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {org.fullName}
                  </p>
                )}

                {/* Focus */}
                <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    Response Focus
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-800 leading-snug">
                    {org.focus}
                  </p>
                </div>

                {/* Description */}
                <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                  {org.description}
                </p>

                {/* Areas of Support */}
                <div className="mt-5">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Key Support Areas
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {org.supportAreas.map((area, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition shadow-2xs w-full"
                >
                  <span>Support / Visit Official Site</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Resources Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">National Emergency Contacts</h3>
            <p className="text-xs text-slate-500">Official toll-free emergency helpline numbers in India</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs">
            <span className="text-slate-500">NDRF:</span> <span className="font-bold text-slate-900">1078</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs">
            <span className="text-slate-500">National Emergency:</span> <span className="font-bold text-slate-900">112</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs">
            <span className="text-slate-500">Ambulance:</span> <span className="font-bold text-slate-900">102 / 108</span>
          </div>
        </div>
      </div>
    </div>
  );
}
