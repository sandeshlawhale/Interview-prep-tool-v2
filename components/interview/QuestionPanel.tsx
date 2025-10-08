"use client";

import { Card } from "@/components/ui/card";
import { useInterviewStore } from "@/lib/store/interviewStore";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "../ui/button";

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
  const { isAISpeaking, stopSpeaking, audioInstance } = useInterviewStore();

  return (
    <Card className="w-full border-none bg-transparent py-0 backdrop-blur-xl shadow-none gap-2">
      {isAISpeaking && (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-1 py-0 sm:px-2 sm:py-1 h-fit text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition cursor-pointer"
            onClick={stopSpeaking}
          >
            <div className="relative w-4 h-4 flex items-center justify-center">
              {audioInstance ? (
                <Volume2 className="size-5" />
              ) : (
                <VolumeX className="size-5" />
              )}
              {audioInstance && (
                <div className="absolute sm:w-6 sm:h-6 w-4 h-4 bg-[#000] text-white opacity-50 rounded-full animate-ping duration-300" />
              )}
            </div>
            <span>Skip Audio</span>
          </Button>
          {/* {!audioInstance && (
            <p className="text-sm text-muted-foreground italic hidden sm:flex">
              Generating audio...
            </p>
          )} */}
        </div>
      )}
      <div className="flex items-start gap-2">
        <h1 className="text-pretty tracking-wide  text-lg font-semibold sm:text-xl lg:text-2xl">
          {question}
        </h1>
      </div>
    </Card>
  );
}
