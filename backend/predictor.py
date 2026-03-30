import re
import numpy as np

DISEASES = [
    "Diabetes", "Hypertension", "Heart Disease",
    "Anemia", "Kidney Disease", "Dyslipidemia",
    "Hypothyroidism", "Infection"
]

NORMAL_RANGES = {
    "glucose": (70, 105), "hba1c": (0, 6.1),
    "hemoglobin": (11.5, 17.5), "creatinine": (0.7, 1.29),
    "cholesterol": (0, 209), "ldl": (0, 129),
    "triglycerides": (0, 159), "troponin": (0, 0.04),
    "tsh": (0.4, 4.4), "wbc": (4500, 11499),
    "egfr": (41, 999), "bp": (0, 144),
}

CRITICAL = {
    "glucose": (200, 999), "hba1c": (9.0, 999),
    "hemoglobin": (0, 8.0), "creatinine": (1.8, 999),
    "cholesterol": (260, 999), "ldl": (180, 999),
    "triglycerides": (220, 999), "troponin": (0.04, 999),
    "tsh": (7.0, 999), "wbc": (14000, 999999),
    "egfr": (0, 40), "bp": (170, 999),
}

BORDERLINE = {
    "glucose": (106, 199), "hba1c": (6.2, 8.9),
    "hemoglobin": (9.1, 11.4), "creatinine": (1.3, 1.79),
    "cholesterol": (210, 259), "ldl": (130, 179),
    "triglycerides": (160, 219), "tsh": (4.5, 6.9),
    "wbc": (11500, 13999), "bp": (145, 169),
}

DISEASE_LABS = {
    "Diabetes": ["glucose", "hba1c"],
    "Hypertension": ["bp"],
    "Heart Disease": ["troponin"],
    "Anemia": ["hemoglobin"],
    "Kidney Disease": ["creatinine", "egfr"],
    "Dyslipidemia": ["cholesterol", "ldl", "triglycerides"],
    "Hypothyroidism": ["tsh"],
    "Infection": ["wbc"],
}

DIAGNOSIS_PHRASES = {
    "Diabetes": ["type 2 diabetes", "type 1 diabetes", "diabetic", "uncontrolled diabetes", "diabetes mellitus"],
    "Hypertension": ["hypertension stage", "hypertensive urgency", "hypertensive crisis", "essential hypertension"],
    "Heart Disease": ["coronary artery disease", "nstemi", "heart attack", "angina", "ischemic heart"],
    "Anemia": ["iron deficiency anemia", "normocytic anemia", "microcytic anemia", "severe anemia"],
    "Kidney Disease": ["chronic kidney disease", "ckd stage", "renal failure", "nephritis", "dialysis", "diabetic nephropathy"],
    "Dyslipidemia": ["dyslipidemia diagnosed", "mixed dyslipidemia", "hyperlipidemia"],
    "Hypothyroidism": ["hypothyroidism", "subclinical hypothyroidism"],
    "Infection": ["sepsis", "septicemia", "pneumonia diagnosed", "bacterial infection"],
}

DISEASE_MEDS = {
    "Diabetes": ["insulin glargine", "metformin", "glipizide", "sitagliptin"],
    "Hypertension": ["amlodipine", "losartan", "telmisartan", "lisinopril", "labetalol"],
    "Heart Disease": ["nitroglycerin", "clopidogrel", "warfarin", "metoprolol"],
    "Anemia": ["ferrous sulfate", "erythropoietin", "iron supplement"],
    "Kidney Disease": ["furosemide", "bicarbonate"],
    "Dyslipidemia": ["atorvastatin", "rosuvastatin", "fenofibrate"],
    "Hypothyroidism": ["levothyroxine", "thyroxine", "synthroid"],
    "Infection": ["amoxicillin", "azithromycin", "ciprofloxacin", "ceftriaxone"],
}

def extract_lab_numbers(text: str) -> dict:
    text_lower = text.lower()
    labs = {}
    patterns = {
        "glucose": [r'fasting\s+blood\s+glucose[:\s]+(\d+\.?\d*)', r'fasting\s+glucose[:\s]+(\d+\.?\d*)', r'blood\s+glucose[:\s]+(\d+\.?\d*)', r'glucose[:\s]+(\d+\.?\d*)'],
        "hba1c": [r'hba1c[:\s]+(\d+\.?\d*)', r'glycated\s+hemoglobin[:\s]+(\d+\.?\d*)', r'a1c[:\s]+(\d+\.?\d*)'],
        "hemoglobin": [r'hemoglobin[:\s]+(\d+\.?\d*)', r'haemoglobin[:\s]+(\d+\.?\d*)', r'\bhb\b[:\s]+(\d+\.?\d*)'],
        "creatinine": [r'serum\s+creatinine[:\s]+(\d+\.?\d*)', r'creatinine[:\s]+(\d+\.?\d*)'],
        "cholesterol": [r'total\s+cholesterol[:\s]+(\d+\.?\d*)', r'cholesterol[:\s]+(\d+\.?\d*)'],
        "ldl": [r'ldl\s+cholesterol[:\s]+(\d+\.?\d*)', r'ldl[:\s]+(\d+\.?\d*)'],
        "hdl": [r'hdl\s+cholesterol[:\s]+(\d+\.?\d*)', r'hdl[:\s]+(\d+\.?\d*)'],
        "triglycerides": [r'triglycerides[:\s]+(\d+\.?\d*)', r'triglyceride[:\s]+(\d+\.?\d*)'],
        "troponin": [r'troponin\s+i[:\s]+(\d+\.?\d*)', r'troponin[:\s]+(\d+\.?\d*)'],
        "tsh": [r'tsh[:\s]+(\d+\.?\d*)', r'thyroid\s+stimulating\s+hormone[:\s]+(\d+\.?\d*)'],
        "wbc": [r'white\s+blood\s+count[:\s]+(\d+[\d,]*)', r'white\s+blood\s+cell[:\s]+(\d+[\d,]*)', r'wbc[:\s]+(\d+[\d,]*)'],
        "egfr": [r'egfr[:\s]+(\d+\.?\d*)', r'estimated\s+gfr[:\s]+(\d+\.?\d*)'],
        "bp": [r'blood\s+pressure[:\s]+(\d+)[/\s]', r'\bbp\b[:\s]+(\d+)[/\s]'],
        "vitamin_d": [r'vitamin\s+d[:\s]+(\d+\.?\d*)'],
        "bmi": [r'bmi[:\s]+(\d+\.?\d*)'],
        "ferritin": [r'ferritin[:\s]+(\d+\.?\d*)'],
        "b12": [r'vitamin\s+b12[:\s]+(\d+\.?\d*)', r'b12[:\s]+(\d+\.?\d*)'],
    }
    for key, pattern_list in patterns.items():
        for pattern in pattern_list:
            match = re.search(pattern, text_lower)
            if match:
                try:
                    labs[key] = float(match.group(1).replace(",", ""))
                    break
                except:
                    continue
    return labs

