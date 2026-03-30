import React from "react";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, ResponsiveContainer
} from "recharts";

function RiskChart({ risks }) {
  const getColor = (risk) => {
    if (risk === "High") return "#ef4444";
    if (risk === "Medium") return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div>
      <h3 style={{ color: "#1a56db", marginBottom: "16px" }}>
        📊 Disease Risk Prediction
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={risks} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" />
          <XAxis dataKey="disease" tick={{ fontSize: 12 }} />
          <YAxis
            domain={[0, 1]}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(v) => [`${(v * 100).toFixed(0)}%`, "Probability"]}
          />
          <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
            {risks.map((entry, index) => (
              <Cell key={index} fill={getColor(entry.risk)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RiskChart;