import React from "react";

const COMEDY_STYLES = [
  "Random",
  "Sarcastic",
  "Roast",
  "Dramatic",
  "Chaotic",
  "Deadpan",
  "Programmer",
  "Psychological",
  "Narrator",
  "Absurd",
];

const ROAST_LEVELS = ["Gentle", "Normal", "Unhinged"];

export function SettingsPanel({
  settings,
  onUpdateSettings,
  voices,
  videoDevices,
  onClose,
  onTestVoice,
}) {
  const update = (key, value) => {
    onUpdateSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <aside
        className="settings-drawer"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Application Settings"
      >
        <div className="settings-header">
          <div>
            <div className="eyebrow">CONFIGURATION MATRIX</div>
            <h2>System Settings</h2>
          </div>
          <button
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="settings-body">
          {/* CAMERA SETTINGS */}
          <section className="settings-group">
            <h3 className="group-title">Camera & Sensor</h3>

            {videoDevices.length > 0 && (
              <div className="setting-field">
                <label className="field-label">Camera Source</label>
                <select
                  className="select-input"
                  value={settings.deviceId}
                  onChange={(e) => update("deviceId", e.target.value)}
                >
                  {videoDevices.map((d, i) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Camera ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="setting-field toggle-field">
              <span className="field-label">Mirror Camera Feed</span>
              <button
                type="button"
                className={`cyber-toggle ${settings.mirror ? "active" : ""}`}
                onClick={() => update("mirror", !settings.mirror)}
                aria-pressed={settings.mirror}
              >
                <span className="toggle-thumb" />
              </button>
            </div>

            <div className="setting-field toggle-field">
              <span className="field-label">Show 468-pt Facial Tracking</span>
              <button
                type="button"
                className={`cyber-toggle ${settings.showTracking ? "active" : ""}`}
                onClick={() => update("showTracking", !settings.showTracking)}
                aria-pressed={settings.showTracking}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </section>

          {/* DETECTION & SMOOTHING */}
          <section className="settings-group">
            <h3 className="group-title">Detection & Neural Engine</h3>

            <div className="setting-field range-field">
              <div className="range-header">
                <span className="field-label">Temporal Smoothing</span>
                <span className="range-val">{Math.round(settings.smoothing * 100)}%</span>
              </div>
              <input
                type="range"
                className="range-input"
                min="0.30"
                max="0.95"
                step="0.05"
                value={settings.smoothing}
                onChange={(e) => update("smoothing", parseFloat(e.target.value))}
              />
              <span className="range-hint">Higher = smoother expressions, less jitter</span>
            </div>

            <div className="setting-field range-field">
              <div className="range-header">
                <span className="field-label">Confidence Threshold</span>
                <span className="range-val">{Math.round(settings.confidence * 100)}%</span>
              </div>
              <input
                type="range"
                className="range-input"
                min="0.25"
                max="0.85"
                step="0.05"
                value={settings.confidence}
                onChange={(e) => update("confidence", parseFloat(e.target.value))}
              />
              <span className="range-hint">Minimum threshold required to trigger state changes</span>
            </div>
          </section>

          {/* COMEDY SETTINGS */}
          <section className="settings-group">
            <h3 className="group-title">Comedy & Narration</h3>

            <div className="setting-field">
              <label className="field-label">Comedy Style</label>
              <select
                className="select-input"
                value={settings.comedyStyle}
                onChange={(e) => update("comedyStyle", e.target.value)}
              >
                {COMEDY_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-field">
              <label className="field-label">Roast Level</label>
              <div className="radio-pill-group">
                {ROAST_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`radio-pill ${settings.roast === lvl ? "selected" : ""}`}
                    onClick={() => update("roast", lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-field range-field">
              <div className="range-header">
                <span className="field-label">Commentary Cooldown</span>
                <span className="range-val">{settings.commentaryFrequency}s</span>
              </div>
              <input
                type="range"
                className="range-input"
                min="4"
                max="16"
                step="1"
                value={settings.commentaryFrequency}
                onChange={(e) => update("commentaryFrequency", parseInt(e.target.value, 10))}
              />
              <span className="range-hint">Minimum delay between consecutive voice comments</span>
            </div>

            <div className="setting-field toggle-field">
              <div>
                <span className="field-label">Mind Reading Mode</span>
                <span className="field-sub">Generate fictional internal thoughts instead of narrator commentary</span>
              </div>
              <button
                type="button"
                className={`cyber-toggle ${settings.mindReadingMode ? "active" : ""}`}
                onClick={() => update("mindReadingMode", !settings.mindReadingMode)}
                aria-pressed={settings.mindReadingMode}
              >
                <span className="toggle-thumb" />
              </button>
            </div>

            <div className="setting-field toggle-field">
              <span className="field-label">AI Annoyance Meter</span>
              <button
                type="button"
                className={`cyber-toggle ${settings.annoyance ? "active" : ""}`}
                onClick={() => update("annoyance", !settings.annoyance)}
                aria-pressed={settings.annoyance}
              >
                <span className="toggle-thumb" />
              </button>
            </div>

            <div className="setting-field toggle-field">
              <div>
                <span className="field-label">Optional Gemini AI Backend</span>
                <span className="field-sub">Requires server/index.js with GEMINI_API_KEY</span>
              </div>
              <button
                type="button"
                className={`cyber-toggle ${settings.aiMode ? "active" : ""}`}
                onClick={() => update("aiMode", !settings.aiMode)}
                aria-pressed={settings.aiMode}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </section>

          {/* VOICE & TTS SETTINGS */}
          <section className="settings-group">
            <h3 className="group-title">Audio Synthesizer (TTS)</h3>

            <div className="setting-field">
              <label className="field-label">Voice (Narrator / TTS Voice)</label>
              <select
                className="select-input"
                value={settings.voice}
                onChange={(e) => update("voice", e.target.value)}
              >
                <option value="">Auto Recommended (Narrator)</option>
                {[...voices]
                  .sort((a, b) => {
                    const isEnA = a.lang.toLowerCase().startsWith("en");
                    const isEnB = b.lang.toLowerCase().startsWith("en");
                    if (isEnA && !isEnB) return -1;
                    if (!isEnA && isEnB) return 1;
                    return a.name.localeCompare(b.name);
                  })
                  .map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
              </select>
            </div>

            <div className="setting-field range-field">
              <div className="range-header">
                <span className="field-label">Voice Speed (Rate)</span>
                <span className="range-val">{settings.speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                className="range-input"
                min="0.6"
                max="1.6"
                step="0.05"
                value={settings.speed}
                onChange={(e) => update("speed", parseFloat(e.target.value))}
              />
            </div>

            <div className="setting-field range-field">
              <div className="range-header">
                <span className="field-label">Voice Pitch</span>
                <span className="range-val">{settings.pitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                className="range-input"
                min="0.6"
                max="1.7"
                step="0.05"
                value={settings.pitch}
                onChange={(e) => update("pitch", parseFloat(e.target.value))}
              />
            </div>

            <div className="setting-field range-field">
              <div className="range-header">
                <span className="field-label">Voice Volume</span>
                <span className="range-val">{Math.round(settings.volume * 100)}%</span>
              </div>
              <input
                type="range"
                className="range-input"
                min="0"
                max="1.0"
                step="0.05"
                value={settings.volume}
                onChange={(e) => update("volume", parseFloat(e.target.value))}
              />
            </div>

            <button
              className="test-voice-btn"
              type="button"
              onClick={onTestVoice}
            >
              🔊 Test Voice
            </button>
          </section>

          {/* APPEARANCE */}
          <section className="settings-group">
            <h3 className="group-title">Interface</h3>

            <div className="setting-field toggle-field">
              <span className="field-label">Ambient Animations & Scanlines</span>
              <button
                type="button"
                className={`cyber-toggle ${settings.animation ? "active" : ""}`}
                onClick={() => update("animation", !settings.animation)}
                aria-pressed={settings.animation}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </section>
        </div>

        <div className="settings-footer">
          <p>Settings are saved in your local browser storage.</p>
        </div>
      </aside>
    </div>
  );
}
