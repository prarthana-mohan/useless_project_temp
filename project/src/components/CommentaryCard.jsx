import React from "react";

export function CommentaryCard({
  commentaryText,
  isSpeaking,
  isMuted,
  annoyanceLevel,
  mindReadingMode,
  onToggleMute,
  onClearOutput,
  onReplaySpeech,
}) {
  return (
    <section className="card commentary-card">
      <div className="card-head">
        <div>
          <div className="eyebrow">
            {mindReadingMode ? "TELEPATHIC SIMULATOR" : "AI NARRATOR AUDIO"}
          </div>
          <h2>{mindReadingMode ? "Fictional Internal Thought" : "Live AI Commentary"}</h2>
        </div>

        <div className={`speaking-status-pill ${isSpeaking ? "speaking" : "idle"}`}>
          {isSpeaking ? (
            <>
              <div className="audio-wave">
                <span /><span /><span /><span />
              </div>
              <span>Speaking...</span>
            </>
          ) : (
            <>
              <span className="idle-indicator">●</span>
              <span>Ready</span>
            </>
          )}
        </div>
      </div>

      <div className="quote-display">
        <span className="quote-glyph start">“</span>
        <blockquote className="commentary-text">
          {commentaryText || "Ready to read your mind. Look directly into the camera."}
        </blockquote>
        <span className="quote-glyph end">”</span>
      </div>

      <div className="commentary-controls">
        <div className="button-group">
          <button
            className={`action-btn ${isMuted ? "muted" : ""}`}
            onClick={onToggleMute}
            title={isMuted ? "Unmute AI voice" : "Mute AI voice"}
          >
            {isMuted ? "🔇 Unmute" : "🔊 Mute"}
          </button>

          <button
            className="action-btn text-only"
            onClick={onReplaySpeech}
            disabled={!commentaryText || isMuted}
            title="Replay narration aloud"
          >
            ↺ Replay
          </button>

          <button
            className="action-btn text-only"
            onClick={onClearOutput}
            title="Clear current commentary"
          >
            Clear
          </button>
        </div>

        <div className="annoyance-widget">
          <div className="annoyance-labels">
            <span className="annoyance-title">AI ANNOYANCE METER</span>
            <span className="annoyance-percent">{Math.round(annoyanceLevel)}%</span>
          </div>
          <div className="annoyance-meter">
            <div
              className="annoyance-fill"
              style={{ width: `${Math.max(5, Math.min(100, annoyanceLevel))}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
