import React from "react";
import { EXPRESSION_METADATA } from "../vision/expressionClassifier.js";

function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function HistoryPanel({
  expressionHistory,
  commentaryHistory,
  onClearCommentary,
  onClearExpressions,
}) {
  return (
    <div className="history-dual-grid">
      {/* Expression Timeline */}
      <section className="card timeline-card">
        <div className="card-head">
          <div>
            <div className="eyebrow">TEMPORAL LOG</div>
            <h2>Expression Timeline</h2>
          </div>
          <div className="card-actions">
            <span className="count-pill">{expressionHistory.length} events</span>
            {expressionHistory.length > 0 && (
              <button
                className="text-action-btn"
                onClick={onClearExpressions}
                title="Clear expression history"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="scroll-container timeline-list">
          {expressionHistory.length === 0 ? (
            <div className="empty-state">
              <span className="empty-glyph">◌</span>
              <p>No expressions logged yet. Start the camera to record timeline.</p>
            </div>
          ) : (
            expressionHistory.map((item) => {
              const meta = EXPRESSION_METADATA[item.expression] || EXPRESSION_METADATA.neutral;
              return (
                <div className="timeline-row" key={item.id}>
                  <span className="timeline-time">{formatTimestamp(item.timestamp)}</span>
                  <div className="timeline-badge-wrap">
                    <span className="timeline-emoji">{meta.emoji}</span>
                    <span className="timeline-label">{meta.label}</span>
                  </div>
                  <span className="timeline-conf">
                    {Math.round(item.confidence * 100)}% conf
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Commentary History */}
      <section className="card commentary-history-card">
        <div className="card-head">
          <div>
            <div className="eyebrow">NARRATOR ARCHIVE</div>
            <h2>Commentary History</h2>
          </div>
          <div className="card-actions">
            <span className="count-pill">{commentaryHistory.length} quotes</span>
            {commentaryHistory.length > 0 && (
              <button
                className="text-action-btn"
                onClick={onClearCommentary}
                title="Clear commentary history"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="scroll-container commentary-list">
          {commentaryHistory.length === 0 ? (
            <div className="empty-state">
              <span className="empty-glyph">💬</span>
              <p>Commentary log is empty. The AI narrator will speak as your expressions change.</p>
            </div>
          ) : (
            commentaryHistory.map((item) => (
              <div className="commentary-item" key={item.id}>
                <div className="item-meta">
                  <span className="item-time">{formatTimestamp(item.timestamp)}</span>
                  {item.expression && (
                    <span className="item-expr-tag">
                      {EXPRESSION_METADATA[item.expression]?.emoji}{" "}
                      {EXPRESSION_METADATA[item.expression]?.label}
                    </span>
                  )}
                </div>
                <p className="item-quote">“{item.text}”</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
