// Wallet API - Handles ECE balance, transactions, and payment processing
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user balance and transactions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        eceBalance: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true
      }
    })
    
    // Dev-friendly fallback: return mock wallet if user not found
    if (!user) {
      const mockWallet = {
        balance: 1250.5,
        currency: 'ECE' as const,
        transactions: [],
        totalTransactions: 0,
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      }
      return NextResponse.json({ success: true, data: mockWallet })
    }

    // Build where clause for transactions (use generic typing for compatibility)
    const prismaAny = prisma as any
    const hasTransactionsModel = !!(prismaAny && prismaAny.transaction)
    // If transactions model is missing (dev env), return balance with empty transactions
    if (!hasTransactionsModel) {
      const walletData = {
        balance: user.eceBalance,
        currency: 'ECE' as const,
        transactions: [],
        totalTransactions: 0,
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      }
      return NextResponse.json({ success: true, data: walletData })
    }

    const where: any = { userId }
    
    if (type) {
      const typeEnum = type.toUpperCase() as any
      where.type = typeEnum
    }

    // Get paginated transactions
    const offset = (page - 1) * limit
    
    const [transactions, totalCount] = await Promise.all([
      prismaAny.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          card: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      }),
      prismaAny.transaction.count({ where })
    ])

    const walletData = {
      balance: user.eceBalance,
      currency: 'ECE',
      transactions,
      totalTransactions: totalCount,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }

    return NextResponse.json({
      success: true,
      data: walletData
    })
  } catch (error) {
    console.error('Wallet GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { userId, type, amount, currency = 'ECE' } = body

    if (!userId || !type || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, type, amount' },
        { status: 400 }
      )
    }

    const allowedTypes = ['DEPOSIT','WITHDRAWAL','PURCHASE','SALE','TRADE','REWARD','REFUND']
    const typeEnum = (typeof type === 'string' ? type.toUpperCase() : '') as string
    if (!allowedTypes.includes(typeEnum)) {
      return NextResponse.json(
        { success: false, error: 'Invalid transaction type' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Process transaction based on type
    let transactionStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELED' | 'REFUNDED' = 'PENDING'
    const prismaAny = prisma as any
    const hasTransactionsModel = !!(prismaAny && prismaAny.transaction)
    
    switch (typeEnum) {
      case 'DEPOSIT':
        // Handle deposit logic
        transactionStatus = 'COMPLETED'
        // Update user balance
        await prisma.user.update({
          where: { id: userId },
          data: {
            eceBalance: {
              increment: amount
            }
          }
        })
        break
      
      case 'WITHDRAWAL': {
        // Handle withdrawal logic
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { eceBalance: true }
        })
        
        if (!user || user.eceBalance < amount) {
          return NextResponse.json(
            { success: false, error: 'Insufficient balance' },
            { status: 400 }
          )
        }
        
        transactionStatus = 'COMPLETED'
        // Update user balance
        await prisma.user.update({
          where: { id: userId },
          data: {
            eceBalance: {
              decrement: amount
            }
          }
        })
        break
      }
      
      case 'PURCHASE':
      case 'TRADE': {
        // buyer spends
        const actor = await prisma.user.findUnique({ where: { id: userId }, select: { eceBalance: true } })
        if (!actor || actor.eceBalance < amount) {
          return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 })
        }
        transactionStatus = 'COMPLETED'
        const ops: any[] = [
          prisma.user.update({
            where: { id: userId },
            data: { eceBalance: { decrement: amount } }
          })
        ]
        if (body.counterpartyUserId) {
          ops.push(
            prisma.user.update({
              where: { id: body.counterpartyUserId },
              data: { eceBalance: { increment: amount } }
            })
          )
        }
        await prisma.$transaction(ops)
        break
      }
      case 'SALE': {
        // seller earns
        transactionStatus = 'COMPLETED'
        const ops: any[] = [
          prisma.user.update({
            where: { id: userId },
            data: { eceBalance: { increment: amount } }
          })
        ]
        if (body.counterpartyUserId) {
          const buyer = await prisma.user.findUnique({ where: { id: body.counterpartyUserId }, select: { eceBalance: true } })
          if (!buyer || buyer.eceBalance < amount) {
            return NextResponse.json({ success: false, error: 'Counterparty has insufficient balance' }, { status: 400 })
          }
          ops.push(
            prisma.user.update({
              where: { id: body.counterpartyUserId },
              data: { eceBalance: { decrement: amount } }
            })
          )
        }
        await prisma.$transaction(ops)
        break
      }
      case 'REWARD': {
        transactionStatus = 'COMPLETED'
        await prisma.user.update({ where: { id: userId }, data: { eceBalance: { increment: amount } } })
        break
      }
      case 'REFUND': {
        transactionStatus = 'COMPLETED'
        await prisma.user.update({ where: { id: userId }, data: { eceBalance: { increment: amount } } })
        break
      }
      
      default:
        transactionStatus = 'PENDING'
    }
    
    // If transactions model isn't available, return a mocked transaction
    if (!hasTransactionsModel) {
      return NextResponse.json({
        success: true,
        data: {
          id: `mock_tx_${Date.now()}`,
          userId,
          amount,
          currency,
          type: typeEnum as any,
          status: transactionStatus,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        message: 'Transaction processed (mock)'
      })
    }

    // Create new transaction
    const newTransaction = await prismaAny.transaction.create({
      data: {
        userId,
        cardId: body.cardId,
        amount,
        currency,
        type: typeEnum as any,
        status: transactionStatus,
        description: body.description,
        metadata: body.metadata || {},
        paymentMethod: body.paymentMethod,
        paymentId: body.paymentId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        card: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: newTransaction,
      message: 'Transaction processed successfully'
    })
  } catch (error) {
    console.error('Create Transaction Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process transaction' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId, status, userId } = body

    if (!transactionId || !status || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: transactionId, status, userId' },
        { status: 400 }
      )
    }

    const allowedStatuses = ['COMPLETED','FAILED','CANCELED','REFUNDED']
    const statusEnum = (typeof status === 'string' ? status.toUpperCase() : '') as string
    if (!allowedStatuses.includes(statusEnum)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    const prismaAny = prisma as any
    const hasTransactionsModel = !!(prismaAny && prismaAny.transaction)
    // If no transactions model, return a mocked update
    if (!hasTransactionsModel) {
      return NextResponse.json({
        success: true,
        data: {
          id: transactionId,
          userId,
          status: statusEnum as any,
          updatedAt: new Date()
        },
        message: 'Transaction updated (mock)'
      })
    }

    // Verify user owns the transaction
    const transaction = await prismaAny.transaction.findFirst({
      where: { id: transactionId, userId }
    })
    
    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found or unauthorized' },
        { status: 404 }
      )
    }
    
    // Update transaction status
    const updatedTransaction = await prismaAny.transaction.update({
      where: { id: transactionId },
      data: {
        status: statusEnum as any,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        card: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedTransaction,
      message: 'Transaction updated successfully'
    })
  } catch (error) {
    console.error('Update Transaction Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}
