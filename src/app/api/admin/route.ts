import { NextRequest, NextResponse } from 'next/server'
import { mockDatabase, SubscriptionUtils } from '@/lib/db'

// Admin authentication check (simplified for demo)
function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  // In production, validate JWT token and check admin role
  return authHeader === 'Bearer admin_token_demo'
}

// GET /api/admin - Get admin dashboard data
export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'dashboard'

    switch (action) {
      case 'dashboard':
        const users = Array.from(mockDatabase.users.values())
        const totalUsers = users.length
        const subscriptionStats = {
          free: users.filter(u => u.subscription.plan === 'free').length,
          pro: users.filter(u => u.subscription.plan === 'pro').length,
          enterprise: users.filter(u => u.subscription.plan === 'enterprise').length
        }
        
        const activeSubscriptions = users.filter(u => 
          SubscriptionUtils.isSubscriptionActive(u) && u.subscription.plan !== 'free'
        ).length

        const totalRevenue = users.reduce((sum, user) => {
          if (!SubscriptionUtils.isSubscriptionActive(user)) return sum
          
          const monthlyPrice = user.subscription.plan === 'pro' ? 29 : 
                              user.subscription.plan === 'enterprise' ? 299 : 0
          
          return sum + monthlyPrice
        }, 0)

        return NextResponse.json({
          dashboard: {
            totalUsers,
            activeSubscriptions,
            subscriptionStats,
            totalRevenue,
            notifications: Array.from(mockDatabase.notifications.values()).length,
            marketplaceListings: Array.from(mockDatabase.marketplaceListings.values()).length
          }
        })

      case 'users':
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const plan = searchParams.get('plan')
        const status = searchParams.get('status')

        let filteredUsers = Array.from(mockDatabase.users.values())
        
        if (plan) {
          filteredUsers = filteredUsers.filter(u => u.subscription.plan === plan)
        }
        
        if (status) {
          filteredUsers = filteredUsers.filter(u => u.subscription.status === status)
        }

        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

        return NextResponse.json({
          users: paginatedUsers.map(user => ({
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            tier: user.tier,
            eceBalance: user.eceBalance,
            isVerified: user.isVerified,
            role: user.role,
            subscription: user.subscription,
            createdAt: user.createdAt
          })),
          pagination: {
            page,
            limit,
            total: filteredUsers.length,
            totalPages: Math.ceil(filteredUsers.length / limit)
          }
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Admin GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin - Admin actions
export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, userId, data } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'update_subscription':
        if (!userId || !data) {
          return NextResponse.json(
            { error: 'User ID and subscription data are required' },
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

        // Update subscription
        user.subscription = { ...user.subscription, ...data, updatedAt: new Date() }

        return NextResponse.json({
          success: true,
          message: 'Subscription updated successfully',
          subscription: user.subscription
        })

      case 'grant_features':
        if (!userId || !data?.features) {
          return NextResponse.json(
            { error: 'User ID and features are required' },
            { status: 400 }
          )
        }

        const userToUpdate = mockDatabase.users.get(userId)
        if (!userToUpdate) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          )
        }

        // Grant specific features
        Object.assign(userToUpdate.subscription.features, data.features)
        userToUpdate.subscription.updatedAt = new Date()

        return NextResponse.json({
          success: true,
          message: 'Features granted successfully',
          features: userToUpdate.subscription.features
        })

      case 'update_user_role':
        if (!userId || !data?.role) {
          return NextResponse.json(
            { error: 'User ID and role are required' },
            { status: 400 }
          )
        }

        const userToUpdateRole = mockDatabase.users.get(userId)
        if (!userToUpdateRole) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          )
        }

        userToUpdateRole.role = data.role
        userToUpdateRole.updatedAt = new Date()

        return NextResponse.json({
          success: true,
          message: 'User role updated successfully',
          user: {
            id: userToUpdateRole.id,
            role: userToUpdateRole.role,
            updatedAt: userToUpdateRole.updatedAt
          }
        })

      case 'reset_usage':
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          )
        }

        const userToReset = mockDatabase.users.get(userId)
        if (!userToReset) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          )
        }

        // Reset monthly usage
        userToReset.subscription.usage = {
          userId,
          month: new Date().toISOString().slice(0, 7),
          superLikesUsed: 0,
          boostsUsed: 0,
          stipendUsed: 0,
          alertsReceived: 0,
          reportsGenerated: 0
        }

        return NextResponse.json({
          success: true,
          message: 'Usage reset successfully',
          usage: userToReset.subscription.usage
        })

      case 'send_notification':
        if (!data?.notification) {
          return NextResponse.json(
            { error: 'Notification data is required' },
            { status: 400 }
          )
        }

        const notification = {
          id: `admin_notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: userId || 'all',
          type: data.notification.type || 'system',
          title: data.notification.title,
          message: data.notification.message,
          data: data.notification.data,
          read: false,
          priority: data.notification.priority || 'medium',
          requiresSubscription: data.notification.requiresSubscription,
          createdAt: new Date()
        }

        if (userId === 'all' || !userId) {
          // Send to all users
          Array.from(mockDatabase.users.keys()).forEach(uid => {
            const userNotification = { ...notification, userId: uid, id: `${notification.id}_${uid}` }
            mockDatabase.notifications.set(userNotification.id, userNotification)
          })
        } else {
          // Send to specific user
          mockDatabase.notifications.set(notification.id, notification)
        }

        return NextResponse.json({
          success: true,
          message: userId === 'all' ? 'Notification sent to all users' : 'Notification sent to user',
          notification
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Admin POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
