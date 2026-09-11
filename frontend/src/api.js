const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options={}) {
  const res = await fetch(`${API}${path}`, {
    headers: {"Content-Type":"application/json", ...(options.headers || {})},
    ...options
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  health: () => request("/api/health"),
  summary: () => request("/api/dashboard/summary"),
  incidents: () => request("/api/incidents"),
  resources: () => request("/api/resources"),
  agencies: () => request("/api/agencies"),
  missions: () => request("/api/missions"),
  allocations: () => request("/api/allocations"),
  audit: () => request("/api/audit-logs"),
  zones: async () => {
    const incidents = await request("/api/incidents");
    const base = [
      ["ZONE-A","Zone A",18.5204,73.8567],["ZONE-B","Zone B",18.5314,73.8446],
      ["ZONE-C","Zone C",18.5074,73.8077],["ZONE-D","Zone D",18.5913,73.7389],
      ["ZONE-E","Zone E",18.5642,73.7769]
    ];
    return base.map(([zone_id,name,latitude,longitude]) => {
      const zoneIncidents = incidents.filter(i => i.zone_id === zone_id).sort((a,b)=>b.priority_score-a.priority_score);
      const top = zoneIncidents[0];
      return {zone_id,name,latitude,longitude,priority_score:top?.priority_score||0,severity:top?.severity||"MONITORING"};
    });
  },
  seed: () => request("/api/simulation/seed", {method:"POST"}),
  emergency: () => request("/api/simulation/emergency", {method:"POST"}),
  optimize: () => request("/api/allocations/optimize", {method:"POST"}),
  createIncident: (body) => request("/api/incidents", {method:"POST", body:JSON.stringify(body)}),
  predictNeed: (text) => request("/api/needs/predict", {method:"POST", body:JSON.stringify({text})})
};

export function connectSocket(onEvent) {
  const url = (import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/dashboard");
  const ws = new WebSocket(url);
  ws.onmessage = e => {
    try { onEvent(JSON.parse(e.data)); } catch {}
  };
  return ws;
}
