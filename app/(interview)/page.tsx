import { Suspense } from "react"
import { InterviewApp } from "@/components/interview/interview-app"

export default function Page() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <Suspense fallback={<div className="p-6">Loading…</div>}>
        <InterviewApp />
      </Suspense>
    </main>
  )
}
