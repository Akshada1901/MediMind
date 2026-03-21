import KnowledgeGraph from "./KnowledgeGraph";
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  PieChart, Pie, Legend
} from "recharts";

const getRiskColor = (risk) =>
  risk === "High" ? "#ff4466" : risk === "Medium" ? "#ffb800" : "#00e5a0";

const card = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 20, padding: 28, marginBottom: 20
};

const sectionLabel = {
  fontSize: 11, fontWeight: 600, letterSpacing: "2px",
  textTransform: "uppercase", color: "rgba(232,237,248,0.4)",
  marginBottom: 16
};

export default function Dashboard({ results }) {
  const { entities, risks, summary, labs, analysis_time } = results;
  const totalEntities = Object.values(entities || {}).flat().length;
  const topRisk = (risks || [])[0];
  const highRisks = (risks || []).filter(r => r.risk === "High").length;
  const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  // Radar data
  const radarData = (risks || []).slice(0, 6).map(r => ({
    subject: r.disease,
    value: Math.round(r.probability * 100)
  }));

  // Pie data
  const riskCounts = {
    High: (risks || []).filter(r => r.risk === "High").length,
    Medium: (risks || []).filter(r => r.risk === "Medium").length,
    Low: (risks || []).filter(r => r.risk === "Low").length,
  };
  const pieData = Object.entries(riskCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value, fill: getRiskColor(name) }));

  return (
    <div style={{ animation: "fadeUp 0.6s ease" }}>

      {/* ── SUMMARY ── */}
      <div style={{ ...sectionLabel }}>🤖 AI Clinical Summary</div>
      <div style={{
        background: "linear-gradient(135deg,rgba(24,71,240,0.12),rgba(0,212,255,0.06))",
        border: "1px solid rgba(24,71,240,0.25)",
        borderRadius: 20, padding: "32px 36px", marginBottom: 28,
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#1847f0,#00d4ff)" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"rgba(0,212,255,0.15)", border:"1px solid rgba(0,212,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🧠</div>
          <span style={{ fontWeight:600, fontSize:15 }}>MediMind Clinical Assessment</span>
          <span style={{ marginLeft:"auto", fontSize:12, color:"rgba(232,237,248,0.35)", fontFamily:"'JetBrains Mono',monospace" }}>{now}</span>
        </div>
        <p style={{ fontSize:15, lineHeight:1.85, color:"rgba(232,237,248,0.82)", fontStyle:"italic" }}>{summary}</p>
      </div>

      {/* ── METRICS ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {[
          [totalEntities, "Entities Extracted", "#00d4ff"],
          [topRisk ? `${(topRisk.probability*100).toFixed(0)}%` : "—", "Top Risk Score", "#ff4466"],
          [highRisks, "High Risk Conditions", "#ffb800"],
          [`${analysis_time || "—"}s`, "Analysis Time", "#00e5a0"],
        ].map(([val, label, color]) => (
          <div key={label} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:24, textAlign:"center" }}>
            <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:34, color, display:"block", marginBottom:4 }}>{val}</span>
            <span style={{ fontSize:12, color:"rgba(232,237,248,0.4)" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── RISK + ENTITIES ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>

        {/* Risk Bars */}
        <div style={card}>
          <div style={sectionLabel}>🎯 Disease Risk Prediction</div>
          {(risks || []).map((r) => {
            const pct = (r.probability * 100).toFixed(0);
            const color = getRiskColor(r.risk);
            return (
              <div key={r.disease} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <span style={{ fontSize:14, fontWeight:500 }}>{r.disease}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color }}>{pct}%</span>
                    <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, color, background:`${color}18` }}>{r.risk}</span>
                  </div>
                </div>
                <div style={{ height:6, borderRadius:3, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:3, width:`${pct}%`, background:color, transition:"width 1.2s cubic-bezier(0.22,1,0.36,1)" }}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* Entities */}
        <div style={card}>
          <div style={sectionLabel}>🔬 Extracted Medical Entities</div>
          {Object.entries(entities || {}).map(([label, values]) => (
            <div key={label} style={{ marginBottom:16 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(232,237,248,0.35)", marginBottom:8 }}>{label}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {values.slice(0, 7).map((v) => (
                  <span key={v} style={{ fontSize:12, padding:"5px 11px", borderRadius:8, border:"1px solid rgba(0,212,255,0.2)", background:"rgba(0,212,255,0.06)", color:"#00d4ff", fontFamily:"'JetBrains Mono',monospace" }}>{v}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CHARTS ── */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20, marginBottom:20 }}>

        {/* Bar Chart */}
        <div style={card}>
          <div style={sectionLabel}>📊 Risk Probability Distribution</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={risks} margin={{ top:10, right:20, left:0, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="disease" tick={{ fill:"#8899aa", fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${(v*100).toFixed(0)}%`} tick={{ fill:"#8899aa", fontSize:11 }} axisLine={false} tickLine={false} domain={[0,1]} />
              <Tooltip
                contentStyle={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#e8edf8", fontSize:13 }}
                formatter={v => [`${(v*100).toFixed(0)}%`, "Probability"]}
              />
              <Bar dataKey="probability" radius={[6,6,0,0]}>
                {(risks||[]).map((entry, i) => (
                  <Cell key={i} fill={getRiskColor(entry.risk)} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={card}>
          <div style={sectionLabel}>🥧 Risk Distribution</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData} cx="50%" cy="45%"
                outerRadius={80} innerRadius={45}
                dataKey="value" paddingAngle={4}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#e8edf8", fontSize:13 }} />
              <Legend wrapperStyle={{ fontSize:12, color:"rgba(232,237,248,0.5)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── RADAR CHART ── */}
      <div style={card}>
        <div style={sectionLabel}>🕸 Multi-Disease Risk Radar</div>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill:"#8899aa", fontSize:11 }} />
            <Radar name="Risk %" dataKey="value" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15} strokeWidth={2} />
            <Tooltip contentStyle={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#e8edf8", fontSize:13 }} formatter={v => [`${v}%`, "Risk"]} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* ── LAB VALUES ── */}
      {labs && Object.keys(labs).length > 0 && (
        <div style={card}>
          <div style={sectionLabel}>🧪 Extracted Lab Values</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
            {Object.entries(labs).map(([key, val]) => (
              <div key={key} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"14px 16px" }}>
                <div style={{ fontSize:11, color:"rgba(232,237,248,0.35)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:6 }}>{key}</div>
                <div style={{ fontSize:18, fontFamily:"'JetBrains Mono',monospace", color:"#00d4ff", fontWeight:500 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ── KNOWLEDGE GRAPH ── */}
      <div style={card}>
        <KnowledgeGraph entities={entities} risks={risks} />
      </div>

      {/* ── PIPELINE LOG ── */}
      <div style={card}>
        <div style={sectionLabel}>⚡ Pipeline Execution Log</div>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, lineHeight:2.2 }}>
          {[
            ["✓","#00e5a0", `PDF parsed — ${results.text_length || "?"} characters extracted`],
            ["✓","#00e5a0", `BioBERT NER — ${totalEntities} medical entities identified`],
            ["✓","#00e5a0", `Risk predictor — ${(risks||[]).length} diseases scored from document signals`],
            ["✓","#00e5a0", `Claude API — clinical summary generated`],
            ["→","#00d4ff", `Dashboard rendered — total analysis time: ${analysis_time || "—"}s`],
          ].map(([icon, color, msg], i) => (
            <div key={i}>
              <span style={{ color }}>{icon}</span>
              <span style={{ color:"rgba(232,237,248,0.25)", margin:"0 8px" }}>[{now}]</span>
              <span style={{ color:"rgba(232,237,248,0.6)" }}>{msg}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}