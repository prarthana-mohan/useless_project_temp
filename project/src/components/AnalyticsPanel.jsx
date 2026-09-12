import React from "react";
import { EXPRESSION_METADATA } from "../vision/expressionClassifier.js";

export function AnalyticsPanel({
  faceDetected,
  expression,
  confidence,
  intensity,
  fps,
  landmarksCount,
  delegate,
  aiMode,
}) {
  const currentExpr = EXPRESSION_METADATA[expression]?.label || "Neutral";

  const telemetryItems = [
    {
      label: "FACE DETECTION",
      value: faceDetected ? "Active" : "Searching",
      status: faceDetected ? "positive" : "warning",
    },
    {
      label: "EXPRESSION",
      value: currentExpr,
      status: "highlight",
    },
    {
      label: "CONFIDENCE",
      value: `${Math.round(confidence * 100)}%`,
      status: "neutral",
    },
    {
      label: "INTENSITY",
      value: `${Math.round(intensity * 100)}%`,
      status: "neutral",
    },
    {
      label: "FPS",
      value: String(fps),
      status: fps > 18 ? "positive" : "neutral",
    },
    {
      label: "PROCESSING",
      value: `Real-time (${delegate || "GPU"})`,
      status: "positive",
    },
    {
      label: "LANDMARKS",
      value: String(landmarksCount || 468),
      status: "neutral",
    },
    {
      label: "AI BACKEND",
      value: aiMode ? "Local + Gemini" : "Local Comedy Engine",
      status: aiMode ? "highlight" : "neutral",
    },
    {
      label: "COMMENTARY AUDIO",
      value: "English (en-US)",
      status: "positive",
    },
  ];

  return (
    <section className="card analytics-card">
      <div className="card-head">
        <div>
          <div className="eyebrow">HARDWARE & MODEL TELEMETRY</div>
          <h2>Live Analytics Panel</h2>
        </div>
        <span className="telemetry-badge">10–20Hz</span>
      </div>

      <div className="telemetry-grid">
        {telemetryItems.map((item) => (
          <div className="telemetry-cell" key={item.label}>
            <span className="cell-label">{item.label}</span>
            <div className="cell-value-wrap">
              {item.status === "positive" && <span className="cell-dot positive" />}
              {item.status === "warning" && <span className="cell-dot warning" />}
              <strong className={`cell-value ${item.status}`}>{item.value}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
