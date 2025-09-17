import { NextRequest, NextResponse } from 'next/server'

// Mock ECE token data
const mockTokenData = new Map<string, {
  userId: string
  walletAddress?: string
  balance: {
    sol: number
    ece: number
  }
  rewards: {
    pending: number
    lifetime: number
    nextMilestone: number
  }
  transactions: Array<{
    id: string
    type: 'REWARD' | 'BOOST' | 'REFERRAL' | 'ORDER_COMPLETE' | 'PURCHASE' | 'TRANSFER'
    amount: number
    description: string
    timestamp: Date
    signature?: string
    status: 'pending' | 'completed' | 'failed'
  }>
  referrals: {
    code: string
    used: number
    earnings: number
  }
}>()

// Initialize some mock data
const initializeMockData = () => {
  mockTokenData.set('user_123', {
    userId: 'user_123',
    walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    balance: {
      sol: 2.45,
      ece: 1250.75
    },
    rewards: {
      pending: 125,
      lifetime: 3580,
      nextMilestone: 5000
    },
    transactions: [
      {
        id: 'tx_1',
        type: 'ORDER_COMPLETE',
        amount: 500,
        description: 'Order completion bonus',
        timestamp: new Date(Date.now() - 86400000),
        signature: '5VfYt...xT2p',
        status: 'completed'
      },
      {
        id: 'tx_2',
        type: 'REFERRAL',
        amount: 250,
        description: 'Referral reward from @techdev',
        timestamp: new Date(Date.now() - 172800000),
        signature: '3Hj9s...mN4k',
        status: 'completed'
      }
    ],
    referrals: {
      code: 'ECE_USER123',
      used: 3,
      earnings: 750
    }
  })
}

initializeMockData()

// GET /api/solana/wallet/[userId] - Get wallet info and ECE balance
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params
    const { userId } = params
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    let userData = mockTokenData.get(userId)
    
    // Initialize user data if not exists
    if (!userData) {
      userData = {
        userId,
        balance: { sol: 0, ece: 0 },
        rewards: { pending: 0, lifetime: 0, nextMilestone: 1000 },
        transactions: [],
        referrals: {
          code: `ECE_${userId.toUpperCase()}`,
          used: 0,
          earnings: 0
        }
      }
      mockTokenData.set(userId, userData)
    }

    return NextResponse.json({
      success: true,
      data: userData
    })
  } catch (error) {
    console.error('Get Wallet Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet data' },
      { status: 500 }
    )
  }
}

// POST /api/solana/wallet/[userId] - Connect wallet or perform transaction
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params
    const { userId } = params
    const body = await request.json()
    
    const { action, walletAddress, amount, type, description } = body
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const userData = mockTokenData.get(userId)
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'connect':
        if (!walletAddress) {
          return NextResponse.json(
            { success: false, error: 'Wallet address is required' },
            { status: 400 }
          )
        }
        
        userData.walletAddress = walletAddress
        
        // Mock getting SOL balance from blockchain
        userData.balance.sol = Math.random() * 5 + 0.5 // Random between 0.5-5.5 SOL
        
        mockTokenData.set(userId, userData)
        
        return NextResponse.json({
          success: true,
          data: userData,
          message: 'Wallet connected successfully'
        })

      case 'transaction':
        if (!amount || !type || !description) {
          return NextResponse.json(
            { success: false, error: 'Missing required fields: amount, type, description' },
            { status: 400 }
          )
        }

        // Create new transaction
        const newTransaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type,
          amount,
          description,
          timestamp: new Date(),
          signature: `${Math.random().toString(36).substr(2, 5)}...${Math.random().toString(36).substr(2, 4)}`,
          status: 'pending' as 'pending' | 'completed'
        }

        userData.transactions.unshift(newTransaction)

        // Process transaction based on type
        switch (type) {
          case 'REWARD':
          case 'REFERRAL':
          case 'ORDER_COMPLETE':
            userData.rewards.pending += amount
            userData.rewards.lifetime += amount
            break
          
          case 'BOOST':
          case 'PURCHASE':
            if (userData.balance.ece < Math.abs(amount)) {
              return NextResponse.json(
                { success: false, error: 'Insufficient ECE balance' },
                { status: 400 }
              )
            }
            userData.balance.ece -= Math.abs(amount)
            break
          
          case 'TRANSFER':
            if (amount > 0) {
              userData.balance.ece += amount
            } else {
              if (userData.balance.ece < Math.abs(amount)) {
                return NextResponse.json(
                  { success: false, error: 'Insufficient ECE balance' },
                  { status: 400 }
                )
              }
              userData.balance.ece -= Math.abs(amount)
            }
            break
        }

        // Mark transaction as completed
        newTransaction.status = 'completed'
        
        mockTokenData.set(userId, userData)

        return NextResponse.json({
          success: true,
          data: {
            transaction: newTransaction,
            updatedBalance: userData.balance,
            updatedRewards: userData.rewards
          },
          message: 'Transaction processed successfully'
        })

      case 'claim_rewards':
        if (userData.rewards.pending === 0) {
          return NextResponse.json(
            { success: false, error: 'No pending rewards to claim' },
            { status: 400 }
          )
        }

        const claimedAmount = userData.rewards.pending
        userData.balance.ece += claimedAmount
        userData.rewards.pending = 0

        // Add claim transaction
        const claimTransaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'REWARD' as const,
          amount: claimedAmount,
          description: 'Claimed pending rewards',
          timestamp: new Date(),
          signature: `${Math.random().toString(36).substr(2, 5)}...${Math.random().toString(36).substr(2, 4)}`,
          status: 'completed' as const
        }

        userData.transactions.unshift(claimTransaction)
        mockTokenData.set(userId, userData)

        return NextResponse.json({
          success: true,
          data: {
            claimedAmount,
            updatedBalance: userData.balance,
            updatedRewards: userData.rewards
          },
          message: `Successfully claimed ${claimedAmount} ECE tokens`
        })

      case 'disconnect':
        userData.walletAddress = undefined
        mockTokenData.set(userId, userData)

        return NextResponse.json({
          success: true,
          message: 'Wallet disconnected successfully'
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Wallet Action Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process wallet action' },
      { status: 500 }
    )
  }
}

// PUT /api/solana/wallet/[userId] - Update wallet settings
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params
    const { userId } = params
    const body = await request.json()
    
    const { referralCode, preferences } = body
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const userData = mockTokenData.get(userId)
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Update referral code if provided
    if (referralCode) {
      userData.referrals.code = referralCode
    }

    // Update preferences if provided
    if (preferences) {
      // Add preference handling here
    }

    mockTokenData.set(userId, userData)

    return NextResponse.json({
      success: true,
      data: userData,
      message: 'Wallet settings updated successfully'
    })
  } catch (error) {
    console.error('Update Wallet Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update wallet settings' },
      { status: 500 }
    )
  }
}
