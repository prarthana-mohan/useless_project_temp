/**
 * MindReader.exe Modular Comedy Engine (Malayalam Edition)
 * Dynamically serves contextual Malayalam dialogue, killer transition lines,
 * and telepathic thought streams with anti-repetition memory.
 */

import {
  JOKES,
  INTERNAL_THOUGHTS,
  KILLER_LINES,
  STYLE_PREFIXES,
  NO_FACE_JOKES,
} from "./jokeDatabase.js";

function pickRandom(array) {
  if (!array || !array.length) return "";
  return array[Math.floor(Math.random() * array.length)];
}

export class ComedyEngine {
  constructor(options = {}) {
    this.usedJokes = new Set();
    this.usedLimit = 35;
    this.lastCommentTimestamp = 0;
    this.lastNoFaceTimestamp = 0;
    this.previousExpression = null;
    this.backendUrl = options.backendUrl || "http://localhost:8787/api/commentary";
  }

  /**
   * Generates commentary based on current telemetry and user settings.
   */
  async generate({
    expression = "neutral",
    intensity = 0.5,
    confidence = 0.7,
    style = "Random",
    roast = "Normal",
    mindReadingMode = false,
    aiMode = false,
    isTransition = false,
    context = "live session",
  }) {
    // 1. Try Optional AI Backend if enabled
    if (aiMode) {
      try {
        const aiText = await this.fetchAiCommentary({
          expression,
          intensity,
          confidence,
          style,
          roast,
          mindReadingMode,
          context,
        });
        if (aiText) {
          return aiText;
        }
      } catch (e) {
        console.warn("AI Backend commentary failed, falling back to local engine:", e.message);
      }
    }

    // 2. Generate Local Malayalam Commentary
    return this.generateLocal({
      expression,
      intensity,
      confidence,
      style,
      roast,
      mindReadingMode,
      isTransition,
    });
  }

  generateLocal({
    expression = "neutral",
    intensity = 0.5,
    confidence = 0.7,
    style = "Random",
    roast = "Normal",
    mindReadingMode = false,
    isTransition = false,
  }) {
    // Check if we should inject a context-independent killer line
    // High probability when switching between distinct emotional states, or ~20% random chance
    const isExprChange = this.previousExpression && this.previousExpression !== expression;
    this.previousExpression = expression;

    const useKillerLine =
      !mindReadingMode &&
      KILLER_LINES.length > 0 &&
      ((isTransition && Math.random() < 0.35) || (isExprChange && Math.random() < 0.25) || Math.random() < 0.15);

    let bank;
    if (useKillerLine) {
      bank = KILLER_LINES;
    } else if (mindReadingMode) {
      bank = INTERNAL_THOUGHTS[expression] || INTERNAL_THOUGHTS.neutral;
    } else {
      bank = JOKES[expression] || JOKES.neutral;
    }

    // Filter out recently used jokes to prevent repetition
    const available = bank.filter((j) => !this.usedJokes.has(j));
    const selectedJoke = pickRandom(available.length > 0 ? available : bank);

    // Remember in LRU set
    this.usedJokes.add(selectedJoke);
    if (this.usedJokes.size > this.usedLimit) {
      const first = this.usedJokes.values().next().value;
      this.usedJokes.delete(first);
    }

    let output = selectedJoke;

    // Apply Style prefix if not a killer line and not in pure Mind Reading Mode
    if (!mindReadingMode && !useKillerLine) {
      const prefixPool = STYLE_PREFIXES[style] || STYLE_PREFIXES.Random;
      const prefix = pickRandom(prefixPool);
      if (prefix && Math.random() < 0.5) {
        output = `${prefix} ${output}`;
      }
    }

    // Intensity & Roast Modulations
    if (roast === "Unhinged" && intensity > 0.75) {
      const unhingedSuffixes = [
        " We are all witnessing history here.",
        " The council of AI has taken official notes.",
        " Sound the alarm.",
        " May the compiler have mercy on your soul.",
        " This reaction is being permanently archived.",
      ];
      output += pickRandom(unhingedSuffixes);
    } else if (roast === "Gentle") {
      output = output
        .replace("Brain.exe has stopped responding.", "Brain.exe is resting.")
        .replace("chosen violence", "chosen determination")
        .replace("ABORT MISSION.", "Pause and breathe.");
    }

    return output;
  }

  generateNoFace() {
    const now = Date.now();
    if (now - this.lastNoFaceTimestamp < 12000) {
      return null;
    }
    this.lastNoFaceTimestamp = now;
    return pickRandom(NO_FACE_JOKES);
  }

  async fetchAiCommentary(payload) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2600);

    try {
      const res = await fetch(this.backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) return null;
      const data = await res.json();
      return data.ok && data.text ? data.text : null;
    } catch {
      clearTimeout(timeout);
      return null;
    }
  }

  clearMemory() {
    this.usedJokes.clear();
    this.previousExpression = null;
  }
}
