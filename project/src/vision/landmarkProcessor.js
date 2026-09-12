/**
 * 468-point Face Landmark Processor & Canvas Visualizer
 */

function dist(p1, p2) {
  if (!p1 || !p2) return 0;
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function clamp(val, min = 0, max = 1) {
  return Math.max(min, Math.min(max, val));
}

// MediaPipe 468-point landmark indices
export const LANDMARK_GROUPS = {
  leftEye: [33, 160, 158, 133, 153, 144],
  rightEye: [362, 385, 387, 263, 373, 380],
  leftEyebrow: [70, 63, 105, 66, 107],
  rightEyebrow: [300, 293, 334, 296, 336],
  lipsOutline: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78],
  lipsInner: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191],
  faceOval: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109],
};

/**
 * Extracts normalized biomechanical features from raw 468-point face landmarks.
 */
export function extractMetrics(landmarks) {
  if (!landmarks || landmarks.length < 468) {
    return null;
  }

  const lm = (idx) => landmarks[idx];

  // Eye dimensions
  const leftEyeWidth = dist(lm(33), lm(133)) || 0.01;
  const leftEyeHeight1 = dist(lm(160), lm(144));
  const leftEyeHeight2 = dist(lm(158), lm(153));
  const leftEAR = (leftEyeHeight1 + leftEyeHeight2) / (2 * leftEyeWidth);

  const rightEyeWidth = dist(lm(362), lm(263)) || 0.01;
  const rightEyeHeight1 = dist(lm(385), lm(380));
  const rightEyeHeight2 = dist(lm(387), lm(373));
  const rightEAR = (rightEyeHeight1 + rightEyeHeight2) / (2 * rightEyeWidth);

  const avgEAR = (leftEAR + rightEAR) / 2;
  const avgEyeWidth = (leftEyeWidth + rightEyeWidth) / 2;

  // Mouth metrics
  const mouthWidth = dist(lm(61), lm(291));
  const mouthHeight = dist(lm(13), lm(14));
  const mouthAspectRatio = mouthHeight / (mouthWidth || 0.01);
  const smileRatio = mouthWidth / avgEyeWidth;

  // Eyebrow metrics
  const browLeftHeight = lm(159).y - lm(105).y;
  const browRightHeight = lm(386).y - lm(334).y;
  const avgBrowRaise = (browLeftHeight + browRightHeight) / 2;
  const browAsymmetry = Math.abs(browLeftHeight - browRightHeight);
  const browDistance = dist(lm(107), lm(336)) / avgEyeWidth;

  // Jaw & Face geometry
  const faceWidth = dist(lm(234), lm(454)) || 0.01;
  const jawDrop = dist(lm(152), lm(10)) / faceWidth;

  // Head Pose proxies
  const nose = lm(1);
  const chin = lm(152);
  const leftEar = lm(234);
  const rightEar = lm(454);
  const earMidX = (leftEar.x + rightEar.x) / 2;
  const yaw = (nose.x - earMidX) * 4;
  const pitch = (chin.y - 0.6) * 3;

  return {
    eyeOpenness: clamp(avgEAR * 3.5),
    leftEAR,
    rightEAR,
    mouthOpenness: clamp(mouthAspectRatio * 2.2),
    smileIntensity: clamp((smileRatio - 1.7) / 0.8),
    browRaise: clamp((avgBrowRaise - 0.02) / 0.07),
    browFurrow: clamp((1.3 - browDistance) / 0.5),
    browAsymmetry: clamp(browAsymmetry * 18),
    jawOpen: clamp((jawDrop - 1.25) / 0.4),
    yaw: clamp(Math.abs(yaw)),
    pitch: clamp(Math.abs(pitch)),
    rawYaw: yaw,
    rawPitch: pitch,
    rawMouthWidth: smileRatio,
    rawEAR: avgEAR,
  };
}

/**
 * Draws high-tech landmark visualization overlay on the canvas.
 */
export function drawLandmarkMesh(canvas, video, result, options = {}) {
  if (!canvas || !video) return;

  const rect = video.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }

  const ctx = canvas.getContext("2d");
  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, rect.width, rect.height);

  if (!options.showTracking || !result?.faceLandmarks?.length) {
    ctx.restore();
    return;
  }

  const landmarks = result.faceLandmarks[0];
  const width = rect.width;
  const height = rect.height;

  // Helper to connect points
  const drawContour = (indices, strokeStyle, lineWidth = 1, close = false) => {
    ctx.beginPath();
    indices.forEach((idx, i) => {
      const p = landmarks[idx];
      if (!p) return;
      const x = p.x * width;
      const y = p.y * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    if (close) ctx.closePath();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  // Draw contours
  drawContour(LANDMARK_GROUPS.leftEye, "rgba(121, 244, 255, 0.75)", 1.2, true);
  drawContour(LANDMARK_GROUPS.rightEye, "rgba(121, 244, 255, 0.75)", 1.2, true);
  drawContour(LANDMARK_GROUPS.leftEyebrow, "rgba(168, 140, 255, 0.75)", 1.4);
  drawContour(LANDMARK_GROUPS.rightEyebrow, "rgba(168, 140, 255, 0.75)", 1.4);
  drawContour(LANDMARK_GROUPS.lipsOutline, "rgba(117, 247, 178, 0.65)", 1.2, true);
  drawContour(LANDMARK_GROUPS.lipsInner, "rgba(117, 247, 178, 0.45)", 0.8, true);
  drawContour(LANDMARK_GROUPS.faceOval, "rgba(121, 244, 255, 0.25)", 1);

  // Draw discrete mesh points (sparse to keep high performance)
  ctx.fillStyle = "rgba(121, 244, 255, 0.85)";
  const step = 3;
  for (let i = 0; i < landmarks.length; i += step) {
    const pt = landmarks[i];
    const x = pt.x * width;
    const y = pt.y * height;
    ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
  }

  // Highlight center nose and chin tracking points
  const nose = landmarks[1];
  if (nose) {
    ctx.beginPath();
    ctx.arc(nose.x * width, nose.y * height, 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(121, 244, 255, 0.95)";
    ctx.fill();
  }

  ctx.restore();
}
