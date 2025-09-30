import type React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { TopBar } from "@/components/TopBar";

export const metadata = {
  title: "AI Interviewer Prep",
  description: "Prepare for interviews with AI-powered mock sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark antialiased">
      <body
        className={`font-sans ${GeistSans.className} ${GeistMono.className} h-screen`}
        style={{ fontFamily: "'Source Serif 4', serif" }}
      >
        <TopBar />
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
