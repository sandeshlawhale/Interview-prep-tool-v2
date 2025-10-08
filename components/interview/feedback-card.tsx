"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { useInterviewStore } from "@/lib/store/interviewStore";
import { LoaderCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useWordAnimation } from "@/lib/useWordAnimation";
import AnimatedParagraph from "../animate-word";

type Feedback = {
  strengths: string[];
  improvements: string[];
  improvedAnswer: string;
};

export default function FeedbackCardComponent({
  feedback,
  onRevise,
  onNext,
  nextQuestionLoading,
}: {
  feedback: string | undefined;
  onRevise?: () => void;
  onNext?: () => void;
  nextQuestionLoading: boolean;
}) {
  const questionCount = useInterviewStore((state) => state.questionCount);
  const { maxQuestions, audioInstance, stopSpeaking } = useInterviewStore();
  const animatedText = useWordAnimation(feedback ? feedback : "", 100);

  return (
    <>
      <Card className="w-full border border-border/50 bg-card/60 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 tracking-wide">
          <ReactMarkdown>{feedback}</ReactMarkdown>
        </div>

        {(onRevise || onNext) && (
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
            {onRevise && (
              <Button
                variant="secondary"
                onClick={() => {
                  stopSpeaking();
                  onRevise();
                }}
                className="cursor-pointer"
              >
                Revise Answer
              </Button>
            )}
            {onNext && (
              <Button
                onClick={() => {
                  stopSpeaking();
                  onNext();
                }}
                className="cursor-pointer gap-0"
              >
                {nextQuestionLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Generating
                  </>
                ) : questionCount >= maxQuestions ? (
                  "Get Assessment"
                ) : (
                  "Next Question"
                )}
              </Button>
            )}
          </div>
        )}
      </Card>
    </>
  );
}

const SkeletonLoading = () => {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-6 w-1/2 rounded-md" />

      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-1/3 rounded-md" />
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="h-6 w-1/2 rounded-md" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-1/4 rounded-md" />
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="h-6 w-1/3 rounded-md" />
      </div>
    </div>
  );
};

// export function FeedbackCard({
//   strengths,
//   improvements,
//   improvedAnswer,
//   onRevise,
//   onNext,
// }: {
//   strengths: string[];
//   improvements: string[];
//   improvedAnswer: string;
//   onRevise?: () => void;
//   onNext?: () => void;
// }) {
//   return (
//     <Card className="w-full border border-border/50 bg-card/60 p-6 backdrop-blur-xl">
//       <div className="grid gap-6 md:grid-cols-3">
//         <div>
//           <h2 className="mb-2 text-sm font-semibold">Strengths</h2>
//           <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
//             {strengths.map((s, i) => (
//               <li key={i}>{s}</li>
//             ))}
//           </ul>
//         </div>
//         <div>
//           <h2 className="mb-2 text-sm font-semibold">Areas of Improvement</h2>
//           <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
//             {improvements.map((s, i) => (
//               <li key={i}>{s}</li>
//             ))}
//           </ul>
//         </div>
//         <div>
//           <h2 className="mb-2 text-sm font-semibold">Improved Answer</h2>
//           <div className="rounded-md border border-border/50 bg-card/60 p-3 text-sm text-foreground">
//             {improvedAnswer}
//           </div>
//         </div>
//       </div>

//       {(onRevise || onNext) && (
//         <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
//           {onRevise && (
//             <Button variant="secondary" onClick={onRevise}>
//               Revise Answer
//             </Button>
//           )}
//           {onNext && <Button onClick={onNext}>Next Question</Button>}
//         </div>
//       )}
//     </Card>
//   );
// }
