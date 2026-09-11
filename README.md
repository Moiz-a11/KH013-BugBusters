# 🚨 ResQAI

## Agentic Disaster Relief & Emergency Resource Coordinator

> **AI-powered emergency coordination platform for intelligent disaster response, resource allocation, dynamic reallocation, and real-time inter-agency coordination.**

ResQAI is an agentic AI-powered disaster management platform designed to help emergency response teams make faster and smarter decisions during floods, earthquakes, cyclones, and other large-scale emergencies.

The platform continuously processes incident reports, identifies critical needs, evaluates severity, coordinates agencies, and optimizes the allocation of limited emergency resources.

Instead of relying on static resource assignment, ResQAI dynamically adapts to changing disaster conditions and reallocates resources whenever a new critical situation emerges.

---

## 🎯 Problem Statement

During major disasters, emergency response teams face several challenges:

- Information arrives from multiple sources and formats.
- The severity of incidents changes rapidly.
- Emergency resources are limited.
- Multiple agencies may respond to the same location.
- Some critical zones may remain under-resourced.
- Manual resource allocation is slow and inefficient.
- Changing conditions require continuous re-planning.
- Decision-makers lack a unified real-time operational view.

Traditional systems often provide monitoring and reporting, but they do not intelligently coordinate the entire response workflow.

### The Challenge

> **How can emergency resources be intelligently allocated, coordinated, and dynamically reallocated as disaster conditions change?**

ResQAI addresses this problem using:

**Agentic AI + Optimization + Real-Time Systems + GIS**

---

# 💡 Our Solution

ResQAI acts as an intelligent emergency operations coordinator.

### End-to-End Workflow

```text
Incident Report
      ↓
AI Report Analysis
      ↓
Needs Assessment
      ↓
Severity & Priority Calculation
      ↓
Duplicate Effort Detection
      ↓
Resource Optimization
      ↓
OR-Tools Allocation
      ↓
Agency Coordination
      ↓
Mission Dispatch
      ↓
Real-Time Monitoring
      ↓
New Emergency?
      ↓
Dynamic Reallocation
```

This allows emergency teams to move from:

> **"What is happening?"**

to:

> **"What should we do next?"**

---

# 🚀 Key Features

## 1. 🆘 Incident Reporting

Emergency teams can submit incident reports containing:

- Disaster type
- Location
- Number of affected people
- Required resources
- Severity
- Urgency
- Additional situation details

The platform converts incoming reports into structured incident data.

---

## 2. 🤖 AI-Powered Report Analysis

ResQAI uses an LLM-powered agent to understand unstructured emergency reports.

### Example Input

```text
Heavy flooding near Zone C. Around 500 people are stranded.
We need rescue boats, medical kits and drinking water.
```

### AI-Extracted Information

| Field | Value |
|---|---|
| Disaster | Flood |
| Affected People | 500 |
| Location | Zone C |
| Urgency | High |
| Required Resources | Rescue Boats, Medical Kits, Drinking Water |

This reduces manual data processing and helps responders act faster.

---

# 🧠 Agentic AI Pipeline

ResQAI uses multiple specialized agents instead of relying on a single AI response.

| Agent | Responsibility |
|---|---|
| **Report Agent** | Processes incoming emergency reports and extracts structured information. |
| **Needs Assessment Agent** | Determines required resources based on the incident. |
| **Priority Agent** | Evaluates incident severity and urgency. |
| **Duplicate Detection Agent** | Identifies overlapping or duplicate response efforts. |
| **Allocation Agent** | Coordinates with the optimization engine to determine resource allocation. |
| **Coordination Agent** | Coordinates agencies, missions, and response activities. |
| **Reallocation Agent** | Re-evaluates conditions and reallocates resources when required. |

---

# 📊 Priority & Severity

ResQAI considers multiple factors when determining incident priority:

- Severity
- Affected population
- Urgency
- Resource deficiency
- Disaster type
- Operational risk

### Conceptual Priority Model

```text
Priority Score =
    Severity
    + Urgency
    + Affected Population
    + Resource Deficiency
```

The objective is to ensure that the most critical incidents receive attention first.

---

# 🧮 Intelligent Resource Allocation

Resource allocation is handled using **Google OR-Tools**.

Instead of allowing an LLM to directly decide numerical allocations, ResQAI separates:

```text
AI
 ↓
Understanding & Reasoning
 ↓
Structured Requirements
 ↓
Google OR-Tools
 ↓
Mathematically Optimized Allocation
```

