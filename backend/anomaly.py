CRITICAL_ALERTS = {
    "glucose": {
        "critical_high": (400, "CRITICAL: Glucose above 400 mg/dL — Diabetic ketoacidosis risk"),
        "very_high": (300, "URGENT: Glucose above 300 mg/dL — Hyperglycemic crisis"),
        "high": (200, "HIGH: Fasting glucose above 200 mg/dL — Uncontrolled diabetes"),
        "critical_low": (50, "CRITICAL: Glucose below 50 mg/dL — Severe hypoglycemia"),
    },
    "hba1c": {
        "critical_high": (10, "CRITICAL: HbA1c above 10% — Severely uncontrolled diabetes"),
        "very_high": (8, "URGENT: HbA1c above 8% — Poor glycemic control"),
        "high": (6.5, "HIGH: HbA1c above 6.5% — Diabetes threshold reached"),
    },
    "bp": {
        "critical_high": (180, "CRITICAL: BP above 180 mmHg — Hypertensive crisis"),
        "very_high": (160, "URGENT: BP above 160 mmHg — Hypertensive urgency"),
        "high": (140, "HIGH: BP above 140 mmHg — Stage 2 hypertension"),
    },
    "hemoglobin": {
        "critical_low": (7, "CRITICAL: Hemoglobin below 7 g/dL — Severe anemia, transfusion may be needed"),
        "very_low": (9, "URGENT: Hemoglobin below 9 g/dL — Moderate anemia"),
        "low": (11, "HIGH: Hemoglobin below 11 g/dL — Mild anemia detected"),
    },
    "creatinine": {
        "critical_high": (3, "CRITICAL: Creatinine above 3 mg/dL — Severe kidney dysfunction"),
        "very_high": (2, "URGENT: Creatinine above 2 mg/dL — Significant kidney impairment"),
        "high": (1.3, "HIGH: Creatinine above 1.3 mg/dL — Kidney function reduced"),
    },
    "troponin": {
        "critical_high": (0.5, "CRITICAL: Troponin above 0.5 ng/mL — Acute myocardial infarction likely"),
        "very_high": (0.1, "URGENT: Troponin above 0.1 ng/mL — Cardiac injury suspected"),
        "high": (0.04, "HIGH: Troponin above 0.04 ng/mL — Cardiac stress detected"),
    },
    "cholesterol": {
        "critical_high": (300, "CRITICAL: Cholesterol above 300 mg/dL — Severe hypercholesterolemia"),
        "high": (240, "HIGH: Cholesterol above 240 mg/dL — High cardiovascular risk"),
        "borderline": (200, "WATCH: Cholesterol above 200 mg/dL — Borderline high"),
    },
    "tsh": {
        "critical_high": (10, "CRITICAL: TSH above 10 mIU/L — Overt hypothyroidism"),
        "high": (6, "URGENT: TSH above 6 mIU/L — Hypothyroidism likely"),
        "borderline": (4, "WATCH: TSH above 4 mIU/L — Borderline hypothyroidism"),
        "critical_low": (0.1, "CRITICAL: TSH below 0.1 mIU/L — Hyperthyroidism risk"),
    },
    "egfr": {
        "critical_low": (15, "CRITICAL: eGFR below 15 — Kidney failure, dialysis may be needed"),
        "very_low": (30, "URGENT: eGFR below 30 — Severe CKD Stage 4"),
        "low": (45, "HIGH: eGFR below 45 — Moderate CKD Stage 3B"),
    },
    "wbc": {
        "critical_high": (20000, "CRITICAL: WBC above 20,000 — Severe infection or leukemia risk"),
        "high": (12000, "HIGH: WBC above 12,000 — Active infection suspected"),
        "critical_low": (2000, "CRITICAL: WBC below 2,000 — Severe immunosuppression"),
    },
}

def detect_anomalies(labs: dict) -> list:
    alerts = []
    for lab_key, thresholds in CRITICAL_ALERTS.items():
        if lab_key not in labs:
            continue
        val = labs[lab_key]
        if "critical_high" in thresholds and val >= thresholds["critical_high"][0]:
            alerts.append({"lab": lab_key, "value": val, "severity": "CRITICAL", "message": thresholds["critical_high"][1], "color": "#ff0000"})
        elif "critical_low" in thresholds and val <= thresholds["critical_low"][0]:
            alerts.append({"lab": lab_key, "value": val, "severity": "CRITICAL", "message": thresholds["critical_low"][1], "color": "#ff0000"})
        elif "very_high" in thresholds and val >= thresholds["very_high"][0]:
            alerts.append({"lab": lab_key, "value": val, "severity": "URGENT", "message": thresholds["very_high"][1], "color": "#ff4466"})
        elif "very_low" in thresholds and val <= thresholds["very_low"][0]:
            alerts.append({"lab": lab_key, "value": val, "severity": "URGENT", "message": thresholds["very_low"][1], "color": "#ff4466"})
        elif "high" in thresholds and val >= thresholds["high"][0]:
            alerts.append({"lab": lab_key, "value": val, "severity": "HIGH", "message": thresholds["high"][1], "color": "#ffb800"})
        elif "low" in thresholds and val <= thresholds["low"][0]:
            alerts.append({"lab": lab_key, "value": val, "severity": "HIGH", "message": thresholds["low"][1], "color": "#ffb800"})
        elif "borderline" in thresholds and val >= thresholds["borderline"][0]:
            alerts.append({"lab": lab_key, "value": val, "severity": "WATCH", "message": thresholds["borderline"][1], "color": "#3b82f6"})

    severity_order = {"CRITICAL": 0, "URGENT": 1, "HIGH": 2, "WATCH": 3}
    alerts.sort(key=lambda x: severity_order.get(x["severity"], 4))
    return alerts