/**
 * Real-Time Multi-State Expression Classifier
 * Features fine-tuned detection for:
 * - Happy / സന്തോഷം
 * - Laughing / പൊട്ടിച്ചിരി
 * - Concentration / കുത്തിയിരുന്ന് നോക്കൽ
 * - Fear / പേടി
 * - Sad / വിഷമം
 * - Confused / കൺഫ്യൂസ്ഡ്
 * - Surprised / ഞെട്ടൽ
 * - Thinking / ആലോചന
 * - Neutral / ശാന്തം
 * and supporting emotional states.
 */

export const EXPRESSION_METADATA = {
  neutral: {
    label: "Neutral",
    emoji: "😐",
    code: "NEU",
    desc: "Baseline resting state. No extreme emotional signals detected.",
  },
  happy: {
    label: "Happy",
    emoji: "😄",
    code: "HAP",
    desc: "Suspicious levels of cheerfulness. Dopamine spike confirmed.",
  },
  laughing: {
    label: "Laughing",
    emoji: "😂",
    code: "LAU",
    desc: "Uncontrollable silliness breached. Full smile with eye crinkle.",
  },
  concentrating: {
    label: "Concentration",
    emoji: "🧐",
    code: "FOC",
    desc: "Intense tunnel-vision focus. Deep cognitive computing underway.",
  },
  thinking: {
    label: "Thinking",
    emoji: "🤔",
    code: "THK",
    desc: "Decision making and contemplation. Internal puzzle in progress.",
  },
  confused: {
    label: "Confused",
    emoji: "🤨",
    code: "CON",
    desc: "Brain.exe has encountered an unexpected logic paradox.",
  },
  surprised: {
    label: "Surprised",
    emoji: "😲",
    code: "SUR",
    desc: "High eyebrow raise and wide eyes. Reality shockwave registered.",
  },
  fearful: {
    label: "Fear",
    emoji: "😨",
    code: "FEA",
    desc: "Alert wide eyes and facial tension. Existential dread detected.",
  },
  sad: {
    label: "Sad",
    emoji: "😔",
    code: "SAD",
    desc: "Downturned mouth and subdued expression. Emotional damage detected.",
  },
  angry: {
    label: "Angry",
    emoji: "😠",
    code: "ANG",
    desc: "Violence protocol primed. Intense furrowed brow detected.",
  },
  sleepy: {
    label: "Sleepy",
    emoji: "😴",
    code: "SLP",
    desc: "Eyelids negotiating with gravity. Low power mode imminent.",
  },
  bored: {
    label: "Bored",
    emoji: "🥱",
    code: "BOR",
    desc: "Zero engagement detected. Brain currently out of office.",
  },
  disgusted: {
    label: "Disgusted",
    emoji: "🤢",
    code: "DIS",
    desc: "Physical sensory rejection of surroundings.",
  },
};

