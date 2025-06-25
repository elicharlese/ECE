// Wallet API - Handles ECE balance, transactions, and payment processing
import { NextRequest, NextResponse } from 'next/server'
import { mockDatabase } from '@/lib/db'
import { Transaction } from '@/lib/db/schema'

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
    const user = mockDatabase.users.get(userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get transactions (mock implementation)
    const transactions: Transaction[] = []

    const walletData = {
      balance: user.eceBalance,
      currency: 'ECE',
      transactions,
      totalTransactions: transactions.length
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

    if (!['trade', 'purchase', 'bid', 'bet', 'battle', 'boost', 'deposit', 'withdrawal'].includes(type)) {
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

    // Create new transaction
    const newTransaction: Partial<Transaction> = {
      id: `txn_${Date.now()}`,
      fromUserId: body.fromUserId,
      toUserId: body.toUserId || userId,
      cardId: body.cardId,
      amount,
      currency,
      type,
      status: 'pending',
      reference: body.reference,
      metadata: body.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Process transaction based on type
    switch (type) {
      case 'deposit':
        // Handle deposit logic
        newTransaction.status = 'completed'
        break
      
      case 'withdrawal':
        // Handle withdrawal logic
        const user = mockDatabase.users.get(userId)
        if (!user || user.eceBalance < amount) {
          return NextResponse.json(
            { success: false, error: 'Insufficient balance' },
            { status: 400 }
          )
        }
        newTransaction.status = 'completed'
        break
      
      case 'trade':
      case 'purchase':
        // Handle trade/purchase logic
        newTransaction.status = 'completed'
        break
      
      default:
        newTransaction.status = 'pending'
    }

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

    if (!['completed', 'failed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update transaction status (mock implementation)
    const updatedTransaction = {
      id: transactionId,
      status,
      updatedAt: new Date()
    }

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
