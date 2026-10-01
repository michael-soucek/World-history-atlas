"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const MAX_CHUNK = 200;

// Shared across every read-aloud button (speechSynthesis is one global queue).
// Incremented on every play/stop so a superseded chunk queue stops advancing.
let activeRunId = 0;

/**
 * Split text into chunks of at most ~MAX_CHUNK characters, breaking at
 * sentence ends where possible, then at commas/semicolons, then at spaces.
 */
function splitIntoChunks(text: string): string[] {
  const sentences = text.match(/[^.!?]+(?:[.!?]+["'\u201d\u2019)]*|$)\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  const flush = () => {
    if (current.trim()) chunks.push(current.trim());
    current = "";
  };
  for (const sentence of sentences) {
    if ((current + sentence).length <= MAX_CHUNK) {
      current += sentence;
      continue;
    }
    flush();
    if (sentence.length <= MAX_CHUNK) {
      current = sentence;
      continue;
    }
    // Over-long sentence: break at clause punctuation, then at word boundaries.
    for (const part of sentence.split(/(?<=[,;:\u2014])\s+/)) {
      if ((current + " " + part).length <= MAX_CHUNK) {
        current = current ? current + " " + part : part;
        continue;
      }
      flush();
      let rest = part;
      while (rest.length > MAX_CHUNK) {
        const cut = rest.lastIndexOf(" ", MAX_CHUNK);
        const at = cut > 0 ? cut : MAX_CHUNK;
        chunks.push(rest.slice(0, at).trim());
        rest = rest.slice(at);
      }
      current = rest;
    }
  }
  flush();
  return chunks;
}

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
      activeRunId++;
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

    // Small hack for some browsers that require a resume() before speak() if it was in a weird state
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Clean text: strip HTML, citations [1], licenses, and URLs
    const cleanText = text
      .replace(/<[^>]*>/g, "")
      .replace(/\[\d+\]/g, "")
      .replace(/CC BY-SA [\d.]+/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) return;

    // Speak in sentence-sized chunks, one after another. A single long
    // utterance gets cut off: Chrome silently stops after ~15 seconds of
    // speech (notably with Google voices), so whole articles never finished.
    const chunks = splitIntoChunks(cleanText);
    const bestVoice = getBestVoice();
    const runId = ++activeRunId;

    const speakChunk = (i: number) => {
      // Superseded by stop() or another button's play() — end this queue.
      if (runId !== activeRunId) {
        setIsSpeaking(false);
        setIsPaused(false);
        return;
      }
      if (i >= chunks.length) {
        setIsSpeaking(false);
        setIsPaused(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(chunks[i]);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }
      utteranceRef.current = utterance;

      utterance.onstart = () => {
        if (runId !== activeRunId) return;
        setIsSpeaking(true);
        setIsPaused(false);
      };
      utterance.onend = () => speakChunk(i + 1);
      utterance.onerror = (e) => {
        // "interrupted"/"canceled" are expected when switching buttons or stopping
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.error("SpeechSynthesis error:", e.error);
        }
        if (runId === activeRunId) activeRunId++;
        setIsSpeaking(false);
        setIsPaused(false);
      };
      window.speechSynthesis.speak(utterance);
    };

    // Small delay ensures cancel() has finished and prevents some browsers 
    // from ignoring the speak() call if it's too rapid.
    setTimeout(() => speakChunk(0), 50);
  }, [text, isPaused, getBestVoice]);

  const pause = useCallback(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  }, []);

  // Warm up voices on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.getVoices();
      
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      
      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
      return () => window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    }
  }, []);

  // Cancel speech on unmount or navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (typeof window !== "undefined") {
        activeRunId++;
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { isSpeaking, isPaused, play, pause, stop };
}
