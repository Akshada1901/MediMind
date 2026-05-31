# 🧠 MediMind

MediMind is an AI-powered clinical intelligence system that analyzes patient medical reports and generates concise physician-style clinical summaries.

It combines document parsing, Named Entity Recognition (NER), disease risk prediction, and Llama 3.3 70B to extract key medical insights from unstructured reports.

> ⚠️ **Disclaimer:** MediMind is a research and educational project and does not replace professional medical diagnosis or treatment.

## ✨ Features

* 📄 Upload and analyze medical reports
* 🏷️ Extract medical entities such as conditions, medications, symptoms, and lab values
* ⚠️ Predict disease risk levels
* 🕸️ Visualize relationships between entities using a knowledge graph
* 🤖 Generate concise AI-powered clinical summaries for physicians

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Backend:** Python, FastAPI / Flask
* **LLM:** Llama 3.3-70B
* **NLP:** Named Entity Recognition (NER)
* **Visualization:** Risk Charts & Knowledge Graph

## 📁 Project Structure

```bash
medimind/
├── backend/
│   ├── main.py
│   ├── parser.py
│   ├── ner.py
│   ├── predictor.py
│   └── llm.py
│
├── medimind-frontend/
│   ├── src/components/
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend

```bash
cd medimind-frontend
npm install
npm start
```

Open `http://localhost:3000`

## 🔮 Future Improvements

* OCR support for scanned PDFs
* Export summaries as PDF
* Multi-patient dashboard
* Doctor authentication & patient record management

```
```
