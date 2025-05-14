import type React from "react"
import "../(auth)/auth.css"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="auth-layout bg-background">{children}</div>
}
