"use client";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, SkipForward, Send } from "lucide-react";
import { Magnetic } from "./motion-primitives/magnetic";

interface AnswerAreaProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  recording: boolean;
  onToggleRecord: () => void;
}

export function AnswerArea({
  value,
  onChange,
  onSubmit,
  onSkip,
  recording,
  onToggleRecord,
}: AnswerAreaProps) {
  return (
    <Card className="w-full bg-transparent border-none p-0 backdrop-blur-xl shadow-none">
      <div className="flex flex-col gap-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-32"
          placeholder="Or type your answer here..."
        />
        <div className="w-full flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            className="gap-0 cursor-pointer"
            onClick={onSkip}
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip
          </Button>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground">
                (Primary: Voice input. We&apos;ll auto-fill the text above after
                recording.)
              </div>
              <Button
                variant={recording ? "destructive" : "default"}
                onClick={onToggleRecord}
                aria-label={recording ? "Stop recording" : "Start recording"}
                className="gap-0 cursor-pointer"
              >
                <Mic className="mr-2 h-4 w-4" />
                {recording ? "Stop" : "Record"}
              </Button>
            </div>

            <Magnetic>
              <Button
                variant={"outline"}
                onClick={onSubmit}
                className="cursor-pointer"
              >
                <Send className="mr-2 h-4 w-4" />
                Submit
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>
    </Card>
  );
}
