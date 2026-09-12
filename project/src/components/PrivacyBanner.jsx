import React from "react";

export function PrivacyBanner() {
  return (
    <div className="privacy-banner">
      <div className="privacy-pill">
        <span className="privacy-icon">🔒</span>
        <span className="privacy-title">ZERO-DATA PRIVACY ARCHITECTURE</span>
      </div>
      <p className="privacy-text">
        Camera processing happens <strong>100% locally in your browser</strong> using client-side WebAssembly & WebGL.
        No video frames or photos are ever saved, recorded, or sent to any server.
        MindReader performs real-time temporary expression telemetry only—no biometric identification or face recognition.
      </p>
    </div>
  );
}
