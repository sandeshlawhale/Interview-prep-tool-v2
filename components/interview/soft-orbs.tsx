"use client"

export default function SoftOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle at 30% 30%, var(--color-primary), transparent 60%)",
        }}
      />
      <div
        className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle at 70% 70%, var(--color-accent), transparent 60%)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full blur-3xl opacity-15"
        style={{
          background: "radial-gradient(circle at 50% 50%, var(--color-success), transparent 60%)",
        }}
      />
    </div>
  )
}
