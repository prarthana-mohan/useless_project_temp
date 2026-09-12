import React, { useEffect, useRef, useState, useCallback } from "react";
import { Header } from "./components/Header.jsx";
import { WebcamView } from "./components/WebcamView.jsx";
import { ExpressionPanel } from "./components/ExpressionPanel.jsx";
import { CommentaryCard } from "./components/CommentaryCard.jsx";
import { AnalyticsPanel } from "./components/AnalyticsPanel.jsx";
import { HistoryPanel } from "./components/HistoryPanel.jsx";
import { SettingsPanel } from "./components/SettingsPanel.jsx";
import { PrivacyBanner } from "./components/PrivacyBanner.jsx";

import { initFaceLandmarker, getActiveDelegate, disposeFaceLandmarker } from "./vision/faceDetector.js";
import { extractMetrics, drawLandmarkMesh } from "./vision/landmarkProcessor.js";
import { classifyExpression } from "./vision/expressionClassifier.js";
import { TemporalSmoother } from "./vision/smoothing.js";
import { ComedyEngine } from "./comedy/comedyEngine.js";
import { SpeechEngine } from "./audio/speechEngine.js";

const DEFAULT_SETTINGS = {
  smoothing: 0.75,
  confidence: 0.45,
  commentaryFrequency: 6,
  comedyStyle: "Random",
  roast: "Normal",
  mindReadingMode: false,
  annoyance: true,
  aiMode: false,
  showTracking: true,
  mirror: true,
  deviceId: "",
  voice: "",
  speed: 1.05,
  pitch: 1.1,
  volume: 0.9,
  animation: true,
};

function loadStoredSettings() {
  try {
    const raw = localStorage.getItem("mindreader_settings_v2");
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn("Failed to read settings from storage:", e);
  }
  return DEFAULT_SETTINGS;
}

