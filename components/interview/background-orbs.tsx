"use client"

export default function BackgroundOrbs() {
  // Soft, subtle radial gradient orbs using theme tokens
  return (
    <div aria-hidden className="h-full w-full overflow-hidden">
      <div
        className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--color-primary) 70%, transparent), transparent 60%)",
        }}
      />
      <div
        className="absolute right-[-10%] top-[20%] h-80 w-80 rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(circle at 70% 40%, color-mix(in oklab, var(--color-accent) 70%, transparent), transparent 65%)",
        }}
      />
      <div
        className="absolute left-[20%] bottom-[-15%] h-96 w-96 rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 60%, color-mix(in oklab, var(--color-secondary) 70%, transparent), transparent 60%)",
        }}
      />
    </div>
  )
}

export { BackgroundOrbs }
