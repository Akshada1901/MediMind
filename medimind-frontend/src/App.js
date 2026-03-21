import React, { useState } from "react";
import Upload from "./components/Upload";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);

  const steps = ["PDF Parse", "NER Extraction", "Risk Prediction", "LLM Summary", "Dashboard"];

  const animatePipeline = (onDone) => {
    let i = 0;
    setPipelineStep(0);
    const timer = setInterval(() => {
      i++;
      if (i < steps.length) setPipelineStep(i);
      else { clearInterval(timer); if (onDone) onDone(); }
    }, 500);
  };

  return (
    <div style={{ background:"#050d1f", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", color:"#e8edf8", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 8px #00e5a0} 50%{box-shadow:0 0 20px #00e5a0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* BG Grid */}
      <div style={{ position:"fixed", inset:0, zIndex:0, backgroundImage:"linear-gradient(rgba(24,71,240,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(24,71,240,0.06) 1px,transparent 1px)", backgroundSize:"48px 48px", pointerEvents:"none" }}/>
      <div style={{ position:"fixed", top:-200, left:-200, width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(24,71,240,0.18) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }}/>
      <div style={{ position:"fixed", bottom:-150, right:-150, width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,212,255,0.12) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }}/>

      <div style={{ position:"relative", zIndex:1, maxWidth:1200, margin:"0 auto", padding:"0 32px 80px" }}>

        {/* HEADER */}
        <header style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", padding:"28px 0 24px", borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom:56 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"rgba(232,237,248,0.45)" }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#00e5a0", boxShadow:"0 0 8px #00e5a0", display:"inline-block", animation:"pulse 2s infinite" }}/>
            System Online
          </div>
        </header>

        {/* HERO */}
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(52px,7vw,88px)", fontWeight:"bold", lineHeight:1.05, letterSpacing:"-3px", marginBottom:12 }}>
            Medi<span style={{ color:"#00d4ff" }}>Mind</span>
          </h1>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:10, fontWeight:600, letterSpacing:"3px", textTransform:"uppercase", color:"#00d4ff", marginBottom:24 }}>
            <span style={{ width:28, height:1, background:"#00d4ff", opacity:0.5, display:"inline-block" }}/>
            AI Clinical Intelligence Platform
            <span style={{ width:28, height:1, background:"#00d4ff", opacity:0.5, display:"inline-block" }}/>
          </div>
          <p style={{ fontSize:16, color:"rgba(232,237,248,0.5)", maxWidth:500, margin:"0 auto 40px", lineHeight:1.7 }}>
            Upload any medical PDF — our AI pipeline extracts entities, predicts disease risks, and generates doctor-ready clinical summaries instantly.
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:56 }}>
            {[["80%","Prediction Accuracy"],["70%","Time Saved"],["3s","Avg. Analysis"]].map(([n,l]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:32, color:"#00d4ff", display:"block" }}>{n}</span>
                <span style={{ fontSize:12, color:"rgba(232,237,248,0.4)" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PIPELINE */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, marginBottom:40, flexWrap:"wrap" }}>
          {steps.map((s, i) => {
            const isDone = results ? true : false;
            const isActive = loading && pipelineStep === i;
            const isPast = loading && pipelineStep > i;
            return (
              <React.Fragment key={s}>
                <div style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:"10px 18px", borderRadius:10, fontSize:13, fontWeight:500,
                  border:"1px solid", transition:"all 0.4s",
                  ...(isDone ? { background:"rgba(0,229,160,0.08)", borderColor:"rgba(0,229,160,0.3)", color:"#00e5a0" }
                    : isActive ? { background:"rgba(24,71,240,0.15)", borderColor:"rgba(24,71,240,0.4)", color:"#00d4ff" }
                    : isPast ? { background:"rgba(0,229,160,0.08)", borderColor:"rgba(0,229,160,0.3)", color:"#00e5a0" }
                    : { background:"rgba(255,255,255,0.03)", borderColor:"rgba(255,255,255,0.08)", color:"rgba(232,237,248,0.35)" })
                }}>
                  <div style={{
                    width:8, height:8, borderRadius:"50%", transition:"all 0.4s",
                    background: isDone||isPast ? "#00e5a0" : isActive ? "#00d4ff" : "rgba(255,255,255,0.1)",
                    boxShadow: isDone||isPast ? "0 0 8px #00e5a0" : isActive ? "0 0 8px #00d4ff" : "none"
                  }}/>
                  {s}
                </div>
                {i < steps.length-1 && <span style={{ padding:"0 6px", color:"rgba(255,255,255,0.12)", fontSize:16 }}>→</span>}
              </React.Fragment>
            );
          })}
        </div>

        {/* UPLOAD */}
        <Upload setResults={setResults} setLoading={setLoading} loading={loading} animatePipeline={animatePipeline} />

        {/* DASHBOARD */}
        {results && <Dashboard results={results} />}

      </div>

      <footer style={{ position:"relative", zIndex:1, textAlign:"center", padding:24, borderTop:"1px solid rgba(255,255,255,0.06)", fontSize:12, color:"rgba(232,237,248,0.25)", fontFamily:"'JetBrains Mono',monospace" }}>
        Team HACKRON · MediMind v1.0 · BioBERT + scispaCy + XGBoost + HuggingFace + Groq LLaMA
      </footer>
    </div>
  );
}