"use client";

import { Card } from "@/components/ui/card";
import { useInterviewStore } from "@/lib/store/interviewStore";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";

interface QuestionPanelProps {
  question: string;
  speakerOn: boolean;
  onToggleSpeaker: () => void;
}

export function QuestionPanel({
  question,
  speakerOn,
  onToggleSpeaker,
}: QuestionPanelProps) {
  return (
    <Card className="w-full border-none bg-transparent py-0 backdrop-blur-xl shadow-none">
      <div className="flex items-center gap-2">
        <h1 className="text-pretty tracking-wide  text-lg font-semibold sm:text-xl lg:text-2xl">
          {question}
        </h1>
        <div className="mt-1 shrink-0">
          {/* <button
            type="button"
            onClick={onToggleSpeaker}
            aria-pressed={speakerOn}
            aria-label={speakerOn ? "Turn speaker off" : "Turn speaker on"}
            className={cn(
              "ms-2 rounded-md border border-border/40 p-2 transition-colors",
              speakerOn ? "bg-secondary text-secondary-foreground" : "bg-muted"
            )}
            title={speakerOn ? "Speaker on" : "Speaker off"}
          >
            {speakerOn ? (
              <Volume2 className="size-5" />
            ) : (
              <VolumeX className="size-5" />
            )}
          </button> */}
        </div>
      </div>
    </Card>
  );
}
