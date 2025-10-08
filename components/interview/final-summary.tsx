"use client";

import { submitFinalInterviewAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionAnalysis {
  question: string;
  response: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
  score: number;
  response_depth: string;
}

interface CoachingScores {
  clarity_of_motivation: number;
  specificity_of_learning: number;
  career_goal_alignment: number;
}

interface OverallFeedbackType {
  summary: string;
  response_depth: string;
  questions_analysis: QuestionAnalysis[];
  coaching_scores: CoachingScores;
  recommendations: string[];
  closure_message: string;
  overall_score: number;
  level: string;
}

export default function FinalSummary() {
  const [overallFeedback, setOverallFeedback] =
    useState<OverallFeedbackType | null>({
      summary: "",
      response_depth: "",
      questions_analysis: [],
      coaching_scores: {
        clarity_of_motivation: 0,
        specificity_of_learning: 0,
        career_goal_alignment: 0,
      },
      recommendations: [],
      closure_message: "",
      overall_score: 0,
      level: "",
    });
  const [loading, setLoading] = useState(true);

  const getFinalFeedback = async () => {
    try {
      const sId = localStorage.getItem("sessionId");
      if (!sId) {
        throw new Error("No session ID found");
      }

      const res = await submitFinalInterviewAPI(sId);
      if (!res?.success) return;

      setOverallFeedback(res?.overallFeedback);
      setLoading(false);
    } catch (error) {
      console.log("error getting the final feedback: ", error);
    }
  };

  useEffect(() => {
    getFinalFeedback();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="space-y-4 border p-6 rounded-lg">
          <Skeleton className="h-8 w-1/3" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-1/5" />
            <Skeleton className="h-6 w-1/5" />
            <Skeleton className="h-6 w-1/5" />
          </div>
        </div>

        <div className="space-y-4 border p-6 rounded-lg">
          <Skeleton className="h-8 w-1/3" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/20" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/20" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/20" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <div className="space-y-4 border p-6 rounded-lg">
          <Skeleton className="h-6 w-1/3" />
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="space-y-1">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ))}
        </div>

        <div className="space-y-4 border p-6 rounded-lg">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-base tracking-wide">{overallFeedback?.summary}</p>
          <div className="flex flex-wrap gap-4 text-gray-500 text-base tracking-wide">
            <div>
              <strong>Overall Score:</strong> {overallFeedback?.overall_score}
            </div>
            <div>
              <strong>Level:</strong> {overallFeedback?.level}
            </div>
            <div>
              <strong>Response Depth:</strong> {overallFeedback?.response_depth}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coaching Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <p>Clarity of Motivation</p>
              <p className="text-base tracking-wide">
                {overallFeedback?.coaching_scores?.clarity_of_motivation} / 5
              </p>
            </div>
            <Progress
              value={
                overallFeedback?.coaching_scores?.clarity_of_motivation * 20
              }
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p>Specificity of Learning</p>
              <p className="text-base tracking-wide">
                {overallFeedback?.coaching_scores?.specificity_of_learning} / 5
              </p>
            </div>
            <Progress
              value={
                overallFeedback?.coaching_scores?.specificity_of_learning * 20
              }
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p>Career Goal Alignment</p>
              <p className="text-base tracking-wide">
                {overallFeedback?.coaching_scores?.career_goal_alignment} / 5
              </p>
            </div>
            <Progress
              value={
                overallFeedback?.coaching_scores?.career_goal_alignment * 20
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1">
            {overallFeedback?.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-2">
            {overallFeedback?.questions_analysis.map((q, idx) => (
              <AccordionItem value={`q-${idx}`} key={idx}>
                <AccordionTrigger className="cursor-pointer text-lg tracking-wide">
                  {q.question}
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-base tracking-wide">
                  <p>
                    <strong>Response:</strong> {q.response}
                  </p>
                  <p>
                    <strong>Feedback:</strong> {q.feedback}
                  </p>
                  <p>
                    <strong>Strengths:</strong> {q.strengths.join(", ")}
                  </p>
                  <p>
                    <strong>Improvements:</strong> {q.improvements.join(", ")}
                  </p>
                  <p>
                    <strong>Score:</strong> {q.score} ({q.response_depth})
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Closure Message</CardTitle>
        </CardHeader>
        <CardContent>
          <p text-base tracking-wide>
            {overallFeedback?.closure_message}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
