import jwt, { SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export const auth = {
  // Generate JWT token
  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET as string, {
      expiresIn: '7d',
    })
  },

  // Verify JWT token
  verifyToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET as string) as JWTPayload
  },

  // Hash password
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  },

  // Compare password with hash
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  },

  // Generate refresh token
  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, {
      expiresIn: '30d',
    })
  },

  // Verify refresh token
  verifyRefreshToken(token: string): { userId: string } {
    const payload = jwt.verify(token, JWT_SECRET) as any
    if (payload.type !== 'refresh') {
      throw new Error('Invalid refresh token')
    }
    return { userId: payload.userId }
  },
}
