'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Zap,
  Shield,
  Sword,
  Star,
  Crown,
  Flame,
  Sparkles,
  Eye,
  Heart,
  Clock,
  Target,
  Wand2,
  Gem,
  Rocket,
  Snowflake,
  Sun,
  Moon,
  Cpu,
  DollarSign,
  TrendingUp,
  Plus,
  Minus,
  Search,
  Filter,
  Settings,
  Book,
  Beaker,
  Hammer,
  ShoppingCart,
  Package,
  Gift,
  Award,
  Briefcase,
  BarChart3
} from 'lucide-react'

// Powerup type definitions
export interface PowerupType {
  id: string
  name: string
  displayName: string
  description: string
  category: 'COMBAT' | 'DEFENSE' | 'UTILITY' | 'SPECIAL' | 'LEGENDARY' | 'TEMPORAL' | 'ELEMENTAL' | 'MYSTICAL' | 'TECHNOLOGICAL' | 'ECONOMIC'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'artifact'
  
  // Visual
  iconUrl?: string
  effectColor: string
  glowEffect: boolean
  particleEffect?: string
  
  // Gameplay
  effects: PowerupEffectDefinition[]
  duration?: number // seconds (null = permanent)
  cooldown?: number // seconds
  stackable: boolean
  maxStacks: number
  
  // Economics
  baseCost?: number
  craftable: boolean
  tradeable: boolean
  
  // Metadata
  version: string
  isActive: boolean
  releaseDate: Date
}

export interface PowerupEffectDefinition {
  type: 'STAT_BOOST' | 'DAMAGE_AMPLIFY' | 'DEFENSE_BOOST' | 'SPEED_INCREASE' | 'CRITICAL_CHANCE' | 'REGENERATION'
  targetStat: string
  modifier: number
  modifierType: 'ADD' | 'MULTIPLY' | 'PERCENT_INCREASE'
  description: string
}

export interface UserPowerup {
  id: string
  powerupId: string
  powerupType: PowerupType
  quantity: number
  level: number
  experience: number
  masteryLevel: number
  acquiredAt: Date
  acquiredFrom: 'PURCHASE' | 'CRAFT' | 'TRADE' | 'REWARD' | 'EVENT'
}

export interface PowerupRecipe {
  id: string
  resultId: string
  name: string
  description: string
  ingredients: { powerupId: string; quantity: number }[]
  eceRequired: number
  craftTime: number
  successRate: number
  maxPerDay?: number
  requiredLevel: number
  isActive: boolean
}

interface PowerupsSystemProps {
  className?: string
}

