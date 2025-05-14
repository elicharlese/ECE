"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Github, Linkedin } from "lucide-react"

interface FooterProps {
  className?: string
}

export function Footer({ className = "" }: FooterProps) {
  const [year, setYear] = useState("2025")

  useEffect(() => {
    setYear(new Date().getFullYear().toString())
  }, [])

  return (
    <footer className={`border-t py-4 ${className}`}>
      <div className="container flex flex-col items-center justify-between gap-2 md:h-12 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {year} ECE Platform. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Terms
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="https://github.com/eceplatform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Follow us on GitHub"
            >
              <Github className="h-4 w-4" />
            </Link>
            <Link
              href="https://linkedin.com/company/eceplatform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