### Optimization Factors

- Resource availability
- Resource demand
- Incident priority
- Distance
- Agency capacity
- Resource constraints
- Mission requirements

This separation improves reliability and explainability.

---

# 🔄 Dynamic Reallocation

Disaster situations are constantly changing.

### Initial Situation

| Zone | Severity |
|---|---|
| Zone A | 🔴 Critical |
| Zone B | 🟡 Medium |
| Zone C | 🟠 High |
| Zone D | 🟢 Low |
| Zone E | 🟡 Medium |

Resources are initially allocated according to priority.

### New Emergency

```text
Zone D → CRITICAL

300 additional people trapped.

Immediate rescue required.
```

### Automatic Response

```text
New Report
    ↓
AI Analysis
    ↓
Priority Update
    ↓
Needs Update
    ↓
Duplicate Detection
    ↓
OR-Tools Re-Optimization
    ↓
Resource Reallocation
    ↓
Mission Update
    ↓
WebSocket Broadcast
    ↓
Dashboard Updated
```

This demonstrates the core intelligence of ResQAI.

---

# 🌐 Real-Time Operations

ResQAI uses **WebSockets** for real-time system updates.

The dashboard can receive events such as:

- New incident
- Resource allocation
- Mission dispatch
- Priority change
- Emergency alert
- Resource reallocation
- Agency status change

### Example

```text
Zone C priority changed
        ↓
Optimization triggered
        ↓
Resources reallocated
        ↓
Mission updated
        ↓
Dashboard receives WebSocket event
```

This eliminates the need for constant page refreshing.

---

# ⚡ Redis

Redis acts as a high-speed infrastructure component for real-time operations.

Potential responsibilities include:

- Real-time state
- Event propagation
- Pub/Sub
- Caching
- WebSocket event coordination

This helps the system handle frequent updates efficiently.

---

# 🗺️ Live Disaster Map

ResQAI provides a GIS-based operational map using:

- Leaflet
- OpenStreetMap
- React-Leaflet

### Map Visualization

The map can visualize:

- Disaster zones
- Incident locations
- Severity levels
- Agencies
- Rescue teams
- Hospitals
- Shelters
- Ambulances
- Resource locations
- Mission routes

### Severity Legend

| Status | Meaning |
|---|---|
| 🔴 | Critical |
| 🟠 | High |
| 🟡 | Medium |
| 🟢 | Low |

This gives emergency coordinators a geographic overview of the situation.

---

# 🏢 Multi-Agency Coordination

ResQAI provides a unified operational view for multiple response organizations.

### Example Agencies

- National Disaster Response Force
- State Disaster Response Force
- Police
- Fire Department
- Medical Teams
- Local Government
- NGOs
- Volunteer Groups

### Agency Information

The platform tracks:

- Agency availability
- Personnel
- Resources
- Active missions
- Assigned zones
- Response capacity

This helps reduce duplicated efforts and improves coordination.

---

# 🚑 Mission Management

Resources are converted into operational missions.

### Example Mission

```text
Mission #104

Zone: C
Priority: CRITICAL

Objective:
Rescue stranded civilians

Required:
- 3 Rescue Boats
- 2 Medical Teams
- 500 Water Kits

Assigned Agency:
Emergency Response Team

Status:
DISPATCHED
```

### Mission Lifecycle

```text
PLANNED
   ↓
ASSIGNED
   ↓
DISPATCHED
   ↓
IN PROGRESS
   ↓
COMPLETED
```

---

# 📡 Emergency Operations Dashboard

The main dashboard acts as a centralized disaster command center.

### Key Performance Indicators

- Active incidents
- Critical zones
- Available resources
- Active missions
- Agencies online

### Dashboard Components

- Live disaster map
- Critical incident queue
- Resource readiness
- Active missions
- Agency status
- AI operations pipeline
- Real-time activity feed
- Emergency simulation
- System health

---

# 🤖 AI Operations Pipeline

The dashboard visualizes the current AI decision-making process:

```text
┌─────────────────┐
│ Incident Report │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Report Agent    │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Needs Assessment│
└────────┬────────┘
         ↓
┌─────────────────┐
│ Priority Agent  │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Duplicate Check │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Allocation Agent│
└────────┬────────┘
         ↓
┌─────────────────┐
│ Google OR-Tools │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Coordination    │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Mission Dispatch│
└─────────────────┘
```

