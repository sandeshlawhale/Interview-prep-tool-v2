"use client";

import { Card } from "@/components/ui/card";

type Question = { id: string; text: string };
type Feedback = {
  strengths: string[];
  improvements: string[];
  improvedAnswer: string;
};
type QA = {
  question: Question;
  answer: string;
  feedback?: Feedback;
};

export default function FinalSummary({ qas }: { qas: QA[] }) {
  const answeredCount = qas.filter((q) => q.answer).length;
  const strengths = qas.flatMap((q) => q.feedback?.strengths ?? []);
  const improvements = qas.flatMap((q) => q.feedback?.improvements ?? []);

  return (
    <div className="w-full flex flex-col gap-6">
      <Card className="border border-border/50 bg-card/60 p-6 backdrop-blur-xl">
        <h2 className="text-lg font-semibold">Final Summary</h2>
        <div className="mt-2 text-sm text-muted-foreground">
          You answered {answeredCount} out of {qas.length} questions.
        </div>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Overall Strengths</h3>
            {strengths.length ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">
                No strengths detected.
              </div>
            )}
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">
              Overall Areas to Improve
            </h3>
            {improvements.length ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">
                No improvements detected.
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="border border-border/50 bg-card/60 p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-sm font-semibold">All Questions & Answers</h3>
        <div className="space-y-5">
          {qas.map((qa, i) => (
            <div
              key={qa.question.id}
              className="rounded-lg border border-border/50 bg-card/60 p-4"
            >
              <div className="text-xs text-muted-foreground">Q{i + 1}</div>
              <div className="text-pretty font-medium">{qa.question.text}</div>
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">Your answer: </span>
                <span className="text-foreground">
                  {qa.answer || "(skipped)"}
                </span>
              </div>
              {qa.feedback && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Feedback: </span>
                  <span className="text-foreground">
                    {qa.feedback.strengths.slice(0, 1).join(", ") || "—"};
                    Improve:{" "}
                    {qa.feedback.improvements.slice(0, 1).join(", ") || "—"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
