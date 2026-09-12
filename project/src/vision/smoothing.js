/**
 * Temporal Smoothing and Hysteresis Engine for Facial Expression Predictions
 */

export class TemporalSmoother {
  constructor(options = {}) {
    this.smoothingFactor = options.smoothingFactor ?? 0.75; // 0 = no smoothing, 1 = maximum inertia
    this.smoothedScores = {};
    this.history = [];
    this.historyLimit = 15;
    this.currentExpression = "neutral";
    this.stableFrames = 0;
  }

  setSmoothingFactor(val) {
    this.smoothingFactor = Math.max(0.2, Math.min(0.95, val));
  }

  /**
   * Smooths incoming frame scores and applies hysteresis.
   * @param {Object} rawScores Dict of { [expression]: score }
   * @returns {Object} { expression, confidence, intensity, smoothedScores, isNewStableState }
   */
  update(rawScores) {
    const alpha = 1 - this.smoothingFactor; // responsiveness
    const nextScores = {};

    for (const [key, val] of Object.entries(rawScores)) {
      const prev = this.smoothedScores[key] ?? val;
      nextScores[key] = prev + (val - prev) * alpha;
    }
    this.smoothedScores = nextScores;

    // Determine leading smoothed score
    const sorted = Object.entries(nextScores).sort((a, b) => b[1] - a[1]);
    const [dominantExpr, dominantScore] = sorted[0];
    const secondScore = sorted[1]?.[1] || 0.1;

    // Track history for mode stability
    this.history.push(dominantExpr);
    if (this.history.length > this.historyLimit) {
      this.history.shift();
    }

    // Check if new expression is sufficiently stable
    let isNewStableState = false;
    if (dominantExpr === this.currentExpression) {
      this.stableFrames += 1;
    } else {
      // Require a small margin and consecutive frames to flip dominant state
      const margin = dominantScore - (nextScores[this.currentExpression] || 0);
      if (margin > 0.08) {
        this.currentExpression = dominantExpr;
        this.stableFrames = 1;
        isNewStableState = true;
      } else {
        this.stableFrames += 1;
      }
    }

    const confidence = Math.min(0.98, Math.max(0.45, 0.55 + (dominantScore - secondScore) * 1.3));
    const intensity = Math.min(1.0, Math.max(0.15, dominantScore * 1.15));

    return {
      expression: this.currentExpression,
      confidence: Number(confidence.toFixed(2)),
      intensity: Number(intensity.toFixed(2)),
      smoothedScores: nextScores,
      stableFrames: this.stableFrames,
      isNewStableState,
    };
  }

  reset() {
    this.smoothedScores = {};
    this.history = [];
    this.currentExpression = "neutral";
    this.stableFrames = 0;
  }
}