function clamp(v, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function avg(a = 0, b = 0) {
  return (a + b) / 2;
}

/**
 * Classifies facial metrics & blendshapes into one of the expressions.
 */
export function classifyExpression(metrics, blendshapeMap = {}) {
  if (!metrics) {
    return {
      expression: "neutral",
      confidence: 0.5,
      intensity: 0.2,
      scores: { neutral: 0.5 },
      metrics: {},
    };
  }

  // Blendshapes (if available from MediaPipe, fallback to metrics)
  const bsSmile = avg(blendshapeMap.mouthSmileLeft, blendshapeMap.mouthSmileRight);
  const bsFrown = avg(blendshapeMap.mouthFrownLeft, blendshapeMap.mouthFrownRight);
  const bsBrowDown = avg(blendshapeMap.browDownLeft, blendshapeMap.browDownRight);
  const bsBrowUp = avg(blendshapeMap.browOuterUpLeft, blendshapeMap.browOuterUpRight);
  const bsBrowInnerUp = blendshapeMap.browInnerUp || 0;
  const bsEyeSquint = avg(blendshapeMap.eyeSquintLeft, blendshapeMap.eyeSquintRight);
  const bsEyeWide = avg(blendshapeMap.eyeWideLeft, blendshapeMap.eyeWideRight);
  const bsEyeBlink = avg(blendshapeMap.eyeBlinkLeft, blendshapeMap.eyeBlinkRight);
  const bsJawOpen = blendshapeMap.jawOpen || metrics.jawOpen;
  const bsSneer = avg(blendshapeMap.noseSneerLeft, blendshapeMap.noseSneerRight);
  const bsCheekSquint = avg(blendshapeMap.cheekSquintLeft, blendshapeMap.cheekSquintRight);
  const bsMouthStretch = avg(blendshapeMap.mouthStretchLeft, blendshapeMap.mouthStretchRight);

  // Brow asymmetry: either blendshapes or geometrical landmark metrics
  const bsBrowAsymmetry = Math.abs((blendshapeMap.browOuterUpLeft || 0) - (blendshapeMap.browOuterUpRight || 0));
  const browAsymmetry = Math.max(bsBrowAsymmetry, metrics.browAsymmetry || 0);

  // Blended signals
  const smile = bsSmile > 0.05 ? bsSmile : metrics.smileIntensity;
  const mouthOpen = bsJawOpen > 0.05 ? bsJawOpen : metrics.mouthOpenness;
  const browRaise = bsBrowUp > 0.05 ? bsBrowUp : metrics.browRaise;
  const browFurrow = bsBrowDown > 0.05 ? bsBrowDown : metrics.browFurrow;
  const eyeOpen = 1 - (bsEyeBlink > 0.05 ? bsEyeBlink : (1 - metrics.eyeOpenness));
  const eyeWide = Math.max(bsEyeWide, metrics.rawEAR ? clamp((metrics.rawEAR - 0.28) * 4) : 0);
  const headAversion = clamp((metrics.yaw || 0) * 0.8 + (metrics.pitch || 0) * 0.8);

  // Compute raw scores for each expression
  const rawScores = {
    // 1. Laughing: broad smile + open mouth + crinkled squinting eyes
    laughing: clamp(
      smile * 0.50 +
      mouthOpen * 0.35 +
      (bsEyeSquint || bsCheekSquint) * 0.30
    ),

    // 2. Happy: noticeable smile + relaxed forehead
    happy: clamp(
      smile * 0.70 +
      (1 - browFurrow) * 0.20 +
      (eyeOpen > 0.3 ? 0.10 : 0) -
      bsFrown * 0.45
    ),

    // 3. Surprised: both brows raised high + jaw dropped + round wide eyes
    surprised: clamp(
      browRaise * 0.40 +
      mouthOpen * 0.35 +
      eyeWide * 0.35
    ),

    // 4. Fearful: wide alert eyes + inner brow raised high + slightly open/tensed mouth
    fearful: clamp(
      eyeWide * 0.45 +
      bsBrowInnerUp * 0.35 +
      (mouthOpen > 0.12 ? 0.25 : 0) +
      (bsMouthStretch * 0.25) +
      (1 - smile) * 0.20
    ),

    // 5. Confused: asymmetric eyebrow position + head tilt/yaw + puzzled squint
    confused: clamp(
      browAsymmetry * 0.45 +
      bsBrowInnerUp * 0.30 +
      browFurrow * 0.25 +
      (metrics.yaw > 0.12 ? 0.20 : 0) +
      (1 - smile) * 0.15
    ),

    // 6. Thinking: contemplation pose with gaze aversion/head tilt, closed mouth, light brow movement
    thinking: clamp(
      headAversion * 0.40 +
      (1 - mouthOpen) * 0.25 +
      (1 - smile) * 0.20 +
      (bsBrowInnerUp > 0.15 ? 0.20 : 0) +
      (browAsymmetry > 0.15 ? 0.15 : 0) -
      browFurrow * 0.25 // thinking is lighter and more wandering than intense furrowed concentration
    ),

    // 7. Concentrating: direct laser stare, prominent brow furrow, tightly held mouth, low head motion
    concentrating: clamp(
      browFurrow * 0.45 +
      (1 - mouthOpen) * 0.25 +
      (1 - smile) * 0.20 +
      (headAversion < 0.2 ? 0.20 : 0) +
      (eyeOpen > 0.35 ? 0.10 : 0)
    ),

    // 8. Sad: downturned mouth frown + inner brow lift + subdued gaze
    sad: clamp(
      bsFrown * 0.65 +
      bsBrowInnerUp * 0.25 +
      (1 - smile) * 0.25 -
      mouthOpen * 0.30
    ),

    // 9. Angry: intense downward brow furrow + tight lips + eye squint
    angry: clamp(
      browFurrow * 0.65 +
      bsEyeSquint * 0.25 +
      (1 - smile) * 0.20 -
      browRaise * 0.30
    ),

    // 10. Sleepy: heavy blinking / low eye openness
    sleepy: clamp(
      (1 - eyeOpen) * 0.70 +
      bsEyeBlink * 0.30 +
      (1 - browRaise) * 0.15 -
      smile * 0.30
    ),

    // 11. Bored: flat affect + low engagement + unmoving mouth
    bored: clamp(
      (1 - eyeOpen) * 0.35 +
      (1 - smile) * 0.25 +
      (1 - browRaise) * 0.25 +
      (1 - mouthOpen) * 0.20
    ),

    // 12. Disgusted: nose sneer + lip curl
    disgusted: clamp(
      bsSneer * 0.60 +
      bsFrown * 0.30 +
      bsEyeSquint * 0.20 -
      smile * 0.30
    ),

    // 13. Neutral: baseline resting state
    neutral: 0.30,
  };

  // Sort scores descending
  const sorted = Object.entries(rawScores).sort((a, b) => b[1] - a[1]);
  const [dominantKey, topScore] = sorted[0];
  const secondScore = sorted[1]?.[1] || 0.20;

  // Margin-based confidence calculation
  const margin = topScore - secondScore;
  const confidence = clamp(0.55 + margin * 1.35, 0.40, 0.98);
  const intensity = clamp(topScore * 1.15, 0.15, 1.0);

  return {
    expression: dominantKey,
    confidence: Number(confidence.toFixed(2)),
    intensity: Number(intensity.toFixed(2)),
    scores: rawScores,
    metrics,
  };
}
