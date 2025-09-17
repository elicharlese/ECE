import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth/jwt'

// Authentication API - Handles user login, registration, and session management
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password, username, refreshToken } = body

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'login': {
        if (!email || !password) {
          return NextResponse.json(
            { success: false, error: 'Email and password are required' },
            { status: 400 }
          )
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !(await auth.comparePassword(password, user.passwordHash || ''))) {
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          )
        }

        // Generate JWT token
        const token = auth.generateToken({
          userId: user.id,
          email: user.email,
          role: 'user',
        })

        const refreshTokenStr = auth.generateRefreshToken(user.id)

        return NextResponse.json({
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: 'user',
          },
          token,
          refreshToken: refreshTokenStr,
          message: 'Login successful'
        })
      }

      case 'register': {
        if (!email || !password || !username) {
          return NextResponse.json(
            { success: false, error: 'Email, password, and username are required' },
            { status: 400 }
          )
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        })

        if (existingUser) {
          return NextResponse.json(
            { error: 'User already exists' },
            { status: 400 }
          )
        }

        // Hash password and create new user
        const hashedPassword = await auth.hashPassword(password)

        const newUser = await prisma.user.create({
          data: {
            email,
            username,
            passwordHash: hashedPassword,
          },
        })

        // Generate JWT token
        const token = auth.generateToken({
          userId: newUser.id,
          email: newUser.email,
          role: 'user',
        })

        const refreshTokenStr = auth.generateRefreshToken(newUser.id)

        return NextResponse.json({
          user: {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            role: 'user',
          },
          token,
          refreshToken: refreshTokenStr,
          message: 'Registration successful'
        })
      }

      case 'logout':
        return NextResponse.json({
          success: true,
          message: 'Logout successful'
        })

      case 'refresh': {
        if (!refreshToken) {
          return NextResponse.json(
            { error: 'Refresh token required' },
            { status: 400 }
          )
        }

        // Validate refresh token
        const { userId } = auth.verifyRefreshToken(refreshToken)

        const user = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (!user) {
          return NextResponse.json(
            { error: 'Invalid refresh token' },
            { status: 401 }
          )
        }

        // Generate new access token
        const newToken = auth.generateToken({
          userId: user.id,
          email: user.email,
          role: 'user',
        })

        return NextResponse.json({
          token: newToken,
          message: 'Token refreshed successfully'
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Auth Error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

// GET /api/auth - Get current user session
export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization')
    const token = authorization?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      )
    }

    // Verify JWT and return current user
    const payload = auth.verifyToken(token)
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { user: { id: user.id, email: user.email, username: user.username, firstName: user.firstName, lastName: user.lastName } }
    })
  } catch (error) {
    console.error('Auth GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Session validation failed' },
      { status: 500 }
    )
  }
}
