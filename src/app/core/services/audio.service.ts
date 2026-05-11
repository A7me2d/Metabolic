import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  isSpeaking = signal(false);
  private synth = window.speechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  /**
   * Speak the given text using text-to-speech
   */
  speak(text: string, rate: number = 1, pitch: number = 1): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject('Speech synthesis not supported');
        return;
      }

      // Cancel any ongoing speech
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        this.isSpeaking.set(true);
      };

      utterance.onend = () => {
        this.isSpeaking.set(false);
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking.set(false);
        reject(event);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  /**
   * Speak a number (for counting)
   */
  speakNumber(num: number): Promise<void> {
    return this.speak(num.toString(), 0.9);
  }

  /**
   * Speak completion message
   */
  speakComplete(): Promise<void> {
    return this.speak('Complete! Great job!', 0.9, 1.1);
  }

  /**
   * Speak countdown preparation message
   */
  speakReady(): Promise<void> {
    return this.speak('Get ready!', 1, 1);
  }

  /**
   * Stop any ongoing speech
   */
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking.set(false);
    }
  }

  /**
   * Check if speech synthesis is supported
   */
  isSupported(): boolean {
    return !!this.synth;
  }
}
