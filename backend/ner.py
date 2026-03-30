import spacy
import re

nlp = spacy.load("en_core_sci_sm")

DISEASE_KEYWORDS = [
    "diabetes", "hypertension", "anemia", "infection", "heart disease",
    "kidney disease", "cancer", "pneumonia", "asthma", "hypothyroid",
    "dyslipidemia", "obesity", "stroke", "arthritis", "depression",
    "hyperglycemia", "hyperlipidemia", "coronary", "nstemi", "ckd",
    "metabolic syndrome", "pre-diabetes"
]

DRUG_KEYWORDS = [
    "metformin", "insulin", "insulin glargine", "amlodipine", "losartan",
    "atorvastatin", "aspirin", "furosemide", "telmisartan", "rosuvastatin",
    "lisinopril", "erythropoietin", "ferrous sulfate", "omega-3", "omega",
    "metoprolol", "warfarin", "vitamin d3", "vitamin d", "multivitamin",
    "b-complex", "vitamin b12", "iron supplement", "calcium", "levothyroxine",
    "thyroxine", "synthroid", "clopidogrel", "nitroglycerin", "fenofibrate",
    "azithromycin", "amoxicillin", "ciprofloxacin", "ceftriaxone",
    "labetalol", "enalapril", "glipizide", "sitagliptin", "bicarbonate"
]

LAB_PATTERN = re.compile(
    r'(HbA1c|Hba1c|hba1c|'
    r'fasting\s+blood\s+glucose|fasting\s+glucose|blood\s+glucose|glucose|'
    r'hemoglobin|haemoglobin|'
    r'serum\s+creatinine|creatinine|'
    r'total\s+cholesterol|cholesterol|'
    r'LDL\s+cholesterol|LDL|'
    r'HDL\s+cholesterol|HDL|'
    r'triglycerides|triglyceride|'
    r'TSH|tsh|'
    r'eGFR|egfr|'
    r'troponin\s+I|troponin|'
    r'white\s+blood\s+count|white\s+blood\s+cell|WBC|wbc|'
    r'blood\s+pressure|BP|bp|'
    r'heart\s+rate|pulse|'
    r'BMI|bmi|'
    r'vitamin\s+D|Vitamin\s+D|'
    r'vitamin\s+B12|Vitamin\s+B12|'
    r'ferritin|uric\s+acid|'
    r'sodium|potassium|ALT|AST|bilirubin)'
    r'\s*[:\-]?\s*(\d+\.?\d*)\s*'
    r'(mg/dL|g/dL|%|mIU/L|ng/mL|mmHg|kg/m2|/uL|bpm|pg/mL|cm|IU|mEq/L|U/L)?',
    re.IGNORECASE
)

SYMPTOM_KEYWORDS = [
    "polyuria", "polydipsia", "blurred vision", "breathlessness",
    "palpitations", "bilateral swelling", "profuse sweating",
    "loss of consciousness", "occipital headache", "chest tightness",
    "shortness of breath", "dizziness on standing", "joint pain",
    "weight gain", "afternoon fatigue", "numbness in feet",
    "chest pain", "near syncope", "syncope"
]

FINDING_KEYWORDS = [
    "well-nourished", "regular rate and rhythm",
    "clear bilateral breath sounds", "normal reflexes",
    "no organomegaly", "soft non-tender"
]

RECOMMENDATION_KEYWORDS = [
    "morning sunlight", "7-8 hours sleep", "30 minutes",
    "45 minutes", "mediterranean diet", "lifestyle modification",
    "dash diet", "sodium restriction", "brisk walking"
]

NEGATION_WORDS = [
    "no ", "not ", "without ", "denies ", "absent", "negative for",
    "no history of", "no complaints of", "no evidence of",
    "ruled out", "excluded", "non-diabetic", "non-hypertensive"
]

def is_negated(sentence: str, keyword: str) -> bool:
    sent_lower = sentence.lower()
    if keyword not in sent_lower:
        return False
    keyword_pos = sent_lower.find(keyword)
    context = sent_lower[max(0, keyword_pos - 60): keyword_pos]
    return any(neg in context for neg in NEGATION_WORDS)

def extract_entities(text: str) -> dict:
    text_lower = text.lower()
    entities = {
        "DISEASE": [], "MEDICATION": [], "LAB_VALUE": [],
        "SYMPTOM": [], "CLINICAL_FINDINGS": [], "RECOMMENDATIONS": []
    }

    doc = nlp(text)
    for ent in doc.ents:
        label = ent.label_
        val = ent.text.strip()
        if len(val) < 3:
            continue
        if label in ("DISEASE", "CONDITION"):
            if val not in entities["DISEASE"]:
                entities["DISEASE"].append(val)
        elif label in ("CHEMICAL", "DRUG"):
            if val not in entities["MEDICATION"]:
                entities["MEDICATION"].append(val)

    for kw in DISEASE_KEYWORDS:
        if kw in text_lower:
            display = kw.title()
            if display not in entities["DISEASE"]:
                entities["DISEASE"].append(display)

    for kw in DRUG_KEYWORDS:
        if kw in text_lower:
            display = kw.title()
            if display not in entities["MEDICATION"]:
                entities["MEDICATION"].append(display)

    matches = LAB_PATTERN.findall(text)
    for name, value, unit in matches:
        entry = f"{name.strip()}: {value.strip()}{(' ' + unit.strip()) if unit.strip() else ''}"
        if entry not in entities["LAB_VALUE"] and value.strip():
            entities["LAB_VALUE"].append(entry)

    specific_patterns = [
        (r'vitamin\s*d[:\s]+(\d+\.?\d*)', "Vitamin D"),
        (r'bmi[:\s]+(\d+\.?\d*)', "BMI"),
        (r'ferritin[:\s]+(\d+\.?\d*)', "Ferritin"),
        (r'(?:vitamin\s*)?b12[:\s]+(\d+\.?\d*)', "Vitamin B12"),
    ]
    for pattern, label in specific_patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            entry = f"{label}: {m.group(1).strip()}"
            if entry not in entities["LAB_VALUE"]:
                entities["LAB_VALUE"].append(entry)

    sentences = re.split(r'[.;]', text)
    for sentence in sentences:
        for kw in SYMPTOM_KEYWORDS:
            if kw in sentence.lower() and not is_negated(sentence, kw):
                display = kw.title()
                if display not in entities["SYMPTOM"]:
                    entities["SYMPTOM"].append(display)

    for kw in FINDING_KEYWORDS:
        if kw in text_lower:
            if kw.title() not in entities["CLINICAL_FINDINGS"]:
                entities["CLINICAL_FINDINGS"].append(kw.title())

    for kw in RECOMMENDATION_KEYWORDS:
        if kw in text_lower:
            if kw.title() not in entities["RECOMMENDATIONS"]:
                entities["RECOMMENDATIONS"].append(kw.title())

    entities = {k: v for k, v in entities.items() if v}
    return entities