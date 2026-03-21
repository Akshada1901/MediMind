# MediMind — AI Clinical Intelligence Platform
Team HACKRON | Hackstreet 4.0

## Setup & Run

### Backend
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd medimind-frontend
npm install
npm start
```

## Tech Stack
- React.js, FastAPI, Python 3.11
- scispaCy, XGBoost, Groq LLaMA 3.3 70B
- PyMuPDF, Recharts, SVG Knowledge Graph
