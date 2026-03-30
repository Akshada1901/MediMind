import React, { useState } from "react";
import axios from "axios";

export default function Upload({ setResults, setLoading, loading, animatePipeline }) {
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const analyze = async (file) => {
    setError("");
    setFileName(file.name);
    setLoading(true);
    setResults(null);
    const formData = new FormData();
    formData.append("file", file);
    animatePipeline(null);
    try {
      const res = await axios.post("http://localhost:8000/analyze", formData, { timeout: 60000 });
      setResults(res.data);
    } catch (err) {
      setError("Backend error. Make sure FastAPI is running on port 8000.");
    }
    setLoading(false);
  };

  const handleFile = (e) => { const file = e.target.files[0]; if (file) analyze(file); };
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") analyze(file);
    else setError("Please upload a PDF file only.");
  };

  return (
    <div style={{ marginBottom: 40 }}>
      <div
        onClick={() => !loading && document.getElementById("fileInput").click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? "#00d4ff" : loading ? "rgba(24,71,240,0.6)" : "rgba(24,71,240,0.35)"}`,
          borderRadius: 24, padding: "52px 40px", textAlign: "center",
          background: dragOver ? "rgba(0,212,255,0.04)" : "rgba(255,255,255,0.02)",
          cursor: loading ? "wait" : "pointer", transition: "all 0.3s", marginBottom: 16
        }}
      >
        <div style={{ width: 72, height: 72, borderRadius: 20, margin: "0 auto 20px", background: "linear-gradient(135deg,rgba(24,71,240,0.3),rgba(0,212,255,0.2))", border: "1px solid rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
          {loading ? "⏳" : "📄"}
        </div>
        <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24, marginBottom: 8 }}>
          {loading ? "AI Pipeline Running..." : dragOver ? "Drop it here!" : "Upload Medical PDF Report"}
        </div>
        <div style={{ fontSize: 14, color: "rgba(232,237,248,0.4)", marginBottom: 28 }}>
          {loading ? "Extracting entities → Predicting risks → Generating summary..."
            : "Drag & drop or click to upload any medical PDF"}
        </div>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(0,212,255,0.2)", borderTop: "3px solid #00d4ff", animation: "spin 1s linear infinite" }}/>
            <span style={{ fontSize: 13, color: "#00d4ff", fontFamily: "'JetBrains Mono',monospace" }}>Processing with BioBERT + Groq LLaMA...</span>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); document.getElementById("fileInput").click(); }}
            style={{ background: "linear-gradient(135deg,#1847f0,#0f3dd4)", color: "white", border: "none", padding: "14px 36px", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
          >
            ⬆ Choose Medical PDF
          </button>
        )}
        <div style={{ marginTop: 20, fontSize: 12, color: "rgba(232,237,248,0.25)", fontFamily: "'JetBrains Mono',monospace" }}>
          PDF only · Max 50MB · Processed locally
        </div>
        <input id="fileInput" type="file" accept=".pdf" onChange={handleFile} style={{ display: "none" }}/>
      </div>

      {fileName && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 16px", width: "fit-content", margin: "0 auto", fontSize: 13, fontFamily: "'JetBrains Mono',monospace", color: "rgba(232,237,248,0.5)" }}>
          📎 {fileName}
          {loading && <span style={{ color: "#00d4ff", marginLeft: 8 }}>● Analyzing</span>}
        </div>
      )}
      {error && (
        <div style={{ marginTop: 16, padding: "12px 20px", borderRadius: 10, background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.2)", color: "#ff4466", fontSize: 13, textAlign: "center" }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
}