import json
import os
from datetime import datetime

HISTORY_FILE = "patient_history.json"

def load_history() -> list:
    if not os.path.exists(HISTORY_FILE):
        return []
    with open(HISTORY_FILE, "r") as f:
        return json.load(f)

def save_analysis(filename: str, risks: list, labs: dict, summary: str):
    history = load_history()
    entry = {
        "filename": filename,
        "timestamp": datetime.now().isoformat(),
        "risks": risks,
        "labs": labs,
        "summary": summary[:200]
    }
    history.append(entry)
    history = history[-10:]
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f)

def get_comparison(current_risks: list, current_labs: dict) -> dict:
    history = load_history()
    if len(history) < 1:
        return None
    previous = history[-1]
    prev_risks = {r["disease"]: r["probability"] for r in previous["risks"]}
    curr_risks = {r["disease"]: r["probability"] for r in current_risks}
    risk_changes = []
    for disease, curr_prob in curr_risks.items():
        prev_prob = prev_risks.get(disease, curr_prob)
        change = curr_prob - prev_prob
        risk_changes.append({
            "disease": disease, "current": curr_prob,
            "previous": prev_prob, "change": round(change, 2),
            "trend": "Worsening" if change > 0.05 else "Improving" if change < -0.05 else "Stable"
        })
    lab_changes = {}
    for lab, curr_val in current_labs.items():
        if lab in previous.get("labs", {}):
            prev_val = previous["labs"][lab]
            lab_changes[lab] = {"current": curr_val, "previous": prev_val, "change": round(curr_val - prev_val, 2)}
    return {
        "previous_date": previous["timestamp"][:10],
        "previous_file": previous["filename"],
        "risk_changes": risk_changes,
        "lab_changes": lab_changes
    }