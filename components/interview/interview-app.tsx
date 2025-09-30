"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { BackgroundOrbs } from "./background-orbs"
import { FeedbackCard } from "./feedback-card"
import { Volume2, VolumeX, Mic, Square, ChevronRight } from "lucide-react"

type Question = { id: string; text: string }

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((d) => d.questions as Question[])

export function InterviewApp() {
  const { data: questions = [], isLoading } = useSWR<Question[]>("/api/questions", fetcher)

  const [current, setCurrent] = useState(0)
  const [speakerOn, setSpeakerOn] = useState(true)
  const [mode, setMode] = useState<"audio" | "text">("audio")
  const [textAnswer, setTextAnswer] = useState("")
  const [recording, setRecording] = useState(false)
  const [mediaSupported, setMediaSupported] = useState(false)
  const [timer, setTimer] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [lastAudioBlob, setLastAudioBlob] = useState<Blob | null>(null)

  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<{
    strengths: string[]
    improvements: string[]
    improvedAnswer: string
  } | null>(null)

  const currentQuestion = questions[current]

  // speech synthesis for question reading
  useEffect(() => {
    if (!currentQuestion) return
    if (!speakerOn) return
    // Stop any active speech first
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(currentQuestion.text)
      u.rate = 1.0
      u.pitch = 1.0
      window.speechSynthesis.speak(u)
    }
  }, [currentQuestion, speakerOn])

  // Media support
  useEffect(() => {
    setMediaSupported(!!navigator.mediaDevices?.getUserMedia)
  }, [])

  // Timer for recording
  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [recording])

  const startRecording = async () => {
    if (!mediaSupported || recording) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      audioChunksRef.current = []
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setLastAudioBlob(blob)
      }
      mr.start()
      mediaRecorderRef.current = mr
      setTimer(0)
      setRecording(true)
    } catch {
      // fallback to text mode if blocked
      setMode("text")
    }
  }

  const stopRecording = () => {
    if (!recording) return
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  const statusFor = (idx: number): "current" | "done" | "upcoming" => {
    if (idx === current && !submitted) return "current"
    if (idx < current || (idx === current && submitted)) return "done"
    return "upcoming"
  }

  const onSkip = () => {
    setSubmitted(false)
    setFeedback(null)
    setTextAnswer("")
    setLastAudioBlob(null)
    setMode("audio")
    setCurrent((c) => Math.min(c + 1, Math.max(0, questions.length - 1)))
  }

  const onSubmit = async () => {
    if (!currentQuestion) return
    // Use typed answer or dummy transcript
    const finalAnswer =
      mode === "text"
        ? textAnswer.trim()
        : lastAudioBlob
          ? "[Audio Response] I discussed my experience and approach."
          : "[No Audio Captured]"

    setSubmitted(true)
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: currentQuestion.text,
        answer: finalAnswer,
      }),
    })
    const data = await res.json()
    setFeedback(data)
  }

  const goNext = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1)
      setSubmitted(false)
      setFeedback(null)
      setTextAnswer("")
      setLastAudioBlob(null)
      setMode("audio")
    }
  }

  const isLast = useMemo(() => current >= Math.max(0, questions.length - 1), [current, questions.length])

  return (
    <div className="relative">
      <BackgroundOrbs />
      <div className="relative z-10">
        {/* Header */}
        <header className="w-full border-b border-border/50 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/40">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold text-balance">AI Interview Coach</h1>
                <p className="text-sm text-muted-foreground">Mock Interview — Software Engineer</p>
              </div>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setSpeakerOn((s) => !s)}
                aria-pressed={speakerOn}
                aria-label={speakerOn ? "Mute interviewer" : "Unmute interviewer"}
              >
                {speakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
            </div>

            {/* Breadcrumbs */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {isLoading && <div className="text-sm text-muted-foreground">Loading questions…</div>}
              {!isLoading &&
                questions.map((q, i) => {
                  const st = statusFor(i)
                  return (
                    <div key={q.id} className="flex items-center gap-2">
                      <Badge
                        variant={st === "current" ? "default" : st === "done" ? "secondary" : "outline"}
                        className={cn(
                          "px-3 py-1",
                          st === "current" && "ring-2 ring-primary/60",
                          st === "upcoming" && "opacity-60",
                        )}
                      >
                        Q{i + 1}
                      </Badge>
                      {i < questions.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground/70" aria-hidden />
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        </header>

        {/* Main */}
        <section className="mx-auto grid min-h-[calc(100dvh-200px)] max-w-3xl place-items-center px-4 py-10">
          <Card className="w-full bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 border border-border/50">
            <CardHeader className="text-center">
              <CardTitle>
                {currentQuestion ? (
                  <span className="text-pretty text-lg md:text-2xl">{currentQuestion.text}</span>
                ) : (
                  <span className="text-muted-foreground">Preparing question…</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode toggle hint */}
              <div className="flex items-center justify-center">
                <div className="rounded-full bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                  Default mode is audio.{" "}
                  <button
                    onClick={() => setMode((m) => (m === "audio" ? "text" : "audio"))}
                    className="underline underline-offset-2"
                  >
                    Switch to {mode === "audio" ? "Text" : "Audio"} Mode
                  </button>
                </div>
              </div>

              {/* Answer Input */}
              {mode === "audio" ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {recording
                      ? `Recording… ${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`
                      : lastAudioBlob
                        ? "Recorded response ready."
                        : "Press record to start answering."}
                  </div>
                  <div className="flex items-center gap-3">
                    {!recording ? (
                      <Button size="lg" onClick={startRecording} disabled={!mediaSupported} className="h-12 px-6">
                        <Mic className="mr-2 h-5 w-5" />
                        Record
                      </Button>
                    ) : (
                      <Button variant="destructive" size="lg" onClick={stopRecording} className="h-12 px-6">
                        <Square className="mr-2 h-5 w-5" />
                        Stop
                      </Button>
                    )}
                  </div>
                  {!mediaSupported && (
                    <div className="text-xs text-amber-500">Microphone access not available. Switch to Text Mode.</div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="sr-only" htmlFor="text-answer">
                    Text Answer
                  </label>
                  <Textarea
                    id="text-answer"
                    placeholder="Type your answer here…"
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    className="min-h-32"
                  />
                </div>
              )}

              {/* Footer actions */}
              {!submitted ? (
                <div className="flex items-center justify-center gap-3">
                  <Button variant="outline" onClick={onSkip}>
                    Skip
                  </Button>
                  <Button onClick={onSubmit} disabled={!currentQuestion}>
                    Submit
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Separator />
                  {feedback ? (
                    <FeedbackCard
                      strengths={feedback.strengths}
                      improvements={feedback.improvements}
                      improvedAnswer={feedback.improvedAnswer}
                    />
                  ) : (
                    <div className="text-center text-sm text-muted-foreground">Generating feedback…</div>
                  )}

                  <div className="flex items-center justify-center">
                    <Button onClick={goNext} disabled={isLast}>
                      {isLast ? "All Done" : "Next Question"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
