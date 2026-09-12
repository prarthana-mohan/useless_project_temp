/**
 * SpeechSynthesis Audio Controller with Malayalam Support and Queue Control
 */

export class SpeechEngine {
  constructor() {
    this.synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.voices = [];
    this.isSpeaking = false;
    this.muted = false;
    this.listeners = new Set();
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;

    const populate = () => {
      this.voices = this.synth.getVoices() || [];
      this.notifyListeners();
    };

    populate();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth.onvoiceschanged = populate;
    }
  }

  getVoices() {
    return this.voices;
  }

  getRecommendedVoice() {
    if (!this.voices.length) return null;

    // Prefer English voices with clear narration
    const englishVoices = this.voices.filter((v) => v.lang.startsWith("en"));
    const preferredNames = ["google", "natural", "samantha", "daniel", "david", "mark", "zira", "george"];

    for (const name of preferredNames) {
      const match = englishVoices.find((v) => v.name.toLowerCase().includes(name));
      if (match) return match;
    }

    return englishVoices[0] || this.voices[0] || null;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.muted && this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.notifyListeners();
    }
  }

  speak(text, options = {}) {
    if (this.muted || !this.synth || !text) {
      return false;
    }

    // Cancel any currently speaking utterance
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || "en-US";

    const selectedVoice =
      this.voices.find((v) => v.name === options.voice) ||
      this.getRecommendedVoice();

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = Math.max(0.6, Math.min(1.8, options.rate ?? 1.0));
    utterance.pitch = Math.max(0.6, Math.min(1.8, options.pitch ?? 1.05));
    utterance.volume = Math.max(0, Math.min(1.0, options.volume ?? 0.95));

    this.isSpeaking = true;
    this.notifyListeners();

    utterance.onend = () => {
      this.isSpeaking = false;
      this.notifyListeners();
    };

    utterance.onerror = (e) => {
      // Audio errors are non-fatal
      this.isSpeaking = false;
      this.notifyListeners();
    };

    this.synth.speak(utterance);
    return true;
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.notifyListeners();
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach((cb) => cb({ isSpeaking: this.isSpeaking, voices: this.voices }));
  }
}
