"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import useSWR from "swr";
import { TopBar } from "./TopBar";
import { ClientBreadcrumb } from "./ClientBreadcrumb";
import { QuestionPanel } from "./QuestionPanel";
import { AnswerArea } from "./AnswerArea";
import { VoiceProvider, useVoice } from "@/components/interview/voice-provider";
import FeedbackCard from "@/components/interview/feedback-card";
import FinalSummary from "@/components/interview/final-summary";
import { Card } from "@/components/ui/card";
import { useInterviewStore } from "@/lib/store/interviewStore";
import { getNextQuestionAPI, submitAnswerAPI } from "@/lib/api";
import { set } from "date-fns";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { ChevronRight } from "lucide-react";
import { speakTextWithTTS } from "@/lib/audioApi";

type Question = { id: string; text: string };
type Feedback = {
  strengths: string[];
  improvements: string[];
  improvedAnswer: string;
};
type QA = { question: Question; answer: string; feedback?: Feedback };

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function InterviewClient() {
  const router = useRouter();

  const conversation = useInterviewStore((state) => state.conversation);
  const questionCount = useInterviewStore((state) => state.questionCount);
  const {
    incrementQuestionCount,
    addAnswer,
    maxQuestions,
    addFeedback,
    addQuestion,
  } = useInterviewStore();

  const [answerDraft, setAnswerDraft] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [nextQuestionLoading, setNextQuestionLoading] = useState(false);

  // const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);

  const current = conversation[questionCount - 1];

  // useEffect(() => {
  //   if (!enabled || !current) return;
  //   speak(current.question.text);
  //   return () => stop();
  // }, [index, enabled, current, speak, stop]);

  // Load answer draft
  // useEffect(() => {
  //   setAnswerDraft(current?.answer ?? "");
  // }, [index, current]);

  const answered = useMemo(
    () => conversation.map((qa) => Boolean(qa.answer || qa.feedback)),
    [conversation]
  );

  const submitAnswer = async () => {
    if (answerDraft.trim() === "") return;
    setSubmitLoading(true);
    try {
      addAnswer(questionCount - 1, answerDraft);
      const sId = localStorage.getItem("sessionId") || "";
      if (!sId) {
        throw new Error("No session ID found");
      }
      const res = await submitAnswerAPI(sId, answerDraft);
      //@ts-ignore
      if (!res?.success) {
        return;
      }
      addFeedback(questionCount - 1, res.feedback);
      speakTextWithTTS(res?.feedback);
      setShowFeedback(true);
      setAnswerDraft("");
      setSubmitLoading(false);
    } catch (error) {
      console.log("error in submitting answer: ", error);
      setSubmitLoading(false);
    }
  };

  const callNextQuestion = async () => {
    setNextQuestionLoading(true);
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
      setShowFeedback(false);
      setAnswerDraft("");
      setNextQuestionLoading(false);
    } catch (error) {
      console.log("error in fetching next question: ", error);
      setNextQuestionLoading(false);
    }
  };

  const reviseQuestion = () => {
    setAnswerDraft("");
    setShowFeedback(false);
  };

  if (!conversation?.length)
    return (
      <>
        <main className="h-[90vh] flex flex-col ">
          <div className="w-5xl mx-auto flex gap-2 mt-2 px-4">
            {[1, 2, 3, 4, 5].map((i) => {
              return (
                <li key={i} className="flex items-center gap-2 z-10">
                  <Skeleton className="h-8 w-10 rounded-md" />
                  {i < [1, 2, 3, 4, 5].length && (
                    <ChevronRight
                      className="size-4 text-muted-foreground/70"
                      aria-hidden
                    />
                  )}
                </li>
              );
            })}
          </div>

          <main className="relative mx-auto max-w-5xl px-4 pb-16 pt-6 gap-4 flex-1 flex items-center justify-center flex-col w-full">
            <div className="w-full flex flex-col gap-4">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-1/3 rounded-md" />
            </div>
            <div className="w-full">
              <Skeleton className="h-40 w-full rounded-md" />
            </div>
            <div className="w-full flex items-center justify-between">
              <Skeleton className="h-8 w-20 rounded-md" />
              <div className="flex gap-4">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          </main>
        </main>
      </>
    );

  return (
    <main className="h-[90vh] flex flex-col">
      <div className="w-5xl mx-auto">
        <ClientBreadcrumb
          currentIndex={questionCount - 1}
          total={maxQuestions}
          answered={answered}
        />
      </div>

      <main className="relative mx-auto max-w-5xl px-4 pb-16 pt-6 gap-4 flex-1 flex items-center justify-center flex-col w-full">
        <>
          {current ? (
            <QuestionPanel
              question={
                conversation[questionCount - 1]?.question[0]?.content || ""
              }
              speakerOn={false}
              onToggleSpeaker={() => {}}
            />
          ) : (
            <div className="w-full flex flex-col gap-4">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-1/3 rounded-md" />
            </div>
          )}
          {showFeedback ? (
            <FeedbackCard
              feedback={current?.feedback?.at(-1)?.content}
              onRevise={reviseQuestion}
              onNext={callNextQuestion}
              nextQuestionLoading={nextQuestionLoading}
            />
          ) : (
            <AnswerArea
              value={answerDraft}
              onChange={setAnswerDraft}
              onSubmit={submitAnswer}
              submitLoading={submitLoading}
              recording={recording}
              onToggleRecord={() => setRecording((prev) => !prev)}
            />
          )}
        </>
      </main>
    </main>
  );
}
