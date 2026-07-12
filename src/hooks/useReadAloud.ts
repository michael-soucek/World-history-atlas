"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export function useReadAloud(text: string) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getBestVoice = useCallback(() => {
    if (typeof window === "undefined") return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    // Preference: 
    // 1. Google US English (Natural)
    // 2. Premium/Higher quality system voices (Enhanced/Samantha)
    // 3. Any English US voice
    // 4. Any English voice
    // 5. Default
    
    // Sort criteria: priority (0-10), name includes high quality strings
    const englishVoices = voices.filter(v => v.lang.startsWith("en"));
    
    const googleVoice = englishVoices.find(v => v.name === "Google US English");
    if (googleVoice) return googleVoice;

    const samantha = englishVoices.find(v => v.name.includes("Samantha"));
    if (samantha) return samantha;

    const enhanced = englishVoices.find(v => v.name.toLowerCase().includes("enhanced"));
    if (enhanced) return enhanced;

    const usEnglish = englishVoices.find(v => v.lang === "en-US");
    if (usEnglish) return usEnglish;

    return englishVoices[0] || null;
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  const play = useCallback(() => {
    if (typeof window === "undefined") return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text: strip HTML, citations [1], licenses, and URLs
    const cleanText = text
      .replace(/<[^>]*>/g, "")
      .replace(/\[\d+\]/g, "")
      .replace(/CC BY-SA [\d.]+/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const bestVoice = getBestVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }
    
    utteranceRef.current = utterance;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = (e) => {
      if (e.error !== "interrupted") {
        console.error("Speech error:", e);
      }
      setIsSpeaking(false);
      setIsPaused(false);
    };

    // Need to wait slightly for cancel to take effect in some browsers
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 10);
  }, [text, isPaused]);

  const pause = useCallback(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  }, []);

  // Cancel speech on unmount or navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { isSpeaking, isPaused, play, pause, stop };
}
