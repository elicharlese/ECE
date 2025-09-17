import { NextRequest, NextResponse } from 'next/server'
import { mockDatabase, SubscriptionUtils } from '@/lib/db'

// GET /api/subscription - Get user subscription details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    let user = mockDatabase.users.get(userId)
    if (!user) {
      // Create a default user if not found
      user = {
        id: userId,
        subscription: {
          plan: 'free',
          status: 'active',
          startDate: new Date(),
          features: {
            earlyMarketplaceAccess: false,
            realTimeAlerts: false,
            superLikesPerMonth: 3,
            boostsPerMonth: 1,
            enhancedUI: false,
            dataReports: false,
            businessStipend: 0,
            aiSuggestions: false,
            multiAppAccess: false,
            priority247Support: false,
            customIntegrations: false,
            dedicatedAccountManager: false,
            customReporting: false,
            whiteLabeling: false
          },
          usage: {
            superLikesUsed: 0,
            boostsUsed: 0,
            stipendUsed: 0
          }
        }
      }
      mockDatabase.users.set(userId, user)
    }

    const subscription = user.subscription
    const isActive = SubscriptionUtils.isSubscriptionActive(user)
    const features = subscription.features
    const usage = subscription.usage
    
    // Calculate remaining usage for current month
    const remainingUsage = {
      superLikes: Math.max(0, features.superLikesPerMonth - usage.superLikesUsed),
      boosts: Math.max(0, features.boostsPerMonth - usage.boostsUsed),
      stipend: Math.max(0, features.businessStipend - usage.stipendUsed)
    }

    return NextResponse.json({
      subscription: {
        ...subscription,
        isActive,
        remainingUsage
      }
    })
  } catch (error) {
    console.error('Subscription GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/subscription - Update subscription or use features
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, action, feature, amount = 1 } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const user = mockDatabase.users.get(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'use_feature':
        if (!feature) {
          return NextResponse.json(
            { error: 'Feature is required for use_feature action' },
            { status: 400 }
          )
        }

        const canUse = SubscriptionUtils.canUseFeature(user, feature)
        if (!canUse) {
          return NextResponse.json(
            { error: 'Feature usage limit exceeded or not available in current plan' },
            { status: 403 }
          )
        }

        // Mock feature usage tracking (should be database operation in production)
        const used = true // SubscriptionUtils.useFeature is not available in API context
        if (!used) {
          return NextResponse.json(
            { error: 'Failed to use feature' },
            { status: 400 }
          )
        }

        return NextResponse.json({
          success: true,
          message: `Used ${amount} ${feature}`,
          usage: user.subscription.usage
        })

      case 'upgrade':
        const { plan } = body
        if (!plan || !['pro', 'enterprise'].includes(plan)) {
          return NextResponse.json(
            { error: 'Valid plan (pro or enterprise) is required' },
            { status: 400 }
          )
        }

        // Update subscription plan
        user.subscription.plan = plan
        user.subscription.status = 'active'
        user.subscription.startDate = new Date()
        
        // Update features based on plan
        if (plan === 'pro') {
          user.subscription.features = {
            earlyMarketplaceAccess: true,
            realTimeAlerts: true,
            superLikesPerMonth: 10,
            boostsPerMonth: 10,
            enhancedUI: true,
            dataReports: true,
            businessStipend: 250,
            aiSuggestions: true,
            multiAppAccess: false,
            priority247Support: false,
            customIntegrations: false,
            dedicatedAccountManager: false,
            customReporting: false,
            whiteLabeling: false
          }
        } else if (plan === 'enterprise') {
          user.subscription.features = {
            earlyMarketplaceAccess: true,
            realTimeAlerts: true,
            superLikesPerMonth: 50,
            boostsPerMonth: 50,
            enhancedUI: true,
            dataReports: true,
            businessStipend: 1000,
            aiSuggestions: true,
            multiAppAccess: true,
            priority247Support: true,
            customIntegrations: true,
            dedicatedAccountManager: true,
            customReporting: true,
            whiteLabeling: true
          }
        }

        return NextResponse.json({
          success: true,
          message: `Upgraded to ${plan} plan`,
          subscription: user.subscription
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Subscription POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
