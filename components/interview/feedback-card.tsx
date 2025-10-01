"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { useInterviewStore } from "@/lib/store/interviewStore";

type Feedback = {
  strengths: string[];
  improvements: string[];
  improvedAnswer: string;
};

export default function FeedbackCardComponent({
  feedback,
  onRevise,
  onNext,
}: {
  feedback: string | undefined;
  onRevise?: () => void;
  onNext?: () => void;
}) {
  const questionCount = useInterviewStore((state) => state.questionCount);
  const { maxQuestions } = useInterviewStore();
  return (
    <>
      <Card className="w-full border border-border/50 bg-card/60 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 tracking-wide">
          <ReactMarkdown>{feedback}</ReactMarkdown>
          {/* <div>
            <h2 className="mb-2 text-sm font-semibold">Strengths</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-sm font-semibold">Areas of Improvement</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {improvements.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-sm font-semibold">Improved Answer</h2>
            <div className="rounded-md border border-border/50 bg-card/60 p-3 text-sm text-foreground">
              {improvedAnswer}
            </div>
          </div> */}
        </div>

        {(onRevise || onNext) && (
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
            {onRevise && (
              <Button
                variant="secondary"
                onClick={onRevise}
                className="cursor-pointer"
              >
                Revise Answer
              </Button>
            )}
            {onNext && (
              <Button onClick={onNext} className="cursor-pointer">
                {questionCount >= maxQuestions
                  ? "Get Assessment"
                  : "Next Question"}
              </Button>
            )}
          </div>
        )}
      </Card>
    </>
  );
}

export function FeedbackCard({
  strengths,
  improvements,
  improvedAnswer,
  onRevise,
  onNext,
}: {
  strengths: string[];
  improvements: string[];
  improvedAnswer: string;
  onRevise?: () => void;
  onNext?: () => void;
}) {
  return (
    <Card className="w-full border border-border/50 bg-card/60 p-6 backdrop-blur-xl">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <h2 className="mb-2 text-sm font-semibold">Strengths</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold">Areas of Improvement</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {improvements.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold">Improved Answer</h2>
          <div className="rounded-md border border-border/50 bg-card/60 p-3 text-sm text-foreground">
            {improvedAnswer}
          </div>
        </div>
      </div>

      {(onRevise || onNext) && (
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {onRevise && (
            <Button variant="secondary" onClick={onRevise}>
              Revise Answer
            </Button>
          )}
          {onNext && <Button onClick={onNext}>Next Question</Button>}
        </div>
      )}
    </Card>
  );
}
