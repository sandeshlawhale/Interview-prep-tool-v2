"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function TopBar() {
  const router = useRouter();

  function handleEndInterview() {
    // sessionStorage.setItem("interviewAnswers", JSON.stringify(answers));
    router.push("/");
  }

  return (
    <header className="z-20 border-b border-border/50 bg-card/60">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between">
        <div className="flex items-center justify-between py-3 backdrop-blur-xl">
          <div className="min-w-0">
            <div className="text-lg text-muted-foreground">
              AI Interviewer Coach
            </div>
            <div className="text-xl truncate text-pretty font-medium">
              Mock Interview - Software Engineer
            </div>
          </div>
        </div>
        {false && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEndInterview}
            className="cursor-pointer text-base text-foreground/80 hover:text-foreground"
          >
            End Interview
          </Button>
        )}
      </div>
    </header>
  );
}
