import React from "react";
import { EXPRESSION_METADATA } from "../vision/expressionClassifier.js";

export function ExpressionPanel({ expression, confidence, intensity }) {
  const meta = EXPRESSION_METADATA[expression] || EXPRESSION_METADATA.neutral;
  const confPercent = Math.round(confidence * 100);
  const intPercent = Math.round(intensity * 100);

  return (
    <section className="card expression-card">
      <div className="card-head">
        <div>
          <div className="eyebrow">ESTIMATED MOOD STATE</div>
          <h2>Current Expression</h2>
        </div>
        <span className="expr-code-badge">{meta.code}</span>
      </div>

      <div className="expression-hero">
        <div className="expression-orb-wrap">
          <div className="orb-ring ring-outer" />
          <div className="orb-ring ring-inner" />
          <div className="expression-orb">
            <span className="orb-emoji" role="img" aria-label={meta.label}>
              {meta.emoji}
            </span>
          </div>
        </div>

        <div className="expression-details">
          <h3 className="expression-title">{meta.label.toUpperCase()}</h3>
          <p className="expression-desc">{meta.desc}</p>
          <div className="fictional-tag">
            <span className="fictional-dot" />
            FICTIONAL AI COMMENTARY
          </div>
        </div>
      </div>

      <div className="metrics-group">
        <div className="metric-row">
          <div className="metric-labels">
            <span className="metric-name">Confidence</span>
            <span className="metric-value">{confPercent}%</span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill meter-cyan"
              style={{ width: `${confPercent}%` }}
            />
          </div>
        </div>

        <div className="metric-row">
          <div className="metric-labels">
            <span className="metric-name">Intensity</span>
            <span className="metric-value">{intPercent}%</span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill meter-purple"
              style={{ width: `${intPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="disclaimer-callout">
        <span className="disclaimer-icon">ℹ</span>
        <p>
          Facial expressions are behavioral estimates processed locally in your browser.
          MindReader does not claim biological truth or actual thought detection.
        </p>
      </div>
    </section>
  );
}
