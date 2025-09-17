'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TradingCard, sampleTradingCards } from '@/components/trading-card'
import { CompanyCard, sampleCompanyCards } from '@/components/cards/CompanyCard'
import { AdvancedMarketplace } from '@/components/marketplace/AdvancedMarketplace'
import { UserCollection } from '@/components/collection/UserCollection'
import { PowerupsSystem } from '@/components/powerups/PowerupsSystem'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TradingCardsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const handleTrade = (cardId: string) => {
    console.log('Trading card:', cardId)
    // Implement trading logic
  }

  const handlePass = (cardId: string) => {
    console.log('Passing card:', cardId)
    // Implement pass logic
  }

  const handleCollect = (cardId: string) => {
    console.log('Collecting card:', cardId)
    // Implement collection logic
  }

  const handleMint = (cardId: string) => {
    console.log('Minting NFT for card:', cardId)
    // Implement NFT minting logic
  }

  const handleView = (cardId: string) => {
    console.log('Viewing card details:', cardId)
    // Implement view details logic
  }

  const handleAcquire = (cardId: string) => {
    console.log('Acquiring company:', cardId)
    // Implement M&A acquisition logic
  }

  const handleDefend = (cardId: string) => {
    console.log('Defending company:', cardId)
    // Implement defense logic
  }

  const handleBattle = (cardId: string) => {
    console.log('Starting M&A battle:', cardId)
    // Implement battle logic
  }

  const handleBid = (cardId: string) => {
    console.log('Bidding on company:', cardId)
    // Implement bidding logic
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateY: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-monokai-accent via-monokai-purple to-monokai-info bg-clip-text text-transparent mb-4 text-shadow-soft">
              🎮 ECE Trading Cards Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Master M&A battles with strategic company cards, advanced marketplace features, and powerful enhancement systems
            </p>
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12">
              <Card className="glass-card shadow-soft">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-monokai-accent">
                    {sampleCompanyCards.length + sampleTradingCards.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Cards
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card shadow-soft">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-monokai-success">
                    {sampleCompanyCards.filter(card => card.isNFT).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    NFT Companies
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card shadow-soft">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-monokai-info">
                    {sampleCompanyCards.filter(card => card.rarity === 'legendary' || card.rarity === 'mythic').length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Elite Companies
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card shadow-soft">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-monokai-warning">
                    $2.4T
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Market Cap
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card shadow-soft">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-monokai-purple">
                    15
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Battles
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Platform Interface */}
      <div className="container mx-auto px-4 pb-16">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">
              🎮 Overview
            </TabsTrigger>
            <TabsTrigger value="marketplace">
              🏪 Marketplace
            </TabsTrigger>
            <TabsTrigger value="collection">
              📦 Collection
            </TabsTrigger>
            <TabsTrigger value="powerups">
              ⚡ Powerups
            </TabsTrigger>
            <TabsTrigger value="cards">
              🎴 All Cards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Company Cards Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-monokai-accent to-monokai-info bg-clip-text text-transparent">
                  🏢 Featured Company Cards
                </h2>
                <p className="text-muted-foreground">
                  Strategic M&A-focused cards representing real companies in the battle for corporate dominance
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleCompanyCards.map((card) => (
                  <motion.div
                    key={card.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                  >
                    <CompanyCard
                      card={card}
                      onAcquire={() => handleAcquire(card.id)}
                      onDefend={() => handleDefend(card.id)}
                      onTrade={() => handleTrade(card.id)}
                      onView={() => handleView(card.id)}
                      onBattle={() => handleBattle(card.id)}
                      onBid={() => handleBid(card.id)}
                      variant="default"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Traditional Trading Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-monokai-success to-monokai-warning bg-clip-text text-transparent">
                  🎴 Classic Trading Cards
                </h2>
                <p className="text-muted-foreground">
                  Traditional collectible cards with unique abilities and stunning 3D models
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sampleTradingCards.slice(0, 4).map((card) => (
                  <motion.div
                    key={card.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                  >
                    <TradingCard
                      card={card}
                      onTrade={() => handleTrade(card.id)}
                      onPass={() => handlePass(card.id)}
                      onCollect={() => handleCollect(card.id)}
                      onMint={card.isNFT ? undefined : () => handleMint(card.id)}
                      onView={() => handleView(card.id)}
                      variant="default"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-16"
            >
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg"
                  onClick={() => setActiveSection('marketplace')}
                  className="bg-gradient-to-r from-monokai-accent to-monokai-accent/80 shadow-soft hover:shadow-soft-lg"
                >
                  🛒 Browse Marketplace
                </Button>
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={() => setActiveSection('collection')}
                  className="shadow-soft hover:shadow-soft-lg"
                >
                  📦 My Collection
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => setActiveSection('powerups')}
                  className="shadow-soft hover:shadow-soft-lg"
                >
                  ⚡ Powerups System
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="shadow-soft hover:shadow-soft-lg"
                >
                  🎲 Random Pack
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="marketplace">
            <AdvancedMarketplace />
          </TabsContent>

          <TabsContent value="collection">
            <UserCollection />
          </TabsContent>

          <TabsContent value="powerups">
            <PowerupsSystem />
          </TabsContent>

          <TabsContent value="cards" className="space-y-8">
            {/* All Cards Display */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Company Cards */}
              <div>
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-monokai-accent to-monokai-info bg-clip-text text-transparent">
                  Company Cards
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleCompanyCards.map((card) => (
                    <motion.div
                      key={card.id}
                      variants={cardVariants}
                    >
                      <CompanyCard
                        card={card}
                        onAcquire={() => handleAcquire(card.id)}
                        onDefend={() => handleDefend(card.id)}
                        onTrade={() => handleTrade(card.id)}
                        onView={() => handleView(card.id)}
                        onBattle={() => handleBattle(card.id)}
                        onBid={() => handleBid(card.id)}
                        variant="default"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Traditional Cards */}
              <div>
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-monokai-success to-monokai-warning bg-clip-text text-transparent">
                  Traditional Cards
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sampleTradingCards.map((card) => (
                    <motion.div
                      key={card.id}
                      variants={cardVariants}
                    >
                      <TradingCard
                        card={card}
                        onTrade={() => handleTrade(card.id)}
                        onPass={() => handlePass(card.id)}
                        onCollect={() => handleCollect(card.id)}
                        onMint={card.isNFT ? undefined : () => handleMint(card.id)}
                        onView={() => handleView(card.id)}
                        variant="default"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 text-6xl opacity-10"
        >
          ✦
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 text-8xl opacity-10"
        >
          🎮
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 right-1/6 text-4xl opacity-10"
        >
          🪙
        </motion.div>
      </div>
    </div>
  )
}
