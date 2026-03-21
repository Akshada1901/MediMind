from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from parser import parse_pdf
from ner import extract_entities
from predictor import predict_risk, extract_lab_numbers
from llm import generate_summary
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

    # Step 1 — Parse PDF
    text = parse_pdf(file_bytes)
    if not text or len(text) < 50:
        return {"error": "Could not extract text from PDF. Please upload a readable medical PDF."}

    # Step 2 — Extract entities
    entities = extract_entities(text)

    # Step 3 — Predict risks
    risks = predict_risk(entities, text)

    # Step 4 — Extract lab values
    labs = extract_lab_numbers(text)

    # Step 5 — Generate summary
    summary = generate_summary(entities, risks, text)

    elapsed = round(time.time() - start, 2)

    return {
        "summary": summary,
        "entities": entities,
        "risks": risks,
        "labs": labs,
        "analysis_time": elapsed,
        "text_length": len(text)
    }

@app.get("/")
def root():
    return {"status": "MediMind API is running ✅"}

@app.get("/health")
def health():
    return {"status": "ok"}