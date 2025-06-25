import { NextRequest, NextResponse } from 'next/server'
import { mockDatabase, SubscriptionUtils } from '@/lib/db'
import { Notification } from '@/lib/db/schema'

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    userId: 'user_pro_001',
    type: 'ipo',
    title: 'New IPO Alert',
    message: 'Tesla Model X card is now available for early access!',
    data: { cardId: 'card_tesla_x', price: 1200 },
    read: false,
    priority: 'high',
    requiresSubscription: 'pro',
    createdAt: new Date()
  },
  {
    id: 'notif_002',
    userId: 'user_pro_001',
    type: 'price_alert',
    title: 'Price Alert',
    message: 'Apple MacBook Pro M4 card price dropped 15%',
    data: { cardId: 'card_macbook_m4', oldPrice: 800, newPrice: 680 },
    read: false,
    priority: 'medium',
    requiresSubscription: 'pro',
    createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 mins ago
  },
  {
    id: 'notif_003',
    userId: 'user_ent_001',
    type: 'market',
    title: 'Market Update',
    message: 'Enterprise Dashboard: 25 new cards added to marketplace',
    data: { newCardsCount: 25, categories: ['Tech', 'Automotive', 'Real Estate'] },
    read: false,
    priority: 'low',
    requiresSubscription: 'enterprise',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 'notif_004',
    userId: 'user_pro_001',
    type: 'social',
    title: 'Trading Activity',
    message: 'CardMaster99 wants to trade with you!',
    data: { traderId: 'user_002', offeredCardId: 'card_nft_001' },
    read: true,
    priority: 'medium',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  }
]

// Initialize notifications in mock database
mockNotifications.forEach(notification => {
  mockDatabase.notifications.set(notification.id, notification)
})

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

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

    // Get all notifications for user
    let userNotifications = Array.from(mockDatabase.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // Filter by subscription requirements
    userNotifications = userNotifications.filter(notification => {
      if (!notification.requiresSubscription) return true
      
      const subscriptionLevel = SubscriptionUtils.getSubscriptionLevel(user)
      const isActive = SubscriptionUtils.isSubscriptionActive(user)
      
      if (!isActive) return notification.requiresSubscription === undefined
      
      if (notification.requiresSubscription === 'pro') {
        return subscriptionLevel === 'pro' || subscriptionLevel === 'enterprise'
      }
      
      if (notification.requiresSubscription === 'enterprise') {
        return subscriptionLevel === 'enterprise'
      }
      
      return true
    })

    // Filter unread only if requested
    if (unreadOnly) {
      userNotifications = userNotifications.filter(notification => !notification.read)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedNotifications = userNotifications.slice(startIndex, endIndex)

    // Count unread notifications
    const unreadCount = userNotifications.filter(notification => !notification.read).length

    return NextResponse.json({
      notifications: paginatedNotifications,
      pagination: {
        page,
        limit,
        total: userNotifications.length,
        totalPages: Math.ceil(userNotifications.length / limit)
      },
      unreadCount
    })
  } catch (error) {
    console.error('Notifications GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Mark notifications as read or create new notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, notificationIds, notification } = body

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
      case 'mark_read':
        if (!notificationIds || !Array.isArray(notificationIds)) {
          return NextResponse.json(
            { error: 'Notification IDs array is required for mark_read action' },
            { status: 400 }
          )
        }

        let markedCount = 0
        notificationIds.forEach(id => {
          const notification = mockDatabase.notifications.get(id)
          if (notification && notification.userId === userId) {
            notification.read = true
            markedCount++
          }
        })

        return NextResponse.json({
          success: true,
          message: `Marked ${markedCount} notifications as read`
        })

      case 'mark_all_read':
        let allMarkedCount = 0
        Array.from(mockDatabase.notifications.values())
          .filter(notification => notification.userId === userId && !notification.read)
          .forEach(notification => {
            notification.read = true
            allMarkedCount++
          })

        return NextResponse.json({
          success: true,
          message: `Marked ${allMarkedCount} notifications as read`
        })

      case 'create':
        if (!notification) {
          return NextResponse.json(
            { error: 'Notification data is required for create action' },
            { status: 400 }
          )
        }

        // Check if user can receive this type of notification
        if (notification.requiresSubscription) {
          const subscriptionLevel = SubscriptionUtils.getSubscriptionLevel(user)
          const isActive = SubscriptionUtils.isSubscriptionActive(user)
          
          if (!isActive) {
            return NextResponse.json(
              { error: 'Active subscription required for this notification type' },
              { status: 403 }
            )
          }
          
          if (notification.requiresSubscription === 'pro' && subscriptionLevel === 'free') {
            return NextResponse.json(
              { error: 'Pro subscription required for this notification type' },
              { status: 403 }
            )
          }
          
          if (notification.requiresSubscription === 'enterprise' && subscriptionLevel !== 'enterprise') {
            return NextResponse.json(
              { error: 'Enterprise subscription required for this notification type' },
              { status: 403 }
            )
          }
        }

        const newNotification: Notification = {
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          read: false,
          priority: notification.priority || 'medium',
          requiresSubscription: notification.requiresSubscription,
          createdAt: new Date()
        }

        mockDatabase.notifications.set(newNotification.id, newNotification)

        return NextResponse.json({
          success: true,
          notification: newNotification
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Notifications POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
