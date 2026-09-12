import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.20/wasm";
const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

let landmarkerInstance = null;
let currentDelegate = "GPU";

/**
 * Initializes the MediaPipe Face Landmarker with GPU delegate and CPU fallback.
 */
export async function initFaceLandmarker(options = {}) {
  if (landmarkerInstance) {
    return landmarkerInstance;
  }

  const vision = await FilesetResolver.forVisionTasks(WASM_URL);

  const baseConfig = {
    runningMode: "VIDEO",
    numFaces: 1,
    minFaceDetectionConfidence: options.confidence ?? 0.5,
    minFacePresenceConfidence: options.confidence ?? 0.5,
    minTrackingConfidence: options.confidence ?? 0.5,
    outputFaceBlendshapes: true,
    outputFacialTransformationMatrixes: false,
  };

  try {
    currentDelegate = "GPU";
    landmarkerInstance = await FaceLandmarker.createFromOptions(vision, {
      ...baseConfig,
      baseOptions: {
        modelAssetPath: MODEL_URL,
        delegate: "GPU",
      },
    });
    return landmarkerInstance;
  } catch (gpuError) {
    console.warn("GPU delegate failed for FaceLandmarker, falling back to CPU delegate:", gpuError);
    currentDelegate = "CPU";
    landmarkerInstance = await FaceLandmarker.createFromOptions(vision, {
      ...baseConfig,
      baseOptions: {
        modelAssetPath: MODEL_URL,
        delegate: "CPU",
      },
    });
    return landmarkerInstance;
  }
}

export function getActiveDelegate() {
  return currentDelegate;
}

export function disposeFaceLandmarker() {
  if (landmarkerInstance) {
    try {
      landmarkerInstance.close?.();
    } catch (e) {
      console.warn("Error closing landmarker:", e);
    }
    landmarkerInstance = null;
  }
}