export function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const landmarkerRef = useRef(null);
  const smootherRef = useRef(new TemporalSmoother({ smoothingFactor: 0.75 }));
  const comedyRef = useRef(new ComedyEngine());
  const speechRef = useRef(new SpeechEngine());

  const lastInferTimeRef = useRef(0);
  const lastCommentTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastFpsCalcTimeRef = useRef(performance.now());
  const isMountedRef = useRef(true);

  // App State
  const [started, setStarted] = useState(false);
  const [streamState, setStreamState] = useState("ready"); // "ready" | "loading" | "active" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [fps, setFps] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [landmarksCount, setLandmarksCount] = useState(0);

  const [expression, setExpression] = useState("neutral");
  const [confidence, setConfidence] = useState(0.5);
  const [intensity, setIntensity] = useState(0.2);

  const [commentaryText, setCommentaryText] = useState(
    "Ready to read your mind. Look directly into the camera and try not to look guilty."
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [annoyanceLevel, setAnnoyanceLevel] = useState(15);

  const [expressionHistory, setExpressionHistory] = useState([]);
  const [commentaryHistory, setCommentaryHistory] = useState([]);

  const [settings, setSettings] = useState(loadStoredSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [voices, setVoices] = useState([]);

  // Save settings on update
  useEffect(() => {
    try {
      localStorage.setItem("mindreader_settings_v2", JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to persist settings:", e);
    }
    smootherRef.current.setSmoothingFactor(settings.smoothing);
  }, [settings]);

  // Listen to speech engine state & voices
  useEffect(() => {
    isMountedRef.current = true;
    const unsubscribe = speechRef.current.subscribe(({ isSpeaking: spk, voices: vcs }) => {
      if (isMountedRef.current) {
        setIsSpeaking(spk);
        if (vcs?.length) setVoices(vcs);
      }
    });

    // Enumerate video devices if permitted
    if (navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const vInputs = devices.filter((d) => d.kind === "videoinput");
        if (isMountedRef.current) setVideoDevices(vInputs);
      });
    }

    return () => {
      isMountedRef.current = false;
      unsubscribe();
      stopCamera();
      speechRef.current.cancel();
      disposeFaceLandmarker();
    };
  }, []);

  // Dispatch Commentary
  const triggerCommentary = useCallback(
    async (targetExpr, targetIntensity, targetConfidence, reason = "expression", isTransition = false) => {
      const now = performance.now();
      const cooldownMs = settings.commentaryFrequency * 1000;

      if (now - lastCommentTimeRef.current < cooldownMs) return;
      if (speechRef.current.isSpeaking && !demoMode) return;

      lastCommentTimeRef.current = now;

      let text = "";
      if (reason === "noface") {
        text = comedyRef.current.generateNoFace();
        if (!text) return;
      } else {
        text = await comedyRef.current.generate({
          expression: targetExpr,
          intensity: targetIntensity,
          confidence: targetConfidence,
          style: settings.comedyStyle,
          roast: settings.roast,
          mindReadingMode: settings.mindReadingMode,
          aiMode: settings.aiMode,
          isTransition,
          context: demoMode ? "hackathon demo presentation" : "real-time webcam",
        });
      }

      if (!isMountedRef.current || !text) return;

      setCommentaryText(text);

      // Add to commentary archive
      setCommentaryHistory((prev) => [
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          text,
          expression: targetExpr,
        },
        ...prev.slice(0, 35),
      ]);

      // Annoyance meter dynamic growth
      if (settings.annoyance) {
        setAnnoyanceLevel((prev) => Math.min(100, prev + 5 + targetIntensity * 6));
      }

      // Speak narration
      speechRef.current.speak(text, {
        voice: settings.voice,
        rate: settings.speed,
        pitch: settings.pitch,
        volume: settings.volume,
      });
    },
    [settings, demoMode]
  );

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreamState("ready");
    setFaceDetected(false);
    setFps(0);
  }, []);

  // Start Camera
  const startCamera = useCallback(async () => {
    setErrorMessage("");
    setStreamState("loading");
    setStarted(true);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API is not supported in this browser environment.");
      }

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
          deviceId: settings.deviceId ? { exact: settings.deviceId } : undefined,
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Initialize FaceLandmarker
      const landmarker = await initFaceLandmarker({ confidence: settings.confidence });
      landmarkerRef.current = landmarker;

      setStreamState("active");
      startVisionLoop();
    } catch (err) {
      console.error("Camera startup error:", err);
      setStreamState("error");
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMessage("Camera access denied. Mind reading privileges revoked. Please allow camera access in browser permissions.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorMessage("No webcam detected. Please plug in a webcam or enable Demo Mode.");
      } else {
        setErrorMessage(err.message || "Unable to start webcam.");
      }
    }
  }, [settings.deviceId, settings.confidence]);

  // Main Real-Time Inference Loop
  const startVisionLoop = useCallback(() => {
    const targetIntervalMs = 60; // ~16 FPS throttled for stable laptop performance

    const onFrame = (now) => {
      if (!isMountedRef.current || !videoRef.current || videoRef.current.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(onFrame);
        return;
      }

      // Calculate FPS
      frameCountRef.current += 1;
      if (now - lastFpsCalcTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastFpsCalcTimeRef.current = now;
      }

      // Throttled inference
      if (now - lastInferTimeRef.current >= targetIntervalMs && landmarkerRef.current) {
        lastInferTimeRef.current = now;

        try {
          const result = landmarkerRef.current.detectForVideo(videoRef.current, now);
          const hasFace = Boolean(result?.faceLandmarks?.length);

          setFaceDetected(hasFace);

          if (!hasFace) {
            setLandmarksCount(0);
            drawLandmarkMesh(canvasRef.current, videoRef.current, null, {
              showTracking: settings.showTracking,
            });

            // Trigger "Where did you go?" if face is missing
            triggerCommentary("neutral", 0.3, 0.5, "noface");
          } else {
            const landmarks = result.faceLandmarks[0];
            setLandmarksCount(landmarks.length);

            // Extract blendshapes map
            const blendshapeMap = {};
            const categories = result.faceBlendshapes?.[0]?.categories || [];
            categories.forEach((c) => {
              blendshapeMap[c.categoryName] = c.score;
            });

            // Biomechanical extraction & classification
            const metrics = extractMetrics(landmarks);
            const classified = classifyExpression(metrics, blendshapeMap);

            // Temporal smoothing
            const smoothed = smootherRef.current.update(classified.scores);

            setExpression(smoothed.expression);
            setConfidence(smoothed.confidence);
            setIntensity(smoothed.intensity);

            // Draw landmark canvas mesh
            drawLandmarkMesh(canvasRef.current, videoRef.current, result, {
              showTracking: settings.showTracking,
            });

            // Log to timeline if new stable expression
            if (smoothed.isNewStableState) {
              setExpressionHistory((prev) => [
                {
                  id: crypto.randomUUID(),
                  timestamp: Date.now(),
                  expression: smoothed.expression,
                  confidence: smoothed.confidence,
                },
                ...prev.slice(0, 24),
              ]);
            }

            // Check commentary trigger
            if (
              (smoothed.isNewStableState || smoothed.stableFrames % 18 === 0) &&
              smoothed.confidence >= settings.confidence
            ) {
              triggerCommentary(
                smoothed.expression,
                smoothed.intensity,
                smoothed.confidence,
                "expression",
                smoothed.isNewStableState
              );
            }
          }
        } catch (e) {
          console.warn("Vision processing error:", e);
        }
      }

      animFrameRef.current = requestAnimationFrame(onFrame);
    };

    animFrameRef.current = requestAnimationFrame(onFrame);
  }, [settings.showTracking, settings.confidence, triggerCommentary]);

  // Demo Mode Simulator
  useEffect(() => {
    if (!demoMode) return;

    const demoExpressions = [
      { expr: "happy", conf: 0.95, int: 0.88 },
      { expr: "laughing", conf: 0.96, int: 0.94 },
      { expr: "concentrating", conf: 0.92, int: 0.85 },
      { expr: "fearful", conf: 0.90, int: 0.82 },
      { expr: "sad", conf: 0.88, int: 0.75 },
      { expr: "confused", conf: 0.91, int: 0.80 },
      { expr: "surprised", conf: 0.94, int: 0.92 },
      { expr: "thinking", conf: 0.89, int: 0.79 },
      { expr: "neutral", conf: 0.80, int: 0.35 },
    ];

    let idx = 0;
    setStarted(true);
    setStreamState("active");
    setFaceDetected(true);
    setLandmarksCount(468);
    setFps(30);

    const interval = setInterval(() => {
      const item = demoExpressions[idx % demoExpressions.length];
      idx += 1;

      setExpression(item.expr);
      setConfidence(item.conf);
      setIntensity(item.int);

      setExpressionHistory((prev) => [
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          expression: item.expr,
          confidence: item.conf,
        },
        ...prev.slice(0, 24),
      ]);

      triggerCommentary(item.expr, item.int, item.conf, "expression", true);
    }, 4500);

    return () => clearInterval(interval);
  }, [demoMode, triggerCommentary]);

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    speechRef.current.setMuted(next);
  };

  // Test Voice
  const handleTestVoice = () => {
    speechRef.current.setMuted(false);
    setIsMuted(false);
    speechRef.current.speak(
      "Audio output calibrated. Welcome to MindReader.exe. I am fully prepared to roast your facial expressions.",
      {
        voice: settings.voice,
        rate: settings.speed,
        pitch: settings.pitch,
        volume: settings.volume,
      }
    );
  };

  // Clear Handlers
  const handleClearCommentary = () => {
    setCommentaryHistory([]);
    comedyRef.current.clearMemory();
    setCommentaryText("Commentary history cleared. Ready for new facial observations.");
  };

  const handleClearExpressions = () => {
    setExpressionHistory([]);
    smootherRef.current.reset();
  };

  const handleReplaySpeech = () => {
    if (commentaryText && !isMuted) {
      speechRef.current.speak(commentaryText, {
        voice: settings.voice,
        rate: settings.speed,
        pitch: settings.pitch,
        volume: settings.volume,
      });
    }
  };

  // Render Initial Startup Screen if not started
  if (!started) {
    return (
      <main className={`app-shell ${settings.animation ? "" : "no-animation"}`}>
        <div className="ambient-grid" />
        <div className="ambient-glow glow-1" />
        <div className="ambient-glow glow-2" />

        <section className="hero-landing">
          <div className="hero-orb-visual">
            <div className="hero-orb-ring ring-1" />
            <div className="hero-orb-ring ring-2" />
            <div className="hero-orb-core">
              <span className="core-glyph">MR</span>
            </div>
          </div>

          <div className="hero-badge">
            <span className="badge-pulse" />
            REAL-TIME BROWSER COMPUTER VISION // COMEDY ENGINE
          </div>

          <h1 className="hero-title">
            MindReader<span className="title-accent">.exe</span>
          </h1>

          <p className="hero-tagline">“It knows what you’re thinking. Probably.”</p>

          <div className="boot-terminal">
            <div className="terminal-header">
              <span className="term-dot red" /><span className="term-dot yellow" /><span className="term-dot green" />
              <span className="term-title">system_boot.log</span>
            </div>
            <div className="terminal-body">
              <div>[SYSTEM] Initializing 468-point facial landmark pipeline...</div>
              <div>[CV] MediaPipe Tasks Vision WebAssembly active.</div>
              <div>[COMEDY] 13-state emotional behavioral classifier primed.</div>
              <div>[AUDIO] SpeechSynthesis narrator configured.</div>
              <div>[PRIVACY] Client-side guarantee verified: zero server frames.</div>
            </div>
          </div>

          <div className="hero-cta-group">
            <button className="cyber-button-primary" onClick={startCamera}>
              <span className="btn-label">START MIND READING</span>
              <span className="btn-arrow">➔</span>
            </button>

            <button
              className="cyber-button-secondary"
              onClick={() => {
                setDemoMode(true);
                setStarted(true);
              }}
            >
              <span>🎬 Launch Demo Mode</span>
            </button>
          </div>

          <p className="hero-privacy-note">
            🔒 100% in-browser processing. Your webcam never leaves your device.
          </p>
        </section>
      </main>
    );
  }

  // Render Main Application Dashboard
  return (
    <main className={`app-shell ${settings.animation ? "" : "no-animation"}`}>
      <div className="ambient-grid" />
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />

      <Header
        online={streamState === "active"}
        mindReadingMode={settings.mindReadingMode}
        demoMode={demoMode}
        onOpenSettings={() => setSettingsOpen(true)}
        onToggleDemo={() => setDemoMode((prev) => !prev)}
      />

      <div className="app-container">
        {/* Error Alert */}
        {errorMessage && (
          <div className="alert-banner error-banner">
            <div className="alert-content">
              <span className="alert-icon">⚠️</span>
              <div>
                <strong>{errorMessage}</strong>
                <p>Check browser permissions, ensure no other app is using your webcam, or try Demo Mode.</p>
              </div>
            </div>
            <div className="alert-actions">
              <button className="alert-btn" onClick={startCamera}>
                Try Again
              </button>
              <button
                className="alert-btn demo-btn"
                onClick={() => {
                  setDemoMode(true);
                  setErrorMessage("");
                }}
              >
                Use Demo Mode
              </button>
            </div>
          </div>
        )}

        {/* Loading Banner */}
        {streamState === "loading" && (
          <div className="alert-banner loading-banner">
            <div className="loading-spinner" />
            <span>Teaching the AI how humans make faces... (downloading model weights)</span>
          </div>
        )}

        {/* Main 2-Column Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left Column: Big Webcam View */}
          <div className="dash-col-left">
            <WebcamView
              videoRef={videoRef}
              canvasRef={canvasRef}
              streamState={streamState}
              fps={fps}
              faceDetected={faceDetected}
              landmarkCount={landmarksCount}
              showTracking={settings.showTracking}
              mirror={settings.mirror}
              videoDevices={videoDevices}
              selectedDeviceId={settings.deviceId}
              onSelectDevice={(id) => setSettings((s) => ({ ...s, deviceId: id }))}
              onToggleTracking={() => setSettings((s) => ({ ...s, showTracking: !s.showTracking }))}
              onToggleMirror={() => setSettings((s) => ({ ...s, mirror: !s.mirror }))}
              onToggleCamera={streamState === "active" ? stopCamera : startCamera}
            />
          </div>

          {/* Right Column: Expression State & Live Commentary */}
          <div className="dash-col-right">
            <ExpressionPanel
              expression={expression}
              confidence={confidence}
              intensity={intensity}
            />

            <CommentaryCard
              commentaryText={commentaryText}
              isSpeaking={isSpeaking}
              isMuted={isMuted}
              annoyanceLevel={annoyanceLevel}
              mindReadingMode={settings.mindReadingMode}
              onToggleMute={handleToggleMute}
              onClearOutput={handleClearCommentary}
              onReplaySpeech={handleReplaySpeech}
            />
          </div>
        </div>

        {/* Telemetry Analytics Grid */}
        <AnalyticsPanel
          faceDetected={faceDetected}
          expression={expression}
          confidence={confidence}
          intensity={intensity}
          fps={fps}
          landmarksCount={landmarksCount}
          delegate={getActiveDelegate()}
          aiMode={settings.aiMode}
        />

        {/* Dual Timelines (Expression Timeline + Commentary Archive) */}
        <HistoryPanel
          expressionHistory={expressionHistory}
          commentaryHistory={commentaryHistory}
          onClearCommentary={handleClearCommentary}
          onClearExpressions={handleClearExpressions}
        />

        {/* Security & Privacy Banner */}
        <PrivacyBanner />

        {/* Footer */}
        <footer className="dashboard-footer">
          <div className="footer-left">
            <span>MindReader.exe v1.0.0</span>
            <span className="dot-divider">•</span>
            <span>Fake Comedic Mind Reading based on Facial Expressions</span>
          </div>
          <div className="footer-right">
            <span>Client-side WebAssembly & WebGL</span>
            <span className="dot-divider">•</span>
            <span>Zero External Sensors</span>
          </div>
        </footer>
      </div>

      {/* Settings Modal Drawer */}
      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onUpdateSettings={setSettings}
          voices={voices}
          videoDevices={videoDevices}
          onClose={() => setSettingsOpen(false)}
          onTestVoice={handleTestVoice}
        />
      )}
    </main>
  );
}
