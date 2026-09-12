import React from "react";

export function WebcamView({
  videoRef,
  canvasRef,
  streamState,
  fps,
  faceDetected,
  landmarkCount,
  showTracking,
  mirror,
  videoDevices,
  selectedDeviceId,
  onSelectDevice,
  onToggleTracking,
  onToggleMirror,
  onToggleCamera,
}) {
  const isStreaming = streamState === "active";

  return (
    <section className="card camera-card">
      <div className="card-head">
        <div>
          <div className="eyebrow">OPTICAL SENSOR // REAL-TIME CV</div>
          <h2>Live Webcam Feed</h2>
        </div>
        <div className="camera-header-actions">
          {videoDevices.length > 1 && (
            <select
              className="device-select"
              value={selectedDeviceId}
              onChange={(e) => onSelectDevice(e.target.value)}
              title="Select camera device"
            >
              {videoDevices.map((device, idx) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          )}
          <div className={`camera-status-pill ${isStreaming ? "active" : ""}`}>
            <span className={isStreaming ? "live-dot" : "muted-dot"} />
            {isStreaming ? "CAMERA ACTIVE" : streamState.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="video-viewport">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`webcam-video ${mirror ? "mirrored" : ""}`}
        />
        <canvas
          ref={canvasRef}
          className={`landmark-canvas ${mirror ? "mirrored" : ""}`}
        />

        {/* Cyberpunk HUD Overlay */}
        <div className="scanline" />
        <div className="hud-corner c-tl" />
        <div className="hud-corner c-tr" />
        <div className="hud-corner c-bl" />
        <div className="hud-corner c-br" />

        {/* Top HUD Telemetry */}
        <div className="hud-bar hud-top">
          <span className="hud-tag">
            <i className="hud-bullet" />
            {isStreaming ? "MEDIAPIPE PIPELINE" : "FEED STANDBY"}
          </span>
          <span className="hud-metric">{fps} FPS</span>
        </div>

        {/* Bottom HUD Telemetry */}
        <div className="hud-bar hud-bottom">
          <span className={`hud-tag ${faceDetected ? "green" : "warn"}`}>
            {faceDetected ? "● FACE DETECTED" : "◌ SEARCHING FOR FACE"}
          </span>
          <span className="hud-metric">
            {faceDetected ? `${landmarkCount || 468} LANDMARKS` : "0 LANDMARKS"}
          </span>
        </div>

        {/* No-Face Micro-interaction */}
        {isStreaming && !faceDetected && (
          <div className="no-face-overlay">
            <div className="no-face-radar">
              <div className="radar-sweep" />
              <span className="radar-icon">◌</span>
            </div>
            <strong className="no-face-title">Where did you go?</strong>
            <p className="no-face-sub">I can't read your mind if you leave the camera frame.</p>
          </div>
        )}
      </div>

      <div className="camera-toolbar">
        <button
          className={`chip-button ${showTracking ? "active" : ""}`}
          onClick={onToggleTracking}
          title="Toggle facial landmark visualization"
        >
          <span>{showTracking ? "☑" : "☐"}</span> Show Face Tracking
        </button>

        <button
          className={`chip-button ${mirror ? "active" : ""}`}
          onClick={onToggleMirror}
          title="Toggle camera horizontal mirror"
        >
          <span>⇄</span> Mirror
        </button>

        <div className="toolbar-spacer" />

        <button
          className={`camera-toggle-btn ${isStreaming ? "stop" : "start"}`}
          onClick={onToggleCamera}
        >
          {isStreaming ? "Stop Camera" : "Start Camera"}
        </button>
      </div>
    </section>
  );
}