Each stage can expose its current status and operational explanation.

---

# 🧪 Emergency Simulation

ResQAI includes an emergency simulation workflow designed specifically for demonstrating dynamic disaster response.

### Initial Scenario

```text
Zone A → Critical
Zone B → Medium
Zone C → High
Zone D → Low
Zone E → Medium
```

The system allocates resources.

### Trigger Emergency

```text
🚨 NEW EMERGENCY

The affected zone becomes critical.
```

### ResQAI Demonstrates

1. New report received
2. AI extracts information
3. Needs are assessed
4. Priority is recalculated
5. Duplicate efforts are checked
6. OR-Tools re-optimizes allocation
7. Resources are reallocated
8. Missions are updated
9. WebSocket events are broadcast
10. Audit log is created

This provides a clear end-to-end demonstration of the platform.

---

# 🧾 Audit & Explainability

Every major operational action can be recorded.

### Example Audit Timeline

```text
13:42:01
Incident #102 created

13:42:03
AI needs assessment completed

13:42:05
Priority changed: HIGH → CRITICAL

13:42:06
Optimization triggered

13:42:08
Resources reallocated

13:42:09
Mission #205 updated
```

### Benefits

- Transparency
- Accountability
- Debugging
- Decision traceability
- Operational history

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │        User         │
                    │  Emergency Operator │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │ React + Vite        │
                    │ Tailwind            │
                    │ React-Leaflet       │
                    └──────────┬──────────┘
                               │
                     REST API │ WebSocket
                               ↓
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ↓                    ↓                    ↓
 ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
 │    AI Agents   │   │ Redis / Events │   │ Optimization   │
 │                │   │                │   │                │
 │ Report Agent   │   │ Pub/Sub        │   │ Google         │
 │ Needs Agent    │   │ Cache          │   │ OR-Tools       │
 │ Priority Agent │   │ Real-time      │   │                │
 │ Duplicate Agent│   │ State          │   │                │
 │ Coordination   │   │                │   │                │
 └────────┬───────┘   └────────────────┘   └────────┬───────┘
          │                                          │
          └────────────────┬─────────────────────────┘
                           ↓
                    ┌─────────────────┐
                    │     Database    │
                    │ Incident Data   │
                    │ Resources       │
                    │ Agencies        │
                    │ Missions        │
                    │ Audit Logs      │
                    └─────────────────┘
```

---

# 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, React Router, React-Leaflet, Leaflet, Recharts, Lucide React |
| **Backend** | Python, FastAPI, REST APIs, WebSockets |
| **AI** | LLM API, Agentic Workflow, Information Extraction, Needs Assessment, Priority Reasoning, Duplicate Detection |
| **Optimization** | Google OR-Tools, Constraint Optimization, Resource Allocation, Dynamic Reallocation |
| **Real-Time** | Redis, WebSockets, Pub/Sub, Event-Driven Updates |
| **Maps** | Leaflet, OpenStreetMap, React-Leaflet |
| **Development** | Git, GitHub, VS Code |

---

# 📁 Project Structure

```text
ResQAI/
│
├── backend/
│   ├── agents/
│   ├── api/
│   ├── models/
│   ├── services/
│   ├── optimization/
│   ├── websocket/
│   ├── main.py
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── dashboard/
│   │   │   ├── incidents/
│   │   │   ├── resources/
│   │   │   ├── agencies/
│   │   │   ├── missions/
│   │   │   ├── map/
│   │   │   ├── analytics/
│   │   │   ├── audit/
│   │   │   └── common/
│   │   │
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── utils/
│   │
│   ├── package.json
│   └── ...
│
├── docs/
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation & Setup

## Prerequisites

Make sure the following are installed:

- Python 3.10+
- Node.js
- npm
- Redis
- Git

---

## 🔧 Backend Setup

Open a terminal:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scriptsctivate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create an environment file:

```text
.env
```

Example:

```env
LLM_API_KEY=your_api_key
REDIS_URL=redis://localhost:6379
```

