"use client";

class TurpiVoiceEngine {
  private isSpeakingState: boolean = false;
  private listeners: Set<(speaking: boolean) => void> = new Set();

  public subscribe(listener: (speaking: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isSpeakingState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeakingState = speaking;
    this.listeners.forEach((l) => l(speaking));
  }

  public speak(text: string): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("SpeechSynthesis not supported on this browser");
      return;
    }

    // Stop previous utterance
    window.speechSynthesis.cancel();

    if (!text || !text.trim()) {
      this.notify(false);
      return;
    }

    // Clean text of markdown asterisks or technical code tags before speaking
    const cleanText = text
      .replace(/[*_#`~]/g, "")
      .replace(/\[.*?\]/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Find best Spanish voice
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice =
      voices.find((v) => v.lang.startsWith("es-VE")) ||
      voices.find((v) => v.lang.startsWith("es-419")) ||
      voices.find((v) => v.lang.startsWith("es-US")) ||
      voices.find((v) => v.lang.startsWith("es-MX")) ||
      voices.find((v) => v.lang.startsWith("es"));

    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.lang = "es-VE";
    // Slightly higher pitch for a friendly, charming mascot bird
    utterance.pitch = 1.15;
    utterance.rate = 1.05;

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
    };

    utterance.onerror = () => {
      this.notify(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.notify(false);
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

export const turpiVoice = new TurpiVoiceEngine();
