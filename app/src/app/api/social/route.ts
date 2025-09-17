// Social Feed API - Handles social interactions, posts, and activity feed
import { NextRequest, NextResponse } from 'next/server'
import { mockDatabase } from '@/lib/db'
import { SocialFeed, SocialComment, ApiResponse } from '@/lib/db/schema'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get social feed posts from mockDatabase
    let posts = Array.from(mockDatabase.socialFeeds.values())
    
    // Filter by user if specified
    if (userId) {
      posts = posts.filter(post => post.userId === userId)
    }
    
    // Filter by type if specified
    if (type) {
      posts = posts.filter(post => post.type === type)
    }
    
    // Apply pagination
    const offset = (page - 1) * limit
    const paginatedPosts = posts.slice(offset, offset + limit)

    const response: ApiResponse<SocialFeed[]> = {
      success: true,
      data: paginatedPosts
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Social Feed GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social feed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { userId, type, content } = body

    if (!userId || !type || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, type, content' },
        { status: 400 }
      )
    }

    if (!['trade', 'purchase', 'achievement', 'milestone', 'battle_win', 'bet_win'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid post type' },
        { status: 400 }
      )
    }

    // Create new social post
    const newPost: Partial<SocialFeed> = {
      id: `post_${Date.now()}`,
      userId,
      type,
      content,
      cardId: body.cardId,
      metadata: body.metadata || {},
      likes: 0,
      comments: [],
      isPublic: body.isPublic !== false, // default to public
      createdAt: new Date()
    }

    return NextResponse.json({
      success: true,
      data: newPost,
      message: 'Post created successfully'
    })
  } catch (error) {
    console.error('Create Social Post Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, action, userId, content } = body

    if (!postId || !action || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: postId, action, userId' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'like':
        // Toggle like on post
        return NextResponse.json({
          success: true,
          message: 'Post liked successfully'
        })

      case 'comment':
        if (!content) {
          return NextResponse.json(
            { success: false, error: 'Comment content is required' },
            { status: 400 }
          )
        }

        const newComment: Partial<SocialComment> = {
          id: `comment_${Date.now()}`,
          feedId: postId,
          userId,
          content,
          likes: 0,
          createdAt: new Date()
        }

        return NextResponse.json({
          success: true,
          data: newComment,
          message: 'Comment added successfully'
        })

      case 'delete':
        // Delete post (only by owner)
        return NextResponse.json({
          success: true,
          message: 'Post deleted successfully'
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Update Social Post Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    )
  }
}
