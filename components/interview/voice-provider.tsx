"use client";

import type React from "react";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type VoiceCtx = {
  enabled: boolean;
  toggle: (v: boolean) => void;
  speak: (text: string) => void;
  stop: () => void;
  speaking: boolean;
};

const Ctx = createContext<VoiceCtx | null>(null);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined") return;
      if (!enabled) return;
      stop();
      const u = new SpeechSynthesisUtterance(text);
      utteranceRef.current = u;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis?.speak(u);
    },
    [enabled, stop]
  );

  const toggle = useCallback(
    (v: boolean) => {
      setEnabled(v);
      if (!v) {
        stop();
      }
    },
    [stop]
  );

  const value = useMemo<VoiceCtx>(
    () => ({ enabled, toggle, speak, stop, speaking }),
    [enabled, toggle, speak, stop, speaking]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVoice() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useVoice must be used within VoiceProvider");
  return ctx;
}
