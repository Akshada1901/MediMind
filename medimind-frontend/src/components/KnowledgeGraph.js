import React from "react";

const getRiskColor = (risk) =>
  risk === "High" ? "#ff4466" : risk === "Medium" ? "#ffb800" : "#00e5a0";

export default function KnowledgeGraph({ entities, risks }) {
  const W = 1000;
  const H = 520;
  const centerX = W / 2;
  const centerY = H / 2;
  const diseaseRadius = 150;
  const entityRadius = 320;
  const nodeR = 38;
  const entityW = 124;
  const entityH = 26;

  const topRisks = (risks || []).slice(0, 6);
  const totalDiseases = topRisks.length;

  const diseaseNodes = topRisks.map((r, i) => {
    const angle = (i * 2 * Math.PI) / totalDiseases - Math.PI / 2;
    return {
      x: centerX + diseaseRadius * Math.cos(angle),
      y: centerY + diseaseRadius * Math.sin(angle),
      label: r.disease,
      color: getRiskColor(r.risk),
      risk: r.risk,
      probability: r.probability,
    };
  });

  const typeColors = {
    MEDICATION: "#7c3aed",
    LAB_VALUE:  "#0891b2",
    SYMPTOM:    "#ea580c",
  };

  const diseaseNames = new Set(
    (risks || []).map(r => r.disease.toLowerCase())
  );

  const allEntities = [];
  Object.entries(entities || {}).forEach(([label, values]) => {
    if (
      label === "DISEASE" ||
      label === "RECOMMENDATIONS" ||
      label === "CLINICAL_FINDINGS"
    ) return;
    values.slice(0, 2).forEach((v) => {
      if (diseaseNames.has(v.toLowerCase())) return;
      allEntities.push({
        label: v.length > 14 ? v.slice(0, 14) + "..." : v,
        type: label,
        color: typeColors[label] || "#475569"
      });
    });
  });

  // Evenly space entity nodes in outer ring
  // Offset angle so they sit BETWEEN disease nodes
  const entityCount = Math.min(allEntities.length, 10);
  const angleOffset = totalDiseases > 0
    ? (Math.PI / totalDiseases)
    : 0;

  const entityNodes = allEntities.slice(0, entityCount).map((e, i) => {
    const angle = angleOffset + (i * 2 * Math.PI) / entityCount - Math.PI / 2;
    const ex = centerX + entityRadius * Math.cos(angle);
    const ey = centerY + entityRadius * Math.sin(angle);

    // Keep within SVG bounds with padding
    const padX = entityW / 2 + 8;
    const padY = entityH / 2 + 8;
    return {
      ...e,
      x: Math.max(padX, Math.min(W - padX, ex)),
      y: Math.max(padY, Math.min(H - padY, ey)),
    };
  });

  // Edge stops at shape boundary, not center
  const getEdgePoint = (fromX, fromY, toX, toY, offset) => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return { x: toX, y: toY };
    return {
      x: fromX + (dx / dist) * offset,
      y: fromY + (dy / dist) * offset
    };
  };

  const getCenterEdge = (dNode) => {
    const start = getEdgePoint(dNode.x, dNode.y, centerX, centerY, nodeR + 2);
    const end   = getEdgePoint(centerX, centerY, dNode.x, dNode.y, 48);
    return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
  };

  const getEntityEdge = (dNode, eNode) => {
    const start = getEdgePoint(dNode.x, dNode.y, eNode.x, eNode.y, nodeR + 2);
    const dx = eNode.x - dNode.x;
    const dy = eNode.y - dNode.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return { x1: start.x, y1: start.y, x2: eNode.x, y2: eNode.y };
    const nx = dx / dist;
    const ny = dy / dist;

    // Stop at pill box edge (approximate with half-width)
    const stopX = eNode.x - nx * (entityW / 2 + 2);
    const stopY = eNode.y - ny * (entityH / 2 + 2);
    return { x1: start.x, y1: start.y, x2: stopX, y2: stopY };
  };

  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "2px",
        textTransform: "uppercase", color: "rgba(232,237,248,0.4)",
        marginBottom: 12
      }}>
        🕸 Knowledge Graph — Disease Entity Relationships
      </div>

      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16, overflow: "hidden", width: "100%"
      }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}
          xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>

          {/* Background dots */}
          {Array.from({ length: 25 }).map((_, i) =>
            Array.from({ length: 14 }).map((_, j) => (
              <circle key={`bg-${i}-${j}`}
                cx={i * 42} cy={j * 40}
                r={1} fill="rgba(255,255,255,0.04)" />
            ))
          )}

          {/* Guide rings */}
          <circle cx={centerX} cy={centerY} r={diseaseRadius}
            fill="none" stroke="rgba(255,255,255,0.05)"
            strokeWidth={1} strokeDasharray="4,8" />
          <circle cx={centerX} cy={centerY} r={entityRadius}
            fill="none" stroke="rgba(255,255,255,0.03)"
            strokeWidth={1} strokeDasharray="3,10" />

          {/* Center → Disease edges */}
          {diseaseNodes.map((node, i) => {
            const e = getCenterEdge(node);
            return (
              <line key={`ce-${i}`}
                x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={node.color} strokeOpacity={0.65}
                strokeWidth={1.8} strokeDasharray="6,4" />
            );
          })}

          {/* Disease → Entity edges */}
          {entityNodes.map((eNode, i) => {
            const dNode = diseaseNodes[i % diseaseNodes.length];
            if (!dNode) return null;
            const e = getEntityEdge(dNode, eNode);
            return (
              <line key={`ee-${i}`}
                x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={eNode.color} strokeOpacity={0.55}
                strokeWidth={1.3} strokeDasharray="4,5" />
            );
          })}

          {/* Entity pill nodes */}
          {entityNodes.map((node, i) => (
            <g key={`en-${i}`}>
              <rect
                x={node.x - entityW / 2}
                y={node.y - entityH / 2}
                width={entityW} height={entityH}
                rx={13} ry={13}
                fill={node.color} fillOpacity={0.13}
                stroke={node.color} strokeOpacity={0.55}
                strokeWidth={1.2}
              />
              <text
                x={node.x} y={node.y + 4}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={node.color}
                fontSize={9.5}
                fontFamily="JetBrains Mono, monospace"
              >
                {node.label}
              </text>
            </g>
          ))}

          {/* Disease circle nodes */}
          {diseaseNodes.map((node, i) => (
            <g key={`dn-${i}`}>
              <circle cx={node.x} cy={node.y} r={nodeR + 10}
                fill={node.color} fillOpacity={0.06} />
              <circle cx={node.x} cy={node.y} r={nodeR}
                fill={node.color} fillOpacity={0.18}
                stroke={node.color} strokeWidth={2} />
              <circle cx={node.x} cy={node.y} r={nodeR - 8}
                fill={node.color} fillOpacity={0.08} />
              <text x={node.x} y={node.y - 6}
                textAnchor="middle"
                fill="white"
                fontSize={node.label.length > 9 ? 9 : 10}
                fontFamily="DM Sans, sans-serif"
                fontWeight="700">
                {node.label}
              </text>
              <text x={node.x} y={node.y + 10}
                textAnchor="middle"
                fill={node.color}
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600">
                {(node.probability * 100).toFixed(0)}%
              </text>
            </g>
          ))}

          {/* Center patient node */}
          <circle cx={centerX} cy={centerY} r={50}
            fill="rgba(0,212,255,0.06)"
            stroke="#00d4ff" strokeWidth={1.5}
            strokeDasharray="6,4" />
          <circle cx={centerX} cy={centerY} r={42}
            fill="rgba(0,212,255,0.10)" />
          <circle cx={centerX} cy={centerY} r={32}
            fill="rgba(0,212,255,0.07)" />
          <text x={centerX} y={centerY - 7}
            textAnchor="middle"
            fill="#00d4ff" fontSize={14}
            fontFamily="DM Serif Display, serif"
            fontWeight="bold">
            Patient
          </text>
          <text x={centerX} y={centerY + 10}
            textAnchor="middle"
            fill="rgba(0,212,255,0.5)" fontSize={9}
            fontFamily="JetBrains Mono, monospace">
            Risk Map
          </text>

        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        {[
          ["#ff4466", "High Risk"],
          ["#ffb800", "Medium Risk"],
          ["#00e5a0", "Low Risk"],
          ["#7c3aed", "Medication"],
          ["#0891b2", "Lab Value"],
          ["#ea580c", "Symptom"],
        ].map(([color, label]) => (
          <div key={label} style={{
            display: "flex", alignItems: "center",
            gap: 6, fontSize: 11, color: "rgba(232,237,248,0.4)"
          }}>
            <div style={{
              width: 8, height: 8,
              borderRadius: "50%", background: color
            }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}