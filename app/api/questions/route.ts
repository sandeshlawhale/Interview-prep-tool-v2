import { NextResponse } from "next/server"

const ALL_QUESTIONS = [
  "Tell me about yourself.",
  "Describe a challenging bug you fixed recently.",
  "How do you design scalable APIs?",
  "Explain a time you improved performance significantly.",
  "How do you handle disagreements in a team?",
  "What is your approach to testing and quality?",
  "Describe an architecture you’re proud of.",
  "How do you prioritize tasks under tight deadlines?",
  "Tell me about a failure and what you learned.",
  "How do you keep up with new technologies?",
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const round = Number(searchParams.get("round") || "1")
  const start = (round - 1) * 5
  const slice = ALL_QUESTIONS.slice(start, start + 5).map((text, i) => ({
    id: `q-${start + i + 1}`,
    text,
  }))
  return NextResponse.json({ questions: slice, total: slice.length })
}
