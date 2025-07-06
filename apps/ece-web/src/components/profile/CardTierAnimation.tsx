'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Star, Crown, Zap, Diamond, Flame, Shield } from 'lucide-react'

interface CardTierAnimationProps {
  tier: string
  isHovered?: boolean
  isSelected?: boolean
  children: React.ReactNode
  className?: string
}

export const CardTierAnimation: React.FC<CardTierAnimationProps> = ({
  tier,
  isHovered = false,
  isSelected = false,
  children,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Add tier-specific CSS classes for advanced animations
    container.classList.add(`tier-${tier}`)

    // Cleanup
    return () => {
      container.classList.remove(`tier-${tier}`)
    }
  }, [tier])

  const getTierAnimationVariants = () => {
    const baseVariants = {
      initial: { scale: 1, rotateY: 0 },
      hover: { scale: 1.05, rotateY: 5 },
      selected: { scale: 1.08, rotateY: 0 }
    }

    switch (tier) {
      case 'mythic':
        return {
          initial: { 
            scale: 1, 
            rotateY: 0,
            filter: 'hue-rotate(0deg)',
            boxShadow: '0 0 0 rgba(129, 154, 255, 0)'
          },
          hover: { 
            scale: 1.08, 
            rotateY: 8,
            filter: 'hue-rotate(360deg)',
            boxShadow: '0 0 40px rgba(129, 154, 255, 0.6), 0 0 80px rgba(129, 154, 255, 0.3)',
            transition: {
              filter: { duration: 2, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 0.3 },
              scale: { duration: 0.3 },
              rotateY: { duration: 0.3 }
            }
          },
          selected: { 
            scale: 1.1, 
            rotateY: 0,
            filter: 'hue-rotate(180deg)',
            boxShadow: '0 0 60px rgba(129, 154, 255, 0.8)'
          }
        }

      case 'legendary':
        return {
          initial: { 
            scale: 1, 
            rotateY: 0,
            boxShadow: '0 0 0 rgba(230, 219, 116, 0)'
          },
          hover: { 
            scale: 1.06, 
            rotateY: 6,
            boxShadow: '0 0 30px rgba(230, 219, 116, 0.6), 0 0 60px rgba(230, 219, 116, 0.3)',
            transition: {
              boxShadow: { duration: 0.3 },
              scale: { duration: 0.3 },
              rotateY: { duration: 0.3 }
            }
          },
          selected: { 
            scale: 1.08, 
            rotateY: 0,
            boxShadow: '0 0 40px rgba(230, 219, 116, 0.8)'
          }
        }

      case 'epic':
        return {
          initial: { 
            scale: 1, 
            rotateY: 0,
            boxShadow: '0 0 0 rgba(249, 38, 114, 0)'
          },
          hover: { 
            scale: 1.05, 
            rotateY: 4,
            boxShadow: '0 0 20px rgba(249, 38, 114, 0.5)',
            transition: {
              duration: 0.3
            }
          },
          selected: { 
            scale: 1.06, 
            rotateY: 0,
            boxShadow: '0 0 25px rgba(249, 38, 114, 0.7)'
          }
        }

      case 'rare':
        return {
          initial: { 
            scale: 1, 
            rotateY: 0,
            boxShadow: '0 0 0 rgba(102, 217, 239, 0)'
          },
          hover: { 
            scale: 1.04, 
            rotateY: 3,
            boxShadow: '0 0 15px rgba(102, 217, 239, 0.4)',
            transition: {
              duration: 0.3
            }
          },
          selected: { 
            scale: 1.05, 
            rotateY: 0,
            boxShadow: '0 0 20px rgba(102, 217, 239, 0.6)'
          }
        }

      case 'uncommon':
        return {
          initial: { 
            scale: 1, 
            rotateY: 0,
            boxShadow: '0 0 0 rgba(166, 226, 46, 0)'
          },
          hover: { 
            scale: 1.03, 
            rotateY: 2,
            boxShadow: '0 0 10px rgba(166, 226, 46, 0.3)',
            transition: {
              duration: 0.3
            }
          },
          selected: { 
            scale: 1.04, 
            rotateY: 0,
            boxShadow: '0 0 15px rgba(166, 226, 46, 0.5)'
          }
        }

      default: // common
        return baseVariants
    }
  }

  const getParticleEffects = () => {
    if (!isHovered && !isSelected) return null

    switch (tier) {
      case 'mythic':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#819AFF] rounded-full"
                initial={{ 
                  x: Math.random() * 100 + '%', 
                  y: Math.random() * 100 + '%',
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  x: [
                    Math.random() * 100 + '%',
                    Math.random() * 100 + '%',
                    Math.random() * 100 + '%'
                  ],
                  y: [
                    Math.random() * 100 + '%',
                    Math.random() * 100 + '%',
                    Math.random() * 100 + '%'
                  ],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )

      case 'legendary':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ 
                  x: '50%', 
                  y: '50%',
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  x: `${50 + Math.cos(i * Math.PI / 4) * 40}%`,
                  y: `${50 + Math.sin(i * Math.PI / 4) * 40}%`,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  rotate: 360
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeInOut"
                }}
              >
                <Star className="w-2 h-2 text-[#E6DB74]" />
              </motion.div>
            ))}
          </div>
        )

      case 'epic':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-4 bg-gradient-to-t from-[#F92672] to-transparent"
                style={{
                  left: `${20 + i * 12}%`,
                  bottom: '0%'
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ 
                  scaleY: [0, 1, 0.5, 1, 0],
                  opacity: [0, 1, 0.7, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )

      case 'rare':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute inset-0 border-2 border-[#66D9EF] rounded-lg"
              initial={{ borderColor: 'rgba(102, 217, 239, 0)' }}
              animate={{ 
                borderColor: [
                  'rgba(102, 217, 239, 0)',
                  'rgba(102, 217, 239, 0.8)',
                  'rgba(102, 217, 239, 0)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        )

      default:
        return null
    }
  }

  const getBackgroundEffect = () => {
    if (!isHovered && !isSelected) return null

    switch (tier) {
      case 'mythic':
        return (
          <motion.div
            className="absolute inset-0 rounded-lg"
            initial={{ 
              background: 'radial-gradient(circle at center, rgba(129, 154, 255, 0) 0%, rgba(129, 154, 255, 0) 100%)'
            }}
            animate={{ 
              background: [
                'radial-gradient(circle at 30% 30%, rgba(129, 154, 255, 0.1) 0%, rgba(129, 154, 255, 0) 50%)',
                'radial-gradient(circle at 70% 70%, rgba(129, 154, 255, 0.1) 0%, rgba(129, 154, 255, 0) 50%)',
                'radial-gradient(circle at 30% 70%, rgba(129, 154, 255, 0.1) 0%, rgba(129, 154, 255, 0) 50%)',
                'radial-gradient(circle at 70% 30%, rgba(129, 154, 255, 0.1) 0%, rgba(129, 154, 255, 0) 50%)',
                'radial-gradient(circle at 30% 30%, rgba(129, 154, 255, 0.1) 0%, rgba(129, 154, 255, 0) 50%)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )

      case 'legendary':
        return (
          <motion.div
            className="absolute inset-0 rounded-lg"
            initial={{ 
              background: 'linear-gradient(45deg, rgba(230, 219, 116, 0) 0%, rgba(230, 219, 116, 0) 100%)'
            }}
            animate={{ 
              background: [
                'linear-gradient(45deg, rgba(230, 219, 116, 0.05) 0%, rgba(230, 219, 116, 0) 50%, rgba(230, 219, 116, 0.05) 100%)',
                'linear-gradient(135deg, rgba(230, 219, 116, 0.05) 0%, rgba(230, 219, 116, 0) 50%, rgba(230, 219, 116, 0.05) 100%)',
                'linear-gradient(225deg, rgba(230, 219, 116, 0.05) 0%, rgba(230, 219, 116, 0) 50%, rgba(230, 219, 116, 0.05) 100%)',
                'linear-gradient(315deg, rgba(230, 219, 116, 0.05) 0%, rgba(230, 219, 116, 0) 50%, rgba(230, 219, 116, 0.05) 100%)',
                'linear-gradient(45deg, rgba(230, 219, 116, 0.05) 0%, rgba(230, 219, 116, 0) 50%, rgba(230, 219, 116, 0.05) 100%)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      variants={getTierAnimationVariants()}
      initial="initial"
      animate={isSelected ? "selected" : isHovered ? "hover" : "initial"}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {getBackgroundEffect()}
      {children}
      {getParticleEffects()}
      
      {/* Add glow overlay for higher tiers */}
      {(tier === 'legendary' || tier === 'mythic') && (isHovered || isSelected) && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
          style={{
            background: tier === 'mythic' 
              ? 'radial-gradient(circle at center, #819AFF, transparent)'
              : 'radial-gradient(circle at center, #E6DB74, transparent)',
            mixBlendMode: 'overlay'
          }}
        />
      )}
    </motion.div>
  )
}

export default CardTierAnimation