export const PowerupsSystem: React.FC<PowerupsSystemProps> = ({
  className
}) => {
  const [activeTab, setActiveTab] = useState('inventory')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterRarity, setFilterRarity] = useState('all')
  const [selectedPowerup, setSelectedPowerup] = useState<PowerupType | null>(null)
  const [craftingQueue, setCraftingQueue] = useState<string[]>([])
  const [showCraftingModal, setShowCraftingModal] = useState(false)

  // Sample powerup types
  const powerupTypes: PowerupType[] = [
    {
      id: 'pw-acquisition-boost',
      name: 'acquisition_boost',
      displayName: 'Acquisition Boost',
      description: 'Increases acquisition power by 25% for 1 hour',
      category: 'COMBAT',
      rarity: 'rare',
      effectColor: '#F92672',
      glowEffect: true,
      effects: [
        {
          type: 'STAT_BOOST',
          targetStat: 'acquisitionPower',
          modifier: 25,
          modifierType: 'PERCENT_INCREASE',
          description: '+25% acquisition power'
        }
      ],
      duration: 3600,
      stackable: false,
      maxStacks: 1,
      baseCost: 500,
      craftable: true,
      tradeable: true,
      version: '1.0',
      isActive: true,
      releaseDate: new Date()
    },
    {
      id: 'pw-defense-matrix',
      name: 'defense_matrix',
      displayName: 'Defense Matrix',
      description: 'Creates an impenetrable shield against hostile takeovers',
      category: 'DEFENSE',
      rarity: 'epic',
      effectColor: '#66D9EF',
      glowEffect: true,
      particleEffect: 'shield',
      effects: [
        {
          type: 'DEFENSE_BOOST',
          targetStat: 'defenseRating',
          modifier: 40,
          modifierType: 'PERCENT_INCREASE',
          description: '+40% defense against acquisitions'
        }
      ],
      duration: 7200,
      stackable: false,
      maxStacks: 1,
      baseCost: 1200,
      craftable: true,
      tradeable: true,
      version: '1.0',
      isActive: true,
      releaseDate: new Date()
    },
    {
      id: 'pw-market-oracle',
      name: 'market_oracle',
      displayName: 'Market Oracle',
      description: 'Reveals hidden market opportunities and future trends',
      category: 'MYSTICAL',
      rarity: 'legendary',
      effectColor: '#A6E22E',
      glowEffect: true,
      particleEffect: 'mystical',
      effects: [
        {
          type: 'STAT_BOOST',
          targetStat: 'marketDominance',
          modifier: 30,
          modifierType: 'PERCENT_INCREASE',
          description: '+30% market insight'
        }
      ],
      duration: 10800,
      stackable: false,
      maxStacks: 1,
      baseCost: 2500,
      craftable: false,
      tradeable: true,
      version: '1.0',
      isActive: true,
      releaseDate: new Date()
    },
    {
      id: 'pw-innovation-catalyst',
      name: 'innovation_catalyst',
      displayName: 'Innovation Catalyst',
      description: 'Accelerates R&D and breakthrough discoveries',
      category: 'TECHNOLOGICAL',
      rarity: 'epic',
      effectColor: '#E6DB74',
      glowEffect: true,
      effects: [
        {
          type: 'STAT_BOOST',
          targetStat: 'innovation',
          modifier: 35,
          modifierType: 'PERCENT_INCREASE',
          description: '+35% innovation speed'
        }
      ],
      duration: 5400,
      stackable: true,
      maxStacks: 3,
      baseCost: 1800,
      craftable: true,
      tradeable: true,
      version: '1.0',
      isActive: true,
      releaseDate: new Date()
    }
  ]

  // Sample user powerups inventory
  const [userPowerups, setUserPowerups] = useState<UserPowerup[]>([
    {
      id: 'up-001',
      powerupId: 'pw-acquisition-boost',
      powerupType: powerupTypes[0],
      quantity: 3,
      level: 2,
      experience: 150,
      masteryLevel: 1,
      acquiredAt: new Date(),
      acquiredFrom: 'CRAFT'
    },
    {
      id: 'up-002',
      powerupId: 'pw-defense-matrix',
      powerupType: powerupTypes[1],
      quantity: 1,
      level: 1,
      experience: 0,
      masteryLevel: 0,
      acquiredAt: new Date(),
      acquiredFrom: 'PURCHASE'
    }
  ])

  // Sample crafting recipes
  const craftingRecipes: PowerupRecipe[] = [
    {
      id: 'recipe-001',
      resultId: 'pw-acquisition-boost',
      name: 'Craft Acquisition Boost',
      description: 'Combine basic materials to create an acquisition powerup',
      ingredients: [
        { powerupId: 'pw-basic-energy', quantity: 2 },
        { powerupId: 'pw-market-data', quantity: 1 }
      ],
      eceRequired: 100,
      craftTime: 300, // 5 minutes
      successRate: 0.85,
      maxPerDay: 5,
      requiredLevel: 1,
      isActive: true
    }
  ]

  const categoryIcons = {
    COMBAT: Sword,
    DEFENSE: Shield,
    UTILITY: Settings,
    SPECIAL: Star,
    LEGENDARY: Crown,
    TEMPORAL: Clock,
    ELEMENTAL: Flame,
    MYSTICAL: Sparkles,
    TECHNOLOGICAL: Cpu,
    ECONOMIC: DollarSign
  }

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    uncommon: 'from-green-400 to-green-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500',
    mythic: 'from-red-400 to-pink-600',
    artifact: 'from-cyan-400 to-purple-600'
  }

  // Filter powerups
  const filteredPowerups = useMemo(() => {
    return powerupTypes.filter(powerup => {
      const matchesSearch = powerup.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          powerup.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === 'all' || powerup.category === filterCategory
      const matchesRarity = filterRarity === 'all' || powerup.rarity === filterRarity
      
      return matchesSearch && matchesCategory && matchesRarity
    })
  }, [powerupTypes, searchQuery, filterCategory, filterRarity])

  const PowerupCard = ({ powerup, userPowerup, showQuantity = false }: {
    powerup: PowerupType
    userPowerup?: UserPowerup
    showQuantity?: boolean
  }) => {
    const CategoryIcon = categoryIcons[powerup.category]
    const quantity = userPowerup?.quantity || 0

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="group cursor-pointer"
        onClick={() => setSelectedPowerup(powerup)}
      >
        <Card className={cn(
          'overflow-hidden transition-all duration-300 border-2',
          `bg-gradient-to-br ${rarityColors[powerup.rarity]}`,
          'hover:shadow-card-ece-hover',
          powerup.glowEffect && 'hover:shadow-lg'
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <CategoryIcon 
                  className="w-6 h-6" 
                  style={{ color: powerup.effectColor }}
                />
                <div>
                  <CardTitle className="text-lg font-bold text-white">
                    {powerup.displayName}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs mt-1">
                    {powerup.category}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right">
                <Badge className={`bg-gradient-to-r ${rarityColors[powerup.rarity]} text-white`}>
                  {powerup.rarity.toUpperCase()}
                </Badge>
                {showQuantity && quantity > 0 && (
                  <div className="text-lg font-bold text-white mt-1">
                    ×{quantity}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-white/80">
              {powerup.description}
            </p>

            {/* Effects */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-white/70">EFFECTS:</div>
              {powerup.effects.map((effect, index) => (
                <div key={index} className="text-xs text-white/90 bg-black/20 p-2 rounded">
                  {effect.description}
                </div>
              ))}
            </div>

            {/* Duration and cooldown */}
            <div className="flex justify-between text-xs text-white/70">
              {powerup.duration && (
                <span>Duration: {Math.floor(powerup.duration / 60)}m</span>
              )}
              {powerup.cooldown && (
                <span>Cooldown: {Math.floor(powerup.cooldown / 60)}m</span>
              )}
            </div>

            {/* Cost */}
            {powerup.baseCost && (
              <div className="text-center p-2 bg-black/20 rounded">
                <div className="text-lg font-bold text-monokai-warning">
                  {powerup.baseCost} ECE
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {userPowerup && userPowerup.quantity > 0 ? (
                <Button 
                  className="flex-1 bg-monokai-accent hover:bg-monokai-accent/90"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('Using powerup:', powerup.id)
                  }}
                >
                  USE
                </Button>
              ) : (
                <>
                  {powerup.craftable && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowCraftingModal(true)
                      }}
                    >
                      <Hammer className="w-4 h-4 mr-1" />
                      CRAFT
                    </Button>
                  )}
                  {powerup.baseCost && (
                    <Button 
                      className="flex-1 bg-monokai-success hover:bg-monokai-success/90"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('Buying powerup:', powerup.id)
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      BUY
                    </Button>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const CraftingInterface = ({ recipe }: { recipe: PowerupRecipe }) => {
    const [craftQuantity, setCraftQuantity] = useState(1)
    const canCraft = true // In real app, check ingredients

    return (
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{recipe.name}</h3>
            <Badge variant="outline">
              Success: {(recipe.successRate * 100).toFixed(0)}%
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">{recipe.description}</p>

          {/* Ingredients */}
          <div>
            <div className="text-sm font-medium mb-2">Required Ingredients:</div>
            <div className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background/50 rounded">
                  <span className="text-sm">Ingredient {index + 1}</span>
                  <span className="text-sm font-medium">×{ingredient.quantity}</span>
                </div>
              ))}
              {recipe.eceRequired > 0 && (
                <div className="flex items-center justify-between p-2 bg-monokai-warning/10 rounded">
                  <span className="text-sm">ECE Tokens</span>
                  <span className="text-sm font-medium text-monokai-warning">
                    {recipe.eceRequired * craftQuantity}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCraftQuantity(Math.max(1, craftQuantity - 1))}
            >
              <Zap className="h-5 w-5" />
            </Button>
            <Input
              type="number"
              value={craftQuantity}
              onChange={(e) => setCraftQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center"
              min={1}
              max={recipe.maxPerDay || 10}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCraftQuantity(Math.min(recipe.maxPerDay || 10, craftQuantity + 1))}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Craft time */}
          <div className="text-sm text-muted-foreground">
            Craft time: {Math.floor(recipe.craftTime / 60)}m {recipe.craftTime % 60}s each
          </div>

          {/* Craft button */}
          <Button
            className="w-full bg-monokai-accent hover:bg-monokai-accent/90"
            disabled={!canCraft}
            onClick={() => {
              console.log('Starting craft:', recipe.id, 'quantity:', craftQuantity)
              setCraftingQueue(prev => [...prev, ...Array(craftQuantity).fill(recipe.id)])
            }}
          >
            <Beaker className="w-4 h-4 mr-2" />
            START CRAFTING ({craftQuantity})
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-monokai-accent to-monokai-info bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ⚡ Powerups System
        </motion.h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Enhance your cards with powerful abilities, craft new powerups, and dominate the M&A battlefield.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Package className="w-8 h-8 mx-auto mb-2 text-monokai-accent" />
          <div className="text-2xl font-bold">{userPowerups.length}</div>
          <div className="text-sm text-muted-foreground">Owned</div>
        </Card>
        <Card className="p-4 text-center">
          <Flame className="w-8 h-8 mx-auto mb-2 text-monokai-warning" />
          <div className="text-2xl font-bold">
            {userPowerups.reduce((sum, up) => sum + up.quantity, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Quantity</div>
        </Card>
        <Card className="p-4 text-center">
          <Beaker className="w-8 h-8 mx-auto mb-2 text-monokai-success" />
          <div className="text-2xl font-bold">{craftingQueue.length}</div>
          <div className="text-sm text-muted-foreground">Crafting Queue</div>
        </Card>
        <Card className="p-4 text-center">
          <Award className="w-8 h-8 mx-auto mb-2 text-monokai-info" />
          <div className="text-2xl font-bold">
            {Math.max(...userPowerups.map(up => up.masteryLevel), 0)}
          </div>
          <div className="text-sm text-muted-foreground">Max Mastery</div>
        </Card>
      </div>

      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">
            My Powerups ({userPowerups.length})
          </TabsTrigger>
          <TabsTrigger value="marketplace">
            Marketplace ({powerupTypes.length})
          </TabsTrigger>
          <TabsTrigger value="crafting">
            Crafting ({craftingRecipes.length})
          </TabsTrigger>
          <TabsTrigger value="effects">
            Active Effects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search your powerups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              {Object.keys(categoryIcons).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* User powerups grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPowerups.map((userPowerup) => (
              <PowerupCard
                key={userPowerup.id}
                powerup={userPowerup.powerupType}
                userPowerup={userPowerup}
                showQuantity={true}
              />
            ))}
          </div>

          {userPowerups.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No powerups yet</h3>
              <p className="text-muted-foreground">
                Visit the marketplace or crafting section to get your first powerups.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search powerups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              {Object.keys(categoryIcons).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Rarities</option>
              {Object.keys(rarityColors).map(rarity => (
                <option key={rarity} value={rarity}>{rarity}</option>
              ))}
            </select>
          </div>

          {/* Powerups grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPowerups.map((powerup) => (
              <PowerupCard
                key={powerup.id}
                powerup={powerup}
                userPowerup={userPowerups.find(up => up.powerupId === powerup.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="crafting" className="space-y-6">
          {/* Crafting queue */}
          {craftingQueue.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Crafting Queue</h3>
                <Badge variant="secondary">{craftingQueue.length} items</Badge>
              </div>
              <div className="space-y-2">
                {craftingQueue.slice(0, 3).map((recipeId, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-background/50 rounded">
                    <span className="text-sm">Recipe {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">5m remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Crafting recipes */}
          <div className="space-y-6">
            {craftingRecipes.map((recipe) => (
              <CraftingInterface key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="effects" className="space-y-6">
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No active effects</h3>
            <p className="text-muted-foreground">
              Use powerups on your cards to see active effects here.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Powerup details modal */}
      <AnimatePresence>
        {selectedPowerup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedPowerup(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <PowerupCard
                powerup={selectedPowerup}
                userPowerup={userPowerups.find(up => up.powerupId === selectedPowerup.id)}
                showQuantity={true}
              />
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPowerup(null)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}