'use client'

import { motion } from 'framer-motion'
import { Crown, Sparkles, Star, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubscriptionBadgeProps {
  plan: 'free' | 'pro' | 'enterprise'
  className?: string
  showLabel?: boolean
}

export function SubscriptionBadge({ plan, className, showLabel = true }: SubscriptionBadgeProps) {
  const config = {
    free: {
      icon: null,
      label: 'Free',
      className: 'bg-gray-100 text-gray-600',
      iconColor: 'text-gray-500'
    },
    pro: {
      icon: Star,
      label: 'Pro',
      className: 'bg-gradient-to-r from-monokai-pink to-monokai-orange text-white',
      iconColor: 'text-white'
    },
    enterprise: {
      icon: Crown,
      label: 'Enterprise',
      className: 'bg-gradient-to-r from-monokai-purple to-monokai-blue text-white',
      iconColor: 'text-white'
    }
  }

  const { icon: Icon, label, className: badgeClass, iconColor } = config[plan]

  if (plan === 'free' && !showLabel) return null

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        'inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold',
        badgeClass,
        className
      )}
    >
      {Icon && <Icon className={cn('w-3 h-3', iconColor)} />}
      {showLabel && <span>{label}</span>}
    </motion.div>
  )
}

interface ProEnhancedCardProps {
  children: React.ReactNode
  isPro: boolean
  isEnterprise: boolean
  className?: string
}

export function ProEnhancedCard({ children, isPro, isEnterprise, className }: ProEnhancedCardProps) {
  if (!isPro && !isEnterprise) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden',
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Enhanced background for Pro/Enterprise */}
      <div className="absolute inset-0 bg-gradient-to-br from-monokai-pink/5 via-transparent to-monokai-blue/5 pointer-events-none" />
      
      {/* Sparkle animation for Enterprise */}
      {isEnterprise && (
        <div className="absolute top-2 right-2 z-10">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-4 h-4 text-monokai-purple" />
          </motion.div>
        </div>
      )}
      
      {/* Enhanced border */}
      <div className={cn(
        'absolute inset-0 rounded-lg pointer-events-none',
        isEnterprise 
          ? 'bg-gradient-to-r from-monokai-purple via-monokai-blue to-monokai-green p-[1px]'
          : 'bg-gradient-to-r from-monokai-pink to-monokai-orange p-[1px]'
      )}>
        <div className="w-full h-full rounded-lg bg-background" />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

interface FeatureLockProps {
  feature: string
  requiredPlan: 'pro' | 'enterprise'
  currentPlan: 'free' | 'pro' | 'enterprise'
  onUpgrade?: () => void
  children?: React.ReactNode
}

export function FeatureLock({ feature, requiredPlan, currentPlan, onUpgrade, children }: FeatureLockProps) {
  const hasAccess = (currentPlan === 'pro' && requiredPlan === 'pro') || 
                   (currentPlan === 'enterprise') ||
                   (currentPlan === 'pro' && requiredPlan === 'pro')

  if (hasAccess) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="filter blur-sm opacity-50 pointer-events-none">
        {children}
      </div>
      
      {/* Upgrade overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-monokai-pink/50"
      >
        <div className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            {requiredPlan === 'enterprise' ? (
              <Crown className="w-8 h-8 text-monokai-purple" />
            ) : (
              <Star className="w-8 h-8 text-monokai-pink" />
            )}
          </div>
          <h3 className="font-semibold text-foreground mb-1">
            {requiredPlan === 'enterprise' ? 'Enterprise' : 'Pro'} Feature
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Upgrade to access {feature}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUpgrade}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold text-white',
              requiredPlan === 'enterprise'
                ? 'bg-gradient-to-r from-monokai-purple to-monokai-blue'
                : 'bg-gradient-to-r from-monokai-pink to-monokai-orange'
            )}
          >
            Upgrade to {requiredPlan === 'enterprise' ? 'Enterprise' : 'Pro'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

interface UsageMeterProps {
  used: number
  total: number
  label: string
  className?: string
}

export function UsageMeter({ used, total, label, className }: UsageMeterProps) {
  const percentage = Math.min((used / total) * 100, 100)
  const isNearLimit = percentage > 80
  const isAtLimit = percentage >= 100

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn(
          'font-medium',
          isAtLimit ? 'text-red-500' : isNearLimit ? 'text-orange-500' : 'text-foreground'
        )}>
          {used}/{total}
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            'h-full rounded-full',
            isAtLimit
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : isNearLimit
                ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                : 'bg-gradient-to-r from-monokai-green to-monokai-blue'
          )}
        />
      </div>
      
      {isNearLimit && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-orange-600 flex items-center space-x-1"
        >
          <Zap className="w-3 h-3" />
          <span>
            {isAtLimit ? 'Limit reached' : 'Approaching limit'}
          </span>
        </motion.p>
      )}
    </div>
  )
}

interface RealTimeAlertProps {
  title: string
  message: string
  type: 'ipo' | 'price_alert' | 'market' | 'social'
  onDismiss?: () => void
  isPro?: boolean
}

export function RealTimeAlert({ title, message, type, onDismiss, isPro = false }: RealTimeAlertProps) {
  const typeConfig = {
    ipo: { icon: Sparkles, color: 'from-monokai-purple to-monokai-blue' },
    price_alert: { icon: Zap, color: 'from-monokai-orange to-monokai-pink' },
    market: { icon: Star, color: 'from-monokai-green to-monokai-blue' },
    social: { icon: Crown, color: 'from-monokai-pink to-monokai-purple' }
  }

  const { icon: Icon, color } = typeConfig[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={cn(
        'relative overflow-hidden rounded-lg p-4 text-white shadow-2xl',
        `bg-gradient-to-r ${color}`
      )}
    >
      {isPro && (
        <div className="absolute top-2 right-2">
          <SubscriptionBadge plan="pro" showLabel={false} />
        </div>
      )}
      
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="text-sm opacity-90 mt-1">{message}</p>
        </div>
      </div>
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-white/60 hover:text-white"
        >
          ×
        </button>
      )}
    </motion.div>
  )
}
