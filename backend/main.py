from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from parser import parse_pdf
from ner import extract_entities
from predictor import predict_risk, extract_lab_numbers
from llm import generate_summary
from anomaly import detect_anomalies
from history import save_analysis, get_comparison
import time

app = FastAPI(title="MediMind API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    start = time.time()
    file_bytes = await file.read()
    text = parse_pdf(file_bytes)
    if not text or len(text) < 50:
        return {"error": "Could not extract text from PDF."}
    entities = extract_entities(text)
    risks = predict_risk(entities, text)
    labs = extract_lab_numbers(text)
    anomalies = detect_anomalies(labs)
    comparison = get_comparison(risks, labs)
    summary = generate_summary(entities, risks, text, anomalies)
    save_analysis(file.filename or "report.pdf", risks, labs, summary)
    elapsed = round(time.time() - start, 2)
    return {
        "summary": summary,
        "entities": entities,
        "risks": risks,
        "labs": labs,
        "anomalies": anomalies,
        "comparison": comparison,
        "analysis_time": elapsed,
        "text_length": len(text)
    }

@app.get("/")
def root():
    return {"status": "MediMind API Running"}

@app.get("/health")
def health():
    return {"status": "ok"}