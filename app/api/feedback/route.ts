import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { question, answer } = await req.json()

  const strengths: string[] = []
  const improvements: string[] = []

  if (!answer || String(answer).trim().length < 20) {
    improvements.push("Provide more detail and concrete examples.")
  } else {
    strengths.push("Sufficient depth and clarity.")
  }

  if (/\d+%|\b(ms|seconds|minutes)\b/i.test(answer)) {
    strengths.push("Quantifies impact with metrics.")
  } else {
    improvements.push("Quantify outcomes with metrics or timelines.")
  }

  if (/stakeholder|collaborat|team|mentor/i.test(answer)) {
    strengths.push("Demonstrates collaboration and communication.")
  } else {
    improvements.push("Highlight collaboration with stakeholders or teammates.")
  }

  if (/design|architecture|trade-?off|scal/i.test(answer)) {
    strengths.push("Considers design and trade-offs.")
  } else {
    improvements.push("Discuss design choices and trade-offs.")
  }

  const improvedAnswer =
    answer && answer.trim().length > 0
      ? `Here’s a refined version: ${answer.trim()} In this effort, I quantified results (e.g., 35% latency reduction), discussed key trade-offs, and aligned with stakeholders to ensure impact.`
      : `A strong answer would start with a concise summary, outline the situation, your actions, and measurable results. Mention trade-offs and stakeholder alignment.`

  return NextResponse.json({
    strengths: Array.from(new Set(strengths)),
    improvements: Array.from(new Set(improvements)),
    improvedAnswer,
  })
}
