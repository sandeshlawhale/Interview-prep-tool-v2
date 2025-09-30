"use client";

import { VoiceProvider } from "@/components/interview/voice-provider";
import { InterviewClient } from "@/components/InterviewClient";

export default function InterviewPage() {
  return (
    <VoiceProvider>
      <InterviewClient />
    </VoiceProvider>
  );
}
