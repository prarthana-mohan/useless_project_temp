# MindReader.exe

> It knows what you're thinking. Probably.

MindReader.exe is a deliberately useless but technically serious real-time computer-vision comedy app. It uses the laptop webcam, MediaPipe Face Landmarker, temporal smoothing, a local rule-based expression classifier, browser speech synthesis, and an optional Gemini backend.

## Important

This is **fictional AI commentary**, not mind reading, diagnosis, emotion truth, or face recognition.

By default, webcam frames stay in the browser. The app does not upload, record, or save webcam images.

## Stack

- React 19
- Vite 8
- MediaPipe Tasks Vision Face Landmarker (current npm package)
- Browser MediaDevices API
- Canvas overlay
- Web Speech API
- localStorage
- Optional Node/Express + Gemini API backend

Vite's current setup uses `npm run dev`; modern Vite requires a current Node version. See the Vite documentation if npm reports a Node compatibility error.

## Run

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173
```

Allow camera access, then press **START MIND READING**.

## Optional AI mode

The app works without an API key.

For optional AI-generated jokes:

```bash
copy .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then set:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=8787
```

Start both frontend and backend:

```bash
npm run dev:full
```

The frontend automatically tries `http://localhost:8787/api/commentary` when AI mode is enabled in Settings. If it fails, it falls back to the local comedy engine.

## Architecture

```text
Webcam
  ↓
MediaPipe Face Landmarker
  ↓
468-point face landmarks + optional blendshapes
  ↓
Feature extraction
  ↓
Expression scoring
  ↓
Temporal smoothing
  ↓
Expression state
  ↓
Comedy trigger / anti-repeat / cooldown
  ↓
Local comedy OR optional Gemini backend
  ↓
Text + SpeechSynthesis
```

## Features

- Real-time webcam
- Face landmark visualization
- Smile / brow / eye / mouth / head-pose metrics
- Expression scoring
- Temporal smoothing
- Confidence and intensity
- Comedy styles
- Roast intensity
- Anti-repeat joke selection
- Commentary cooldown
- Browser voice controls
- Expression history
- Commentary history
- Demo mode
- Annoyance meter
- No-face micro-interactions
- Camera selection
- Mirror toggle
- localStorage settings
- Optional Gemini backend
- Graceful fallback when speech or AI is unavailable
- Accessibility and reduced-motion support

## Troubleshooting

### Camera denied

Use the browser's site permissions to allow camera access, then reload or press Try Again.

### No face

Move into better lighting and face the camera. The model needs a visible face.

### Model won't load

The face model is downloaded from Google's MediaPipe model hosting on first use, so an internet connection is needed to fetch the model the first time.

### Speech does not work

Speech synthesis depends on the browser and installed system voices. Commentary still appears as text.

### Backend AI is unavailable

That is expected if `GEMINI_API_KEY` is empty. Local mode is intentionally fully functional without it.

## Privacy

No face recognition is performed. No identity profile is created. No webcam recording is stored. The browser processes the camera stream locally for the visual analysis pipeline.

## Demo tip

Enable **Demo Mode**, **Show Tracking**, and **Programmer** or **Unhinged** style. Then deliberately switch between neutral, smile, surprise, and sleepy expressions.
