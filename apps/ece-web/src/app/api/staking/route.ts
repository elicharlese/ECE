import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID required'
      }, { status: 400 })
    }

    // Get all staking pools
    const pools = await prisma.stakingPool.findMany({
      where: { isActive: true },
      include: {
        stakes: {
          where: { 
            userId: userId,
            isActive: true 
          },
          include: {
            rewards: {
              where: { claimedAt: null }
            }
          }
        },
        _count: {
          select: {
            stakes: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: { apy: 'desc' }
    })

    // Get user's total staking positions
    const userPositions = await prisma.stakingPosition.findMany({
      where: {
        userId: userId,
        isActive: true
      },
      include: {
        pool: true,
        rewards: {
          where: { claimedAt: null }
        }
      }
    })

    // Calculate user's total staked and rewards
    const totalStaked = userPositions.reduce((sum: number, pos: any) => sum + pos.amount, 0)
    const totalRewards = userPositions.reduce((sum: number, pos: any) => 
      sum + pos.rewards.reduce((rewardSum: number, reward: any) => rewardSum + reward.amount, 0), 0
    )

    return NextResponse.json({
      success: true,
      data: {
        pools: pools.map((pool: any) => ({
          ...pool,
          userStaked: pool.stakes.reduce((sum: number, stake: any) => sum + stake.amount, 0),
          userRewards: pool.stakes.reduce((sum: number, stake: any) => 
            sum + stake.rewards.reduce((rewardSum: number, reward: any) => rewardSum + reward.amount, 0), 0
          ),
          totalStakers: pool._count.stakes
        })),
        userStats: {
          totalStaked,
          totalRewards,
          activePositions: userPositions.length
        }
      }
    })

  } catch (error) {
    console.error('Staking API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch staking data'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, userId, poolId, amount } = await request.json()

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID required'
      }, { status: 400 })
    }

    switch (action) {
      case 'stake': {
        if (!poolId || !amount || amount <= 0) {
          return NextResponse.json({
            success: false,
            error: 'Pool ID and positive amount required'
          }, { status: 400 })
        }

        // Get pool details
        const pool = await prisma.stakingPool.findUnique({
          where: { id: poolId }
        })

        if (!pool || !pool.isActive) {
          return NextResponse.json({
            success: false,
            error: 'Pool not found or inactive'
          }, { status: 404 })
        }

        if (amount < pool.minStakeAmount) {
          return NextResponse.json({
            success: false,
            error: `Minimum stake amount is ${pool.minStakeAmount} ECE`
          }, { status: 400 })
        }

        // Check user balance
        const user = await prisma.user.findUnique({
          where: { id: userId }
        })

        if (!user || user.eceBalance < amount) {
          return NextResponse.json({
            success: false,
            error: 'Insufficient ECE balance'
          }, { status: 400 })
        }

        // Calculate lockup end date
        const lockupEndsAt = pool.lockupPeriod > 0 
          ? new Date(Date.now() + pool.lockupPeriod * 24 * 60 * 60 * 1000)
          : null

        // Create staking position and update balances
        const [stakingPosition] = await prisma.$transaction([
          prisma.stakingPosition.create({
            data: {
              userId,
              poolId,
              amount,
              lockupEndsAt
            }
          }),
          prisma.user.update({
            where: { id: userId },
            data: {
              eceBalance: {
                decrement: amount
              }
            }
          }),
          prisma.stakingPool.update({
            where: { id: poolId },
            data: {
              totalStaked: {
                increment: amount
              }
            }
          }),
          prisma.transaction.create({
            data: {
              userId,
              type: 'STAKE',
              amount: -amount,
              eceAmount: amount,
              description: `Staked ${amount} ECE in ${pool.name}`,
              reference: poolId,
              status: 'COMPLETED'
            }
          })
        ])

        return NextResponse.json({
          success: true,
          data: stakingPosition
        })
      }

      case 'unstake': {
        if (!poolId || !amount || amount <= 0) {
          return NextResponse.json({
            success: false,
            error: 'Pool ID and positive amount required'
          }, { status: 400 })
        }

        // Find user's staking position
        const position = await prisma.stakingPosition.findFirst({
          where: {
            userId,
            poolId,
            isActive: true
          },
          include: {
            pool: true
          }
        })

        if (!position) {
          return NextResponse.json({
            success: false,
            error: 'No active staking position found'
          }, { status: 404 })
        }

        if (amount > position.amount) {
          return NextResponse.json({
            success: false,
            error: 'Cannot unstake more than staked amount'
          }, { status: 400 })
        }

        // Check lockup period
        if (position.lockupEndsAt && new Date() < position.lockupEndsAt) {
          return NextResponse.json({
            success: false,
            error: 'Tokens are still locked'
          }, { status: 400 })
        }

        // Update position and balances
        await prisma.$transaction([
          prisma.stakingPosition.update({
            where: { id: position.id },
            data: {
              amount: {
                decrement: amount
              },
              isActive: position.amount === amount ? false : true
            }
          }),
          prisma.user.update({
            where: { id: userId },
            data: {
              eceBalance: {
                increment: amount
              }
            }
          }),
          prisma.stakingPool.update({
            where: { id: poolId },
            data: {
              totalStaked: {
                decrement: amount
              }
            }
          }),
          prisma.transaction.create({
            data: {
              userId,
              type: 'UNSTAKE',
              amount: amount,
              eceAmount: amount,
              description: `Unstaked ${amount} ECE from ${position.pool.name}`,
              reference: poolId,
              status: 'COMPLETED'
            }
          })
        ])

        return NextResponse.json({
          success: true,
          message: `Successfully unstaked ${amount} ECE`
        })
      }

      case 'claim-rewards': {
        if (!poolId) {
          return NextResponse.json({
            success: false,
            error: 'Pool ID required'
          }, { status: 400 })
        }

        // Get unclaimed rewards
        const rewards = await prisma.stakingReward.findMany({
          where: {
            userId,
            poolId,
            claimedAt: null
          }
        })

        if (rewards.length === 0) {
          return NextResponse.json({
            success: false,
            error: 'No rewards to claim'
          }, { status: 400 })
        }

        const totalRewards = rewards.reduce((sum: number, reward: any) => sum + reward.amount, 0)

        // Claim rewards and update balance
        await prisma.$transaction([
          prisma.stakingReward.updateMany({
            where: {
              userId,
              poolId,
              claimedAt: null
            },
            data: {
              claimedAt: new Date()
            }
          }),
          prisma.user.update({
            where: { id: userId },
            data: {
              eceBalance: {
                increment: totalRewards
              }
            }
          }),
          prisma.transaction.create({
            data: {
              userId,
              type: 'REWARD_CLAIM',
              amount: totalRewards,
              eceAmount: totalRewards,
              description: `Claimed ${totalRewards} ECE staking rewards`,
              reference: poolId,
              status: 'COMPLETED'
            }
          })
        ])

        return NextResponse.json({
          success: true,
          data: {
            rewardsClaimed: totalRewards,
            rewardsCount: rewards.length
          }
        })
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Staking action error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process staking action'
    }, { status: 500 })
  }
}
