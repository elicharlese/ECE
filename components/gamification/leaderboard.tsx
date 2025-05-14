"use client"

import { useGamification } from "@/context/gamification-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export function Leaderboard() {
  const { leaderboard, isLoading, profile } = useGamification()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-6 w-3/4 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-muted h-4 w-1/2 rounded"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-muted h-64 rounded"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>Top contributors in the crowdfunding ecosystem</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {/* 2nd place */}
            {leaderboard.length > 1 && (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-400 mb-2">
                  <img
                    src={leaderboard[1].avatar || "/placeholder.svg"}
                    alt={leaderboard[1].username}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-full h-20 bg-slate-400/20 rounded-t-lg flex flex-col items-center justify-end pb-2">
                  <Badge className="bg-slate-400 mb-1">2nd</Badge>
                  <p className="text-sm font-medium truncate max-w-full px-1">{leaderboard[1].username}</p>
                  <p className="text-xs text-muted-foreground">{leaderboard[1].points} XP</p>
                </div>
              </div>
            )}

            {/* 1st place */}
            {leaderboard.length > 0 && (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-yellow-500 mb-2">
                  <img
                    src={leaderboard[0].avatar || "/placeholder.svg"}
                    alt={leaderboard[0].username}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-full h-24 bg-yellow-500/20 rounded-t-lg flex flex-col items-center justify-end pb-2">
                  <Badge className="bg-yellow-500 mb-1">1st</Badge>
                  <p className="text-sm font-medium truncate max-w-full px-1">{leaderboard[0].username}</p>
                  <p className="text-xs text-muted-foreground">{leaderboard[0].points} XP</p>
                </div>
              </div>
            )}

            {/* 3rd place */}
            {leaderboard.length > 2 && (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-700 mb-2">
                  <img
                    src={leaderboard[2].avatar || "/placeholder.svg"}
                    alt={leaderboard[2].username}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-full h-16 bg-amber-700/20 rounded-t-lg flex flex-col items-center justify-end pb-2">
                  <Badge className="bg-amber-700 mb-1">3rd</Badge>
                  <p className="text-sm font-medium truncate max-w-full px-1">{leaderboard[2].username}</p>
                  <p className="text-xs text-muted-foreground">{leaderboard[2].points} XP</p>
                </div>
              </div>
            )}
          </div>

          {/* Rest of the leaderboard */}
          <div className="space-y-2">
            {leaderboard.slice(3).map((entry, index) => {
              const isCurrentUser = profile && entry.userId === profile.userId

              return (
                <div
                  key={entry.userId}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md border",
                    isCurrentUser ? "bg-primary/5 border-primary/20" : "bg-muted/10 border-muted/20",
                  )}
                >
                  <div className="w-6 text-center font-medium text-muted-foreground">{index + 4}</div>
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={entry.avatar || "/placeholder.svg"}
                      alt={entry.username}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className={cn("font-medium", isCurrentUser && "text-primary")}>{entry.username}</p>
                      {isCurrentUser && (
                        <Badge variant="outline" className="ml-2 text-xs bg-primary/10 text-primary">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>Level {entry.level}</span>
                      <span className="mx-1">•</span>
                      <span>{entry.achievements} achievements</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{entry.points} XP</p>
                    <div className="flex items-center justify-end text-xs">
                      {entry.change > 0 ? (
                        <div className="flex items-center text-green-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span>+{entry.change}</span>
                        </div>
                      ) : entry.change < 0 ? (
                        <div className="flex items-center text-red-500">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          <span>{entry.change}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-muted-foreground">
                          <Minus className="h-3 w-3 mr-1" />
                          <span>0</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
