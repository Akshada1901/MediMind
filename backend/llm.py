import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_summary(entities: dict, risks: list, text: str, anomalies: list = []) -> str:
    entity_text = ""
    for label, values in entities.items():
        entity_text += f"{label}: {', '.join(values[:5])}\n"

    risk_text = ""
    for r in risks[:5]:
        risk_text += f"- {r['disease']}: {r['probability']*100:.0f}% ({r['risk']} Risk)\n"

    critical_alerts = [a for a in anomalies if a["severity"] == "CRITICAL"]
    urgent_alerts = [a for a in anomalies if a["severity"] == "URGENT"]

    alert_text = ""
    if critical_alerts:
        alert_text += "CRITICAL ALERTS:\n"
        for a in critical_alerts:
            alert_text += f"- {a['message']}\n"
    if urgent_alerts:
        alert_text += "URGENT FINDINGS:\n"
        for a in urgent_alerts:
            alert_text += f"- {a['message']}\n"

    snippet = text[:800] if len(text) > 800 else text

    prompt = f"""You are a senior clinical AI assistant analyzing a patient medical report.

{f'CRITICAL AND URGENT ALERTS (mention these first):{chr(10)}{alert_text}' if alert_text else ''}

Extracted Medical Entities:
{entity_text}

Disease Risk Assessment:
{risk_text}

Document Excerpt:
{snippet}

Instructions:
- Write a professional 4-5 sentence clinical summary for a physician
- If there are critical alerts mention them in the FIRST sentence
- Mention high-risk conditions and their implications
- Suggest immediate next steps and referrals
- Be factual clinical and concise
- Do not use bullet points"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=400,
        temperature=0.2
    )
    return response.choices[0].message.content