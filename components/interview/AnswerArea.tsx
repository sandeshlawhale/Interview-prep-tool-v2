"use client";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, SkipForward, Send, LoaderCircle } from "lucide-react";
import { Magnetic } from "../motion-primitives/magnetic";
import { useInterviewStore } from "@/lib/store/interviewStore";
import { InterviewClient } from "./InterviewClient";
import { useRouter } from "next/navigation";
import { getNextQuestionAPI } from "@/lib/api";
import { useState } from "react";
import { speakTextWithTTS } from "@/lib/audioApi";

interface AnswerAreaProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  submitLoading: boolean;
  recording: boolean;
  onToggleRecord: () => void;
}

export function AnswerArea({
  value,
  onChange,
  onSubmit,
  submitLoading,
  recording,
  onToggleRecord,
}: AnswerAreaProps) {
  const router = useRouter();

  const questionCount = useInterviewStore((state) => state.questionCount);
  const { incrementQuestionCount, maxQuestions, addQuestion, stopSpeaking } =
    useInterviewStore();

  const [skipLoading, setSkipLoading] = useState(false);

  const handleSkipQuestion = async () => {
    stopSpeaking();
    setSkipLoading(true);
    if (questionCount >= maxQuestions) {
      router.replace("/result");
      return;
    }

    try {
      const sId = localStorage.getItem("sessionId") || "";
      if (!sId) {
        throw new Error("No session ID found");
      }

      const res = await getNextQuestionAPI(sId);
      if (!res?.success) {
        return;
      }
      addQuestion(res?.question);
      speakTextWithTTS(res?.question);
      incrementQuestionCount();
      setSkipLoading(false);
    } catch (error) {
      console.log("error in fetching next question by skipping: ", error);
      setSkipLoading(false);
    }
  };

  return (
    <Card className="w-full bg-transparent border-none p-0 backdrop-blur-xl shadow-none">
      <div className="flex flex-col gap-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-32 disabled:cursor-not-allowed"
          placeholder="Or type your answer here..."
          disabled={submitLoading}
        />
        <div className="w-full flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            className="gap-0 cursor-pointer"
            onClick={handleSkipQuestion}
          >
            {skipLoading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin mr-2" /> Skipping
              </>
            ) : (
              <>
                <SkipForward className="mr-2 h-4 w-4" />
                Skip
              </>
            )}
          </Button>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground">
                {/* (Primary: Voice input. We&apos;ll auto-fill the text above after
                recording.) */}
                (There are some issues going with recording, we will fix this
                ASAP.)
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
                className="cursor-pointer gap-0"
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {submitLoading ? "Submitting" : "Submit"}
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>
    </Card>
  );
}
