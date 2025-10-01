import {
  InterviewSetupData,
  InterviewStartResponse,
  OverallFeedback,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5051";

export async function startInterviewAPI(
  setupData: InterviewSetupData
): Promise<InterviewStartResponse> {
  const { jobRole, domain, skills } = setupData;

  const body = {
    jobRole,
    domain,
    skills,
  };

  const response = await fetch(`${BASE_URL}/v2/api/interviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to start interview. Please try again.");
  }

  const data = await response.json();
  return data;
}

export async function submitAnswerAPI(
  sessionId: string,
  answer: string
): Promise<{
  feedback: string;
  nextQuestion?: string;
}> {
  console.log("sessionId===>>", sessionId);

  const response = await fetch(
    `${BASE_URL}/v2/api/interviews/${sessionId}/answers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer }),
    }
  );

  if (!response.ok) throw new Error("Failed to submit answer");

  return response.json();
}

export async function getNextQuestionAPI(
  sessionId: string
): Promise<{ question: string }> {
  const response = await fetch(
    `${BASE_URL}/v2/api/interviews/${sessionId}/questions`
  );

  if (!response.ok) throw new Error("Failed to get next answer");
  console.log("response in api===>>>", response);

  return response.json();
}

export async function reviseAnswerAPI(
  sessionId: string
): Promise<{ question: string }> {
  const response = await fetch(
    `${BASE_URL}/api/interviews/${sessionId}/revise`
  );

  if (!response.ok) throw new Error("Failed to revise answer");

  return response.json();
}

export async function submitFinalInterviewAPI(sessionId: string): Promise<{
  status: string;
  overallFeedback: OverallFeedback;
}> {
  const response = await fetch(
    `${BASE_URL}/v2/api/interviews/${sessionId}/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to submit final interview");

  return response.json();
}

export async function getSkills({
  domain,
  jobRole,
}: {
  domain: string;
  jobRole: string;
}): Promise<{
  skills: string[];
  success: boolean;
}> {
  const response = await fetch(`${BASE_URL}/api/skills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ domain, jobRole }),
  });

  if (!response.ok) throw new Error("Failed to fetch the skills");

  return response.json();
}
