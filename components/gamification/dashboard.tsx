"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GamificationProfileCard } from "./profile-card"
import { AchievementsGallery } from "./achievements-gallery"
import { Leaderboard } from "./leaderboard"
import { DailyQuests } from "./daily-quests"

export function GamificationDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Gamification Dashboard</h2>
      <p className="text-muted-foreground">
        Track your progress, complete quests, and earn achievements in the crowdfunding ecosystem.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <GamificationProfileCard />
        </div>
        <div className="md:col-span-2">
          <Tabs defaultValue="quests">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="quests">Daily Quests</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>
            <TabsContent value="quests">
              <DailyQuests />
            </TabsContent>
            <TabsContent value="achievements">
              <AchievementsGallery />
            </TabsContent>
            <TabsContent value="leaderboard">
              <Leaderboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