Start the backend:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://localhost:8000
```

---

## 🎨 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

**Never commit secrets to GitHub.**

Use:

```text
.env
```

and add it to `.gitignore`.

Provide a safe example using:

```text
.env.example
```

Example:

```env
LLM_API_KEY=
REDIS_URL=redis://localhost:6379
BACKEND_URL=http://localhost:8000
```

---

# 🔄 API Communication

The frontend communicates with the backend using REST APIs.

### Example Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/incidents` | Fetch incidents |
| `POST` | `/api/incidents` | Create incident |
| `GET` | `/api/resources` | Fetch resources |
| `GET` | `/api/agencies` | Fetch agencies |
| `GET` | `/api/missions` | Fetch missions |
| `GET` | `/api/dashboard/summary` | Dashboard data |
| `POST` | `/api/allocations/optimize` | Optimize allocation |
| `POST` | `/api/simulation/seed` | Seed simulation |
| `POST` | `/api/simulation/emergency` | Trigger emergency |

Real-time updates are delivered through WebSockets.

> **Note:** Keep this endpoint list synchronized with the actual backend implementation.

---

# 🧠 Why Agentic AI?

A traditional application might follow:

```text
Input → Database → Fixed Rule → Output
```

ResQAI follows:

```text
Input
 ↓
Understand
 ↓
Assess
 ↓
Reason
 ↓
Check Constraints
 ↓
Optimize
 ↓
Coordinate
 ↓
Act
 ↓
Observe New Information
 ↓
Re-plan
```

This makes the system adaptive rather than purely static.

---

# ⚖️ AI + Optimization: Why Both?

LLMs are powerful for:

- Understanding natural language
- Extracting information
- Reasoning about context
- Generating explanations

However, resource allocation is a constraint-based mathematical problem.

Therefore, ResQAI uses:

```text
LLM
 ↓
Understand the Situation
 ↓
Structured Requirements
 ↓
OR-Tools
 ↓
Mathematically Optimized Allocation
```

This separation improves reliability and explainability.

---

# 🎯 Example Use Case

A flood affects five zones.

| Zone | Severity | Affected |
|---|---|---:|
| Zone A | Critical | 800 |
| Zone B | Medium | 200 |
| Zone C | High | 500 |
| Zone D | Low | 100 |
| Zone E | Medium | 300 |

### Available Resources

| Resource | Quantity |
|---|---:|
| Rescue Boats | 15 |
| Medical Kits | 1,000 |
| Water Kits | 2,000 |
| Rescue Teams | 10 |
| Ambulances | 8 |

ResQAI calculates an optimized allocation.

Later:

```text
Zone D becomes Critical
Affected population increases to 700
```

The system automatically triggers reallocation.

This demonstrates how ResQAI responds to changing disaster conditions.

---

# 🏆 Hackathon Value Proposition

ResQAI is not simply a disaster dashboard.

It combines:

```text
AI
+
Multi-Agent Intelligence
+
Optimization
+
Real-Time Events
+
GIS
+
Multi-Agency Coordination
```

### Core Innovation

> **Continuous decision-making under changing disaster conditions.**

---

# 🌍 Expected Impact

ResQAI can help emergency organizations:

- Reduce response time
- Improve resource utilization
- Identify critical zones faster
- Reduce duplicate response efforts
- Improve agency coordination
- Adapt to changing conditions
- Provide transparent decision trails
- Support data-driven emergency decisions

---

# 🔮 Future Scope

## 📡 Real-Time Data Sources

Future integrations could include:

- IoT sensors
- Weather APIs
- Satellite imagery
- Emergency helplines
- Social media reports
- Drone feeds

## 🛰️ Advanced GIS

- Satellite-based disaster mapping
- Flood prediction
- Road accessibility
- Route optimization
- Evacuation planning

## 🧠 Advanced AI

- Multimodal disaster analysis
- Vision-based damage detection
- Voice-based incident reporting
- Predictive resource demand
- Autonomous coordination agents

## 📱 Mobile Application

A responder-focused mobile application for:

- Incident reporting
- Mission updates
- GPS tracking
- Emergency communication

---

# ⚠️ Disclaimer

ResQAI is a prototype developed for demonstration and hackathon purposes.

It is not intended to replace trained emergency personnel, official disaster-management protocols, or authoritative emergency communication systems.

Real-world deployment would require extensive validation, security, reliability testing, regulatory compliance, and integration with authorized emergency organizations.

---

# 👨‍💻 Team

## ResQAI Team

Built as a hackathon project focused on:

> **AI-driven disaster response, intelligent resource optimization, and real-time emergency coordination.**

---

# ⭐ Vision

> **When disaster conditions change every minute, emergency decisions should adapt just as fast.**

### ResQAI

**Sense. Decide. Coordinate. Respond.**
