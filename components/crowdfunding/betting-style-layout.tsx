"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sparkles, TrendingUp, Clock, Award } from "lucide-react"

export function BettingStyleLayout({ children }: { children: React.ReactNode }) {
  const [isBettingMode, setIsBettingMode] = useState(false)

  // Check if betting dark mode is enabled
  useEffect(() => {
    const checkBettingMode = () => {
      const isBettingDarkMode = document.body.classList.contains("betting-dark-mode")
      setIsBettingMode(isBettingDarkMode)
    }

    // Check initially
    checkBettingMode()

    // Set up a mutation observer to detect class changes on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkBettingMode()
        }
      })
    })

    observer.observe(document.body, { attributes: true })

    return () => observer.disconnect()
  }, [])

  // If not in betting mode, just render children
  if (!isBettingMode) {
    return <>{children}</>
  }

  // Mock data for the betting UI
  const featuredProjects = [
    { id: 1, name: "DeFi Protocol", funded: 78, target: 100, odds: "+215%", trending: true },
    { id: 2, name: "NFT Marketplace", funded: 45, target: 80, odds: "+180%", trending: false },
    { id: 3, name: "Zero-Knowledge Proofs", funded: 92, target: 120, odds: "+145%", trending: true },
  ]

  const portfolioSummary = {
    invested: "$2,450",
    projects: 7,
    returns: "+18.5%",
    trending: "+2.3%",
  }

  const hotProjects = ["Blockchain Bridge (+310%)", "Gaming Platform (+215%)", "Identity Solution (+180%)"]

  return (
    <div className="betting-layout">
      {/* Ticker tape for live updates */}
      <div className="ticker-tape mb-4">
        <div className="ticker-content">
          {hotProjects.map((project, index) => (
            <span key={index} className="mx-4">
              <span className="live-indicator">{project}</span>
            </span>
          ))}
          <span className="mx-4">New project: Decentralized Storage launched with 25% early backer bonus!</span>
          <span className="mx-4">Zero-Knowledge Proofs project reached 92% of funding goal!</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Main content area */}
        <div className="md:w-3/4">{children}</div>

        {/* Sidebar */}
        <div className="md:w-1/4">
          {/* Portfolio summary */}
          <div className="portfolio-summary mb-6">
            <h3 className="text-lg font-bold mb-2">Your Portfolio</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted">Total Invested</p>
                <p className="text-lg font-bold">{portfolioSummary.invested}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Projects</p>
                <p className="text-lg font-bold">{portfolioSummary.projects}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Returns</p>
                <p className="text-lg font-bold profit">{portfolioSummary.returns}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Today</p>
                <p className="text-lg font-bold profit">{portfolioSummary.trending}</p>
              </div>
            </div>
          </div>

          {/* Featured projects */}
          <div className="featured-projects">
            <h3 className="text-lg font-bold mb-2">Hot Opportunities</h3>

            {featuredProjects.map((project) => (
              <div key={project.id} className="featured-project-card">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold">{project.name}</h4>
                  <span className="odds-display odds-positive">{project.odds}</span>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>
                      {project.funded}K / {project.target}K
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(project.funded / project.target) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  {project.trending && (
                    <span className="text-xs flex items-center text-[var(--betting-accent-profit)]">
                      <TrendingUp size={12} className="mr-1" /> Trending
                    </span>
                  )}
                  <button className="quick-bet-btn text-xs ml-auto">Back Now</button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            <button className="betting-btn-secondary flex items-center justify-center text-sm">
              <Sparkles size={14} className="mr-1" /> Discover
            </button>
            <button className="betting-btn-secondary flex items-center justify-center text-sm">
              <Clock size={14} className="mr-1" /> Ending Soon
            </button>
            <button className="betting-btn-secondary flex items-center justify-center text-sm">
              <TrendingUp size={14} className="mr-1" /> Trending
            </button>
            <button className="betting-btn-secondary flex items-center justify-center text-sm">
              <Award size={14} className="mr-1" /> Rewards
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