def get_lab_status(lab_key: str, value: float) -> str:
    if lab_key in CRITICAL:
        low, high = CRITICAL[lab_key]
        if lab_key in ["hemoglobin", "egfr"]:
            if value <= high:
                return "critical"
        else:
            if value >= low:
                return "critical"
    if lab_key in BORDERLINE:
        low, high = BORDERLINE[lab_key]
        if lab_key == "hemoglobin":
            if low <= value <= high:
                return "borderline"
        else:
            if low <= value <= high:
                return "borderline"
    if lab_key in NORMAL_RANGES:
        low, high = NORMAL_RANGES[lab_key]
        if lab_key in ["egfr", "hemoglobin"]:
            if value >= low:
                return "normal"
        else:
            if low <= value <= high:
                return "normal"
    return "unknown"

def check_negation_in_text(disease: str, text: str) -> bool:
    text_lower = text.lower()
    disease_lower = disease.lower()
    negation_patterns = [
        f"no {disease_lower}", f"no history of {disease_lower}",
        f"no evidence of {disease_lower}", f"not {disease_lower}",
        f"rules out {disease_lower}", f"{disease_lower} ruled out",
        f"no known {disease_lower}",
    ]
    return any(p in text_lower for p in negation_patterns)

def predict_risk(entities: dict, text: str) -> list:
    text_lower = text.lower()
    labs = extract_lab_numbers(text)
    diseases_found = [d.lower() for d in entities.get("DISEASE", [])]
    results = []

    for disease in DISEASES:
        score = 0.08

        if check_negation_in_text(disease, text):
            results.append({"disease": disease, "probability": 0.08, "risk": "Low"})
            continue

        relevant_labs = DISEASE_LABS.get(disease, [])
        lab_statuses = {}
        for lab_key in relevant_labs:
            if lab_key in labs:
                lab_statuses[lab_key] = get_lab_status(lab_key, labs[lab_key])

        has_critical = any(s == "critical" for s in lab_statuses.values())
        has_borderline = any(s == "borderline" for s in lab_statuses.values())
        all_normal = len(lab_statuses) > 0 and all(s == "normal" for s in lab_statuses.values())
        no_labs = len(lab_statuses) == 0
        critical_count = sum(1 for s in lab_statuses.values() if s == "critical")
        borderline_count = sum(1 for s in lab_statuses.values() if s == "borderline")

        if has_critical:
            score = 0.70 + min(critical_count * 0.08, 0.25)
        elif has_borderline:
            score = 0.38 + min(borderline_count * 0.08, 0.20)
        elif all_normal:
            score = 0.10

        diagnosis_phrases = DIAGNOSIS_PHRASES.get(disease, [])
        confirmed = any(phrase in text_lower for phrase in diagnosis_phrases)
        if confirmed:
            if has_critical:
                score = min(score + 0.08, 0.97)
            elif has_borderline:
                score = min(score + 0.10, 0.64)
            elif all_normal:
                score = max(score, 0.36)
            else:
                score = max(score, 0.42)

        disease_meds = DISEASE_MEDS.get(disease, [])
        med_confirmed = any(m in text_lower for m in disease_meds)
        if med_confirmed:
            if has_critical or confirmed:
                score = min(score + 0.04, 0.97)
            elif has_borderline:
                score = min(score + 0.06, 0.64)
            elif no_labs and not confirmed:
                score = min(score + 0.10, 0.42)

        entity_match = any(disease.lower() in d or d in disease.lower() for d in diseases_found)
        if entity_match and not confirmed and not has_critical:
            score = min(score + 0.06, 0.52)

        if no_labs and not confirmed and not med_confirmed and not entity_match:
            score = 0.08

        score = round(float(np.clip(score, 0.05, 0.97)), 2)
        risk = "High" if score >= 0.65 else "Medium" if score >= 0.35 else "Low"
        results.append({"disease": disease, "probability": score, "risk": risk})

    results.sort(key=lambda x: x["probability"], reverse=True)
    return results