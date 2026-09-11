import React, {useEffect, useMemo, useState} from "react";
import {MapContainer, TileLayer, CircleMarker, Popup} from "react-leaflet";
import {api, connectSocket} from "./api";

const severityClass = {
  CRITICAL:"text-red-300 bg-red-500/10 border-red-500/30",
  HIGH:"text-orange-300 bg-orange-500/10 border-orange-500/30",
  MEDIUM:"text-yellow-300 bg-yellow-500/10 border-yellow-500/30",
  LOW:"text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  MONITORING:"text-slate-300 bg-slate-500/10 border-slate-500/30"
};

function Card({title,value,sub}) {
  return <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
    <div className="text-xs uppercase tracking-widest text-slate-500">{title}</div>
    <div className="mt-2 text-3xl font-bold text-white">{value}</div>
    {sub && <div className="mt-1 text-sm text-slate-400">{sub}</div>}
  </div>
}

function SeverityBadge({level}) {
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${severityClass[level] || severityClass.MONITORING}`}>{level}</span>
}

export default function App() {
  const [summary,setSummary]=useState({});
  const [incidents,setIncidents]=useState([]);
  const [resources,setResources]=useState([]);
  const [missions,setMissions]=useState([]);
  const [audit,setAudit]=useState([]);
  const [zones,setZones]=useState([]);
  const [tab,setTab]=useState("command");
  const [busy,setBusy]=useState(false);
  const [toast,setToast]=useState("");
  const [form,setForm]=useState({zone_id:"ZONE-A",disaster_type:"flood",report:""});

  const refresh = async () => {
    const [s,i,r,m,a,z] = await Promise.all([api.summary(),api.incidents(),api.resources(),api.missions(),api.audit(),api.zones()]);
    setSummary(s); setIncidents(i); setResources(r); setMissions(m); setAudit(a); setZones(z);
  };

  useEffect(()=>{ refresh(); const ws=connectSocket(()=>refresh()); return ()=>ws.close(); },[]);
  useEffect(()=>{ if(toast){const t=setTimeout(()=>setToast(""),3500);return()=>clearTimeout(t)}},[toast]);

  const action = async(fn,msg) => {
    try { setBusy(true); await fn(); await refresh(); setToast(msg); }
    catch(e){ setToast(e.message); }
    finally { setBusy(false); }
  };

  const create = async(e) => {
    e.preventDefault();
    await action(()=>api.createIncident(form),"Incident analyzed and added");
    setForm({...form,report:""});
  };

  const ranked = useMemo(()=>[...incidents].sort((a,b)=>b.priority_score-a.priority_score),[incidents]);

  return <div className="min-h-screen">
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-[1500px] px-5 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold tracking-[0.3em] text-cyan-400">PS20</div>
          <h1 className="text-xl font-black text-white">Disaster Response Command Center</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400"><span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/> LIVE</div>
      </div>
    </header>

    <main className="mx-auto max-w-[1500px] px-5 py-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          ["command","Command Center"],["incidents","Incidents"],["resources","Resources"],
          ["missions","Missions"],["map","Live Map"],["audit","Audit Log"]
        ].map(([key,label])=><button key={key} onClick={()=>setTab(key)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab===key?"bg-cyan-400 text-slate-950":"bg-slate-900 text-slate-300 border border-slate-800"}`}>{label}</button>)}
        <div className="ml-auto flex gap-2">
          <button disabled={busy} onClick={()=>action(api.seed,"Five-zone scenario seeded")} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">Seed 5 Zones</button>
          <button disabled={busy} onClick={()=>action(api.optimize,"Allocation optimized")} className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-400">Optimize</button>
          <button disabled={busy} onClick={()=>action(api.emergency,"Zone B emergency triggered and resources re-allocated")} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-400">🚨 Trigger Emergency</button>
        </div>
      </div>

      {toast && <div className="mb-5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">{toast}</div>}

      {tab==="command" && <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <Card title="Active Zones" value={summary.active_incidents||0}/>
          <Card title="Critical" value={summary.critical||0}/>
          <Card title="High" value={summary.high||0}/>
          <Card title="Medium" value={summary.medium||0}/>
          <Card title="Available Units" value={summary.available_resources||0}/>
          <Card title="Missions" value={summary.active_missions||0}/>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex justify-between items-center mb-4">
              <div><h2 className="font-bold text-white text-lg">Priority Queue</h2><p className="text-sm text-slate-500">Global incident ranking</p></div>
            </div>
            <div className="space-y-3">
              {ranked.length===0 ? <Empty text="Seed the five-zone scenario to begin."/> : ranked.map(i=>
                <div key={i.incident_id} className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="text-2xl font-black text-slate-500 w-10">#{ranked.indexOf(i)+1}</div>
                  <div className="flex-1"><div className="font-bold text-white">{i.zone_id.replace("ZONE-","Zone ")}</div><div className="text-xs text-slate-500 mt-1 max-w-xl">{i.raw_text}</div></div>
                  <SeverityBadge level={i.severity}/>
                  <div className="text-2xl font-black text-white w-14 text-right">{Math.round(i.priority_score)}</div>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="font-bold text-white text-lg">New Incident</h2>
            <p className="text-sm text-slate-500 mb-4">LLM-ready structured intake pipeline</p>
            <form onSubmit={create} className="space-y-3">
              <select value={form.zone_id} onChange={e=>setForm({...form,zone_id:e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm">
                {["ZONE-A","ZONE-B","ZONE-C","ZONE-D","ZONE-E"].map(z=><option key={z}>{z}</option>)}
              </select>
              <select value={form.disaster_type} onChange={e=>setForm({...form,disaster_type:e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm">
                {["flood","earthquake","cyclone","landslide","fire","other"].map(x=><option key={x}>{x}</option>)}
              </select>
              <textarea required minLength={5} value={form.report} onChange={e=>setForm({...form,report:e.target.value})} rows="7" placeholder="Example: 1200 people are trapped, hospital is damaged, rescue and medical support required..." className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm resize-none"/>
              <button disabled={busy} className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950">Analyze & Report</button>
            </form>
          </section>
        </div>

        <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <div className="flex items-center gap-3"><span className="text-2xl">🔄</span><div><h2 className="font-bold text-white">Dynamic Re-allocation Demo</h2><p className="text-sm text-slate-400">Trigger the Zone B hospital collapse to recalculate priority and resource allocation.</p></div></div>
        </section>
      </div>}

      {tab==="incidents" && <Table headers={["Zone","Disaster","Affected","Severity","Priority","Needs"]} rows={ranked.map(i=>[
        i.zone_id.replace("ZONE-","Zone "),i.disaster_type,i.people_affected,<SeverityBadge level={i.severity}/>,Math.round(i.priority_score),
        Object.entries(i.needs).filter(([,v])=>v>0).map(([k,v])=>`${k.replace("_"," ")}: ${v}`).join(" • ")
      ])}/>}

      {tab==="resources" && <Table headers={["Resource","Type","Available","Agency","Status"]} rows={resources.map(r=>[
        r.resource_id,r.type.replaceAll("_"," "),`${r.available_quantity} / ${r.quantity}`,
        r.agency_id,r.status
      ])}/>}

      {tab==="missions" && <Table headers={["Mission","Zone","Agency","Resource","Qty","Status"]} rows={missions.map(m=>[
        m.mission_id,m.zone_id.replace("ZONE-","Zone "),m.agency_id,m.resource_type.replace("_"," "),m.quantity,m.status
      ])}/>}

      {tab==="audit" && <Table headers={["Time","Event","Actor","Description"]} rows={audit.map(a=>[
        new Date(a.timestamp).toLocaleTimeString(),a.event_type,a.actor,a.description
      ])}/>}

      {tab==="map" && <div className="h-[650px] rounded-2xl overflow-hidden border border-slate-800">
        <MapContainer center={[18.53,73.82]} zoom={11}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          {zones.map(z=><CircleMarker key={z.zone_id} center={[z.latitude,z.longitude]} radius={12}
            pathOptions={{color: z.severity==="CRITICAL"?"#ef4444":z.severity==="HIGH"?"#f97316":z.severity==="MEDIUM"?"#eab308":"#22c55e", fillOpacity:.75}}>
            <Popup><b>{z.name}</b><br/>Severity: {z.severity}<br/>Priority: {Math.round(z.priority_score)}</Popup>
          </CircleMarker>)}
        </MapContainer>
      </div>}
    </main>
  </div>
}

function Table({headers,rows}) {
  return <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
    <table className="w-full text-left text-sm"><thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-500"><tr>{headers.map(h=><th key={h} className="px-4 py-4">{h}</th>)}</tr></thead>
    <tbody>{rows.length===0?<tr><td colSpan={headers.length} className="p-8 text-center text-slate-500">No data yet.</td></tr>:rows.map((row,i)=><tr key={i} className="border-t border-slate-800"><>{row.map((c,j)=><td key={j} className="px-4 py-4 text-slate-300">{c}</td>)}</></tr>)}</tbody></table>
  </div>
}
function Empty({text}) { return <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center text-slate-500">{text}</div> }
