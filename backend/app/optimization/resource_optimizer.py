def optimize_allocations(incidents, resources):
    # OR-Tools is used when available. A deterministic greedy fallback keeps the demo runnable
    # even if a native OR-Tools wheel is unavailable in a local environment.
    try:
        from ortools.linear_solver import pywraplp
        solver = pywraplp.Solver.CreateSolver("SCIP")
        if solver:
            vars_ = {}
            for inc in incidents:
                for typ, demand in inc.get("needs", {}).items():
                    if demand <= 0:
                        continue
                    for r in resources:
                        if r["type"] == typ and r["available_quantity"] > 0:
                            key = (inc["incident_id"], r["resource_id"])
                            vars_[key] = solver.IntVar(0, min(demand, r["available_quantity"]), f"x_{len(vars_)}")
            for inc in incidents:
                for typ, demand in inc.get("needs", {}).items():
                    if demand <= 0: continue
                    solver.Add(sum(v for (iid, rid), v in vars_.items()
                                   if iid == inc["incident_id"] and next((r for r in resources if r["resource_id"] == rid), {}).get("type") == typ) <= demand)
            for r in resources:
                solver.Add(sum(v for (iid, rid), v in vars_.items() if rid == r["resource_id"]) <= r["available_quantity"])
            objective = solver.Objective()
            for (iid, rid), v in vars_.items():
                inc = next(i for i in incidents if i["incident_id"] == iid)
                objective.SetCoefficient(v, float(inc.get("priority_score", 0)))
            objective.SetMaximization()
            solver.Solve()
            output = []
            for (iid, rid), v in vars_.items():
                qty = int(v.solution_value())
                if qty > 0:
                    r = next(r for r in resources if r["resource_id"] == rid)
                    output.append({
                        "incident_id": iid, "zone_id": next(i for i in incidents if i["incident_id"] == iid)["zone_id"],
                        "resource_id": rid, "resource_type": r["type"], "quantity": qty,
                        "agency_id": r["agency_id"], "status": "allocated"
                    })
            return output
    except Exception:
        pass

    # Fallback: priority-descending greedy allocation.
    output = []
    available = {r["resource_id"]: r["available_quantity"] for r in resources}
    for inc in sorted(incidents, key=lambda x: x.get("priority_score", 0), reverse=True):
        for typ, demand in inc.get("needs", {}).items():
            remaining = demand
            for r in resources:
                if remaining <= 0: break
                if r["type"] != typ or available[r["resource_id"]] <= 0: continue
                take = min(remaining, available[r["resource_id"]])
                output.append({
                    "incident_id": inc["incident_id"], "zone_id": inc["zone_id"],
                    "resource_id": r["resource_id"], "resource_type": typ, "quantity": take,
                    "agency_id": r["agency_id"], "status": "allocated"
                })
                available[r["resource_id"]] -= take
                remaining -= take
    return output
