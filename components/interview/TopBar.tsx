"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useFormStore } from "@/lib/store/formStore";
import { useInterviewStore } from "@/lib/store/interviewStore";

export function TopBar() {
  const router = useRouter();
  const { formData, interviewStarted, resetForm, endInterview } =
    useFormStore();
  const { stopSpeaking } = useInterviewStore();

  function handleEndInterview() {
    // sessionStorage.setItem("interviewAnswers", JSON.stringify(answers));
    endInterview();
    resetForm();
    router.push("/");
    localStorage.removeItem("sessionId");
  }

  return (
    <header className="z-20 border-b border-border/50 bg-card/60">
      <div className="mx-auto max-w-5xl px-4 flex items-center justify-between">
        <div className="flex items-center justify-between py-3 backdrop-blur-xl">
          <div className="min-w-0">
            <div className="text-lg text-muted-foreground">
              AI Interviewer Coach
            </div>
            {interviewStarted && formData && (
              <div className="text-xl truncate text-pretty font-medium">
                {formData.jobRole} - {formData.domain}
              </div>
            )}
          </div>
        </div>
        {interviewStarted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              stopSpeaking();
              handleEndInterview();
            }}
            className="cursor-pointer text-base text-foreground/80 hover:text-foreground"
          >
            End Interview
          </Button>
        )}
      </div>
    </header>
  );
}
