import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_summary(entities: dict, risks: list, text: str) -> str:
    entity_text = ""
    for label, values in entities.items():
        entity_text += f"{label}: {', '.join(values[:5])}\n"

    risk_text = ""
    for r in risks[:5]:
        risk_text += f"- {r['disease']}: {r['probability']*100:.0f}% ({r['risk']} Risk)\n"

    snippet = text[:800] if len(text) > 800 else text

    prompt = f"""You are a senior clinical AI assistant analyzing a patient medical report.

Extracted Medical Entities:
{entity_text}

Disease Risk Assessment:
{risk_text}

Document Excerpt:
{snippet}

Write a concise professional 3-4 sentence clinical summary for a physician.
Mention critical findings first, note high-risk conditions, suggest next steps.
Be factual and clinical. No bullet points."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=350,
        temperature=0.3
    )
    return response.choices[0].message.content