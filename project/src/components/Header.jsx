import React from "react";

export function Header({
  online,
  mindReadingMode,
  demoMode,
  onOpenSettings,
  onToggleDemo,
}) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">
          <span>MR</span>
          <div className="mark-glow" />
        </div>
        <div>
          <div className="brand-title">
            MindReader<span className="brand-ext">.exe</span>
          </div>
          <div className="tagline">“It knows what you’re thinking. Probably.”</div>
        </div>
      </div>

      <div className="top-actions">
        {demoMode && (
          <div className="badge demo-badge">
            <span className="pulsing-dot amber" />
            DEMO SIMULATOR
          </div>
        )}

        {mindReadingMode && (
          <div className="badge mind-badge">
            <span>🧠</span> MIND-READING MODE
          </div>
        )}

        <div className={`status-pill ${online ? "online" : "standby"}`}>
          <span className="status-dot" />
          {online ? "SYSTEM ONLINE" : "STANDBY"}
        </div>

        <button
          className={`ghost-button ${demoMode ? "active" : ""}`}
          onClick={onToggleDemo}
          title="Toggle instant simulated demo without camera"
        >
          🎬 Demo Mode
        </button>

        <button
          className="ghost-button settings-btn"
          onClick={onOpenSettings}
          aria-label="Open settings"
        >
          <span className="btn-icon">⚙</span> Settings
        </button>
      </div>
    </header>
  );
}
