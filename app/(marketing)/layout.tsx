import type React from "react"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen max-h-screen overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto">{children}</main>
      <Footer className="shrink-0" />
    </div>
  )
}
