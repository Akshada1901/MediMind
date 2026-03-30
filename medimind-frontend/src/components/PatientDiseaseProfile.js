import React from "react";

const COLORS = {
  bg: "#0a0f1e",
  surface: "#111827",
  card: "#1a2236",
  accent: "#6366f1",
  accentGlow: "#818cf8",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  text: "#f1f5f9",
  muted: "#94a3b8",
  border: "#1e293b",
};

function riskColor(score) {
  if (score >= 0.65) return COLORS.danger;
  if (score >= 0.35) return COLORS.warning;
  return COLORS.success;
}

function riskLabel(score) {
  if (score >= 0.65) return "HIGH";
  if (score >= 0.35) return "MEDIUM";
  return "LOW";
}

/**
 * Maps diseases (risks) to their common symptoms
 * This creates a disease-symptom mapping based on medical knowledge
 */
function getDiseaseSymptoms(disease, extractedSymptoms = []) {
  const diseaseSymptomMap = {
    "Diabetes": ["high blood sugar", "polyuria", "polydipsia", "fatigue", "blurred vision", "weight loss"],
    "Hypertension": ["elevated blood pressure", "headache", "chest pain", "shortness of breath", "dizziness"],
    "Heart Disease": ["chest pain", "shortness of breath", "palpitations", "fatigue", "sweating"],
    "Kidney Disease": ["elevated creatinine", "proteinuria", "edema", "fatigue", "nausea"],
    "Liver Disease": ["elevated ALT", "elevated AST", "jaundice", "abdominal pain", "nausea"],
    "Anemia": ["low hemoglobin", "fatigue", "weakness", "paleness", "shortness of breath"],
    "Infection": ["fever", "elevated WBC", "inflammation", "malaise", "chills"],
    "Cancer Risk": ["weight loss", "persistent symptoms", "unusual bleeding", "lumps"],
  };

  // Get predefined symptoms for the disease
  let symptoms = diseaseSymptomMap[disease] || [];

  // Filter extracted symptoms to include only relevant ones
  if (extractedSymptoms && extractedSymptoms.length > 0) {
    const lowerSymptoms = symptoms.map(s => s.toLowerCase());
    const relevantExtracted = extractedSymptoms.filter(
      (symptom) =>
        lowerSymptoms.some(
          (predefined) =>
            symptom.toLowerCase().includes(predefined) ||
            predefined.includes(symptom.toLowerCase())
        )
    );

    // Combine predefined symptoms with extracted ones (avoid duplicates)
    symptoms = [
      ...symptoms,
      ...relevantExtracted.filter(
        (s) => !symptoms.some((ps) => ps.toLowerCase() === s.toLowerCase())
      ),
    ].slice(0, 6); // Limit to 6 symptoms
  }

  return symptoms.length > 0
    ? symptoms
    : ["Common symptoms depend on severity"];
}

export default function PatientDiseaseProfile({
  risks = {},
  entities = {},
  meta = {},
}) {
  const symptoms = entities.SYMPTOM || [];
  const labValues = Object.keys(entities).length > 0 ? entities : {};

  // Sort diseases by risk score
  const sortedDiseases = Object.entries(risks)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([disease, score]) => ({
      name: disease,
      score,
      symptoms: getDiseaseSymptoms(disease, symptoms),
      label: riskLabel(score),
      color: riskColor(score),
    }));

  const highRiskDiseases = sortedDiseases.filter((d) => d.score >= 0.65);
  const mediumRiskDiseases = sortedDiseases.filter(
    (d) => d.score >= 0.35 && d.score < 0.65
  );
  const lowRiskDiseases = sortedDiseases.filter((d) => d.score < 0.35);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0" }}>
      {/* Patient Header */}
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: "24px",
          marginBottom: 28,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 20 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
              Patient Disease Profile
            </div>
            <p style={{
              color: COLORS.muted,
              fontSize: 14,
              lineHeight: 1.6,
            }}>
              Showing identified diseases with associated symptoms and risk scores
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "12px 16px",
                background: `${COLORS.danger}15`,
                border: `1px solid ${COLORS.danger}40`,
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.danger }}>
                {highRiskDiseases.length}
              </div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>
                HIGH RISK
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "12px 16px",
                background: `${COLORS.warning}15`,
                border: `1px solid ${COLORS.warning}40`,
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.warning }}>
                {mediumRiskDiseases.length}
              </div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>
                MEDIUM RISK
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "12px 16px",
                background: `${COLORS.success}15`,
                border: `1px solid ${COLORS.success}40`,
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.success }}>
                {lowRiskDiseases.length}
              </div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>
                LOW RISK
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High Risk Diseases */}
      {highRiskDiseases.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: COLORS.danger,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 14,
              paddingLeft: 4,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>🚨</span> HIGH RISK CONDITIONS
          </div>
          {highRiskDiseases.map((disease, idx) => (
            <DiseaseCard key={idx} disease={disease} />
          ))}
        </div>
      )}

      {/* Medium Risk Diseases */}
      {mediumRiskDiseases.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: COLORS.warning,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 14,
              paddingLeft: 4,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>⚠️</span> MEDIUM RISK CONDITIONS
          </div>
          {mediumRiskDiseases.map((disease, idx) => (
            <DiseaseCard key={idx} disease={disease} />
          ))}
        </div>
      )}

      {/* Low Risk Diseases */}
      {lowRiskDiseases.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: COLORS.success,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 14,
              paddingLeft: 4,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>✓</span> LOW RISK CONDITIONS
          </div>
          {lowRiskDiseases.map((disease, idx) => (
            <DiseaseCard key={idx} disease={disease} />
          ))}
        </div>
      )}
    </div>
  );
}

function DiseaseCard({ disease }) {
  return (
    <div
      style={{
        background: COLORS.card,
        border: `1px solid ${disease.color}40`,
        borderLeft: `4px solid ${disease.color}`,
        borderRadius: 12,
        padding: "20px 22px",
        marginBottom: 14,
        transition: "all 0.3s ease",
      }}
    >
      {/* Disease Name & Risk */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>
            {disease.name}
          </div>
          <p style={{ fontSize: 13, color: COLORS.muted }}>
            Risk Assessment & Associated Symptoms
          </p>
        </div>
        <div
          style={{
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: disease.color,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {Math.round(disease.score * 100)}%
          </div>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              background: `${disease.color}20`,
              color: disease.color,
              border: `1px solid ${disease.color}40`,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {disease.label} RISK
          </span>
        </div>
      </div>

      {/* Risk Score Bar */}
      <div style={{ height: 6, background: COLORS.border, borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
        <div
          style={{
            height: "100%",
            width: `${disease.score * 100}%`,
            background: `linear-gradient(90deg, ${disease.color}80, ${disease.color})`,
            borderRadius: 3,
            transition: "width 0.8s ease",
          }}
        />
      </div>

      {/* Symptoms Section */}
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: COLORS.accentGlow,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 14 }}>🔬</span> Associated Symptoms
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {disease.symptoms.map((symptom, idx) => (
            <span
              key={idx}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 13,
                background: `${disease.color}12`,
                border: `1px solid ${disease.color}30`,
                color: COLORS.text,
                whiteSpace: "nowrap",
              }}
            >
              {symptom}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
