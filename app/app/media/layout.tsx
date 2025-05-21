"use client"

import type React from "react"

import { MediaProvider } from "@/context/media-context"

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return <MediaProvider>{children}</MediaProvider>
}
