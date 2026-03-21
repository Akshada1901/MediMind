🧠 MediMind

An AI-powered clinical intelligence system that analyzes patient medical reports using NLP, Named Entity Recognition, disease risk prediction, and a large language model (Llama 3.3-70B) to generate physician-grade clinical summaries.
📌 About
MediMind is a full-stack clinical AI assistant that goes beyond simple Q&A. It processes uploaded medical documents through a multi-stage AI pipeline — extracting medical entities via NER, assessing disease risks, building a knowledge graph, and generating concise clinical summaries using the Llama 3.3-70B language model with domain-specific prompt engineering.
The output is a professional 3–4 sentence clinical summary written for physicians, prioritizing critical findings and next steps — not generic health advice.

⚠️ Disclaimer: MediMind is a research and educational project. It does not replace professional medical diagnosis or treatment.


✨ Features
🔬 AI / NLP Pipeline

📄 Document Parser — Ingests and preprocesses uploaded patient medical reports
🏷️ Named Entity Recognition (NER) — Extracts medical entities (conditions, medications, lab values, symptoms) from unstructured text
⚠️ Disease Risk Predictor — Assesses patient risk levels based on extracted entities
🕸️ Knowledge Graph — Builds a visual graph of relationships between medical entities
🤖 LLM Summary Generation — Uses Llama 3.3-70B-Versatile to generate physician-grade clinical summaries with structured prompt engineering

🖥️ Frontend Dashboard

📤 Document Upload — Upload patient medical reports for analysis
📊 Risk Chart — Visual representation of identified disease risks
🕸️ Knowledge Graph Viewer — Interactive graph of medical entity relationships
📋 Clinical Summary Panel — Displays AI-generated physician summary


🏗️ Architecture
Medical Report (PDF/Text)
        │
        ▼
  [ parser.py ]         → Cleans and chunks the document
        │
        ▼
  [ ner.py ]            → Extracts medical entities (NER)
        │
        ▼
  [ predictor.py ]      → Disease risk assessment
        │
        ▼
  [ llm.py ]            → Llama 3.3-70B generates clinical summary
        │
        ▼
  React Frontend        → Dashboard, RiskChart, KnowledgeGraph

🛠️ Tech Stack
LayerTechnologyFrontendReact.js, JavaScriptBackendPython, FastAPI / FlaskLLMLlama 3.3-70B-VersatileNLPNamed Entity Recognition (NER)VisualizationKnowledge Graph (KnowledgeGraph.js), Risk Chart (RiskChart.js)Document ProcessingCustom parser pipeline

📁 Project Structure
medimind/
├── backend/
│   ├── main.py            # API entry point
│   ├── parser.py          # Medical document parser
│   ├── ner.py             # Named Entity Recognition pipeline
│   ├── predictor.py       # Disease risk predictor
│   ├── llm.py             # Llama 3.3-70B integration & prompt engineering
│   └── requirements.txt
│
├── medimind-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js       # Main clinical dashboard
│   │   │   ├── KnowledgeGraph.js  # Entity relationship graph
│   │   │   ├── RiskChart.js       # Disease risk visualization
│   │   │   └── Upload.js          # Document upload interface
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md

🚀 Getting Started
Prerequisites

Python 3.9+
Node.js 16+
API access to Llama 3.3-70B (e.g., via Groq or Together AI)

Installation
bash# 1. Clone the repository
git clone https://github.com/Asyasshri/medimind.git
cd medimind
Backend Setup
bashcd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt

# Set your LLM API key in .env
echo "GROQ_API_KEY=your_api_key_here" > .env

# Start the backend
python main.py
Frontend Setup
bashcd medimind-frontend
npm install
npm start
Open your browser at http://localhost:3000

🔬 LLM Prompt Design
MediMind uses structured clinical prompt engineering to guide Llama 3.3-70B:
You are a senior clinical AI assistant analyzing a patient medical report.

Extracted Medical Entities: {entity_text}
Disease Risk Assessment:    {risk_text}
Document Excerpt:           {snippet}

Write a concise professional 3-4 sentence clinical summary for a physician.
Mention critical findings first, note high-risk conditions, suggest next steps.
Be factual and clinical. No bullet points.
The model runs at temperature=0.3 for factual, consistent clinical output.

📸 Screenshots

Add screenshots of the dashboard, knowledge graph, risk chart, and clinical summary here


🔮 Future Improvements

 Support PDF parsing for scanned reports (OCR)
 Add multi-patient comparison dashboard
 Fine-tune NER model on medical datasets (e.g., MIMIC-III)
 Export clinical summary as PDF report
 Add doctor authentication and patient record management


👩‍💻 Author
Asyas Shri
B.Tech CSE — SRM University (2024–2028)
LinkedIn • GitHub

📄 License
This project is open source and available under the MIT License.
