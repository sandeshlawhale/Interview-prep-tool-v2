"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { TopBar } from "./TopBar";
import { ClientBreadcrumb } from "./ClientBreadcrumb";
import { QuestionPanel } from "./QuestionPanel";
import { AnswerArea } from "./AnswerArea";
import { VoiceProvider, useVoice } from "@/components/interview/voice-provider";
import FeedbackCard from "@/components/interview/feedback-card";
import FinalSummary from "@/components/interview/final-summary";
import { Card } from "@/components/ui/card";

type Question = { id: string; text: string };
type Feedback = {
  strengths: string[];
  improvements: string[];
  improvedAnswer: string;
};
type QA = { question: Question; answer: string; feedback?: Feedback };

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function InterviewClient() {
  const [round, setRound] = useState(1);
  const { data, isLoading } = useSWR<{ questions: Question[]; total: number }>(
    `/api/questions?round=${round}`,
    fetcher
  );

  const [index, setIndex] = useState(0);
  const [qas, setQAs] = useState<QA[]>([]);
  const [answerDraft, setAnswerDraft] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [recording, setRecording] = useState(false);
  const { enabled, speak, stop } = useVoice();

  const questions = data?.questions ?? [];
  const total = data?.total ?? 0;
  const current = qas[index];

  // Initialize QAs
  useEffect(() => {
    if (!questions.length) return;
    setQAs((prev) =>
      prev.length === 0
        ? questions.map((q) => ({ question: q, answer: "" }))
        : prev.length < questions.length
        ? [
            ...prev,
            ...questions
              .slice(prev.length)
              .map((q) => ({ question: q, answer: "" })),
          ]
        : prev
    );
  }, [questions]);

  // Speak question when index changes
  useEffect(() => {
    if (!enabled || !current) return;
    speak(current.question.text);
    return () => stop();
  }, [index, enabled, current, speak, stop]);

  // Load answer draft
  useEffect(() => {
    setAnswerDraft(current?.answer ?? "");
  }, [index, current]);

  const answered = useMemo(
    () => qas.map((qa) => Boolean(qa.answer || qa.feedback)),
    [qas]
  );

  const submitAnswer = async () => {
    if (!current) return;
    const answer = answerDraft.trim();
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: current.question.text, answer }),
    });
    const feedback: Feedback = await res.json();
    if (enabled)
      speak(
        `Feedback: ${feedback.strengths.join(
          ", "
        )}. Improvements: ${feedback.improvements.join(", ")}.`
      );

    setQAs((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], answer, feedback };
      return copy;
    });
  };

  const skipQuestion = () => setIndex((prev) => Math.min(prev + 1, total - 1));

  if (isLoading || !questions.length)
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <Card className="border border-border/50 bg-card/60 p-8 text-center backdrop-blur-xl">
          Loading interview…
        </Card>
      </main>
    );

  if (!current)
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <Card className="border border-border/50 bg-card/60 p-8 text-center backdrop-blur-xl">
          Preparing question…
        </Card>
      </main>
    );

  return (
    <main className="h-[90vh] flex flex-col">
      <div className="w-6xl mx-auto">
        <ClientBreadcrumb
          currentIndex={index}
          total={total}
          answered={answered}
        />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 pb-16 pt-6 gap-4 flex-1 flex items-center justify-center flex-col w-full">
        {!showSummary ? (
          <>
            <QuestionPanel
              question={current.question.text}
              speakerOn={false}
              onToggleSpeaker={() => {}}
            />
            {current.feedback ? (
              <FeedbackCard
                feedback={current.feedback}
                onRevise={() =>
                  setAnswerDraft(current.feedback?.improvedAnswer || "")
                }
                onNext={() => setIndex(index + 1)}
              />
            ) : (
              <AnswerArea
                value={answerDraft}
                onChange={setAnswerDraft}
                onSubmit={submitAnswer}
                onSkip={skipQuestion}
                recording={recording}
                onToggleRecord={() => setRecording((prev) => !prev)}
              />
            )}
          </>
        ) : (
          <FinalSummary qas={qas} />
        )}
      </main>
    </main>
  );
}
