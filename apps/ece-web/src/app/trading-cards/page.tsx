'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TradingCard, sampleTradingCards } from '@/components/trading-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TradingCardsPage() {
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
              🎮 ECE Trading Cards
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover, collect, and trade unique digital cards with 3D models and NFT capabilities
            </p>
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
              <Card className="glass-card shadow-soft">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-monokai-accent">
                    {sampleTradingCards.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Cards
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card shadow-soft">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-monokai-success">
                    {sampleTradingCards.filter(card => card.isNFT).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    NFT Cards
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card shadow-soft">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-monokai-info">
                    {sampleTradingCards.filter(card => card.rarity === 'legendary' || card.rarity === 'mythic').length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Rare Cards
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card shadow-soft">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-monokai-warning">
                    ${Math.round(sampleTradingCards.reduce((sum, card) => sum + card.price, 0))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Value
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trading Cards Grid */}
      <div className="container mx-auto px-4 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center"
        >
          {sampleTradingCards.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              className="w-full flex justify-center"
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
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-monokai-accent to-monokai-accent/80 shadow-soft hover:shadow-soft-lg"
            >
              🛒 Browse Market
            </Button>
            <Button 
              variant="secondary"
              size="lg"
              className="shadow-soft hover:shadow-soft-lg"
            >
              📦 My Collection
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="shadow-soft hover:shadow-soft-lg"
            >
              🎲 Random Pack
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="shadow-soft hover:shadow-soft-lg"
            >
              🔧 Card Builder
            </Button>
          </div>
        </motion.div>
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
