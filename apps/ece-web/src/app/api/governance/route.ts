import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status') || 'ACTIVE'
    
    // Get governance proposals
    const proposals = await prisma.governanceProposal.findMany({
      where: status !== 'ALL' ? { status: status as any } : {},
      include: {
        proposer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        },
        votes: userId ? {
          where: { userId }
        } : false,
        _count: {
          select: {
            votes: true
          }
        }
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Get total voting power (total staked ECE)
    const totalVotingPower = await prisma.stakingPosition.aggregate({
      where: { isActive: true },
      _sum: { amount: true }
    })

    // Get user's voting power if requested
    let userVotingPower = 0
    if (userId) {
      const userStaking = await prisma.stakingPosition.aggregate({
        where: {
          userId,
          isActive: true
        },
        _sum: { amount: true }
      })
      userVotingPower = userStaking._sum.amount || 0
    }

    return NextResponse.json({
      success: true,
      data: {
        proposals: proposals.map((proposal: any) => ({
          ...proposal,
          userVote: proposal.votes?.[0] || null,
          totalVoters: proposal._count.votes,
          proposerName: proposal.proposer.username || 
            `${proposal.proposer.firstName} ${proposal.proposer.lastName}`.trim() ||
            'Anonymous'
        })),
        stats: {
          totalVotingPower: totalVotingPower._sum.amount || 0,
          userVotingPower
        }
      }
    })

  } catch (error) {
    console.error('Governance fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch governance data'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, userId, proposalId, voteChoice, proposalData } = await request.json()

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID required'
      }, { status: 400 })
    }

    switch (action) {
      case 'vote': {
        if (!proposalId || !voteChoice) {
          return NextResponse.json({
            success: false,
            error: 'Proposal ID and vote choice required'
          }, { status: 400 })
        }

        // Check if proposal exists and is active
        const proposal = await prisma.governanceProposal.findUnique({
          where: { id: proposalId }
        })

        if (!proposal) {
          return NextResponse.json({
            success: false,
            error: 'Proposal not found'
          }, { status: 404 })
        }

        if (proposal.status !== 'ACTIVE') {
          return NextResponse.json({
            success: false,
            error: 'Proposal is not active for voting'
          }, { status: 400 })
        }

        if (new Date() > proposal.votingEndsAt) {
          return NextResponse.json({
            success: false,
            error: 'Voting period has ended'
          }, { status: 400 })
        }

        // Get user's voting power (staked ECE)
        const userStaking = await prisma.stakingPosition.aggregate({
          where: {
            userId,
            isActive: true
          },
          _sum: { amount: true }
        })

        const votingPower = userStaking._sum.amount || 0

        if (votingPower === 0) {
          return NextResponse.json({
            success: false,
            error: 'You need to stake ECE to participate in governance'
          }, { status: 400 })
        }

        // Check if user already voted
        const existingVote = await prisma.governanceVote.findUnique({
          where: {
            proposalId_userId: {
              proposalId,
              userId
            }
          }
        })

        if (existingVote) {
          return NextResponse.json({
            success: false,
            error: 'You have already voted on this proposal'
          }, { status: 400 })
        }

        // Create vote and update proposal counts
        await prisma.$transaction(async (tx: any) => {
          // Create the vote
          await tx.governanceVote.create({
            data: {
              proposalId,
              userId,
              voteChoice: voteChoice as any,
              votingPower
            }
          })

          // Update proposal vote counts
          const updateData: any = {
            totalVotes: { increment: votingPower }
          }

          switch (voteChoice) {
            case 'YES':
              updateData.yesVotes = { increment: votingPower }
              break
            case 'NO':
              updateData.noVotes = { increment: votingPower }
              break
            case 'ABSTAIN':
              updateData.abstainVotes = { increment: votingPower }
              break
          }

          await tx.governanceProposal.update({
            where: { id: proposalId },
            data: updateData
          })

          // Create transaction record
          await tx.transaction.create({
            data: {
              userId,
              type: 'GOVERNANCE_VOTE',
              amount: 0,
              eceAmount: votingPower,
              description: `Voted ${voteChoice} on proposal: ${proposal.title}`,
              reference: proposalId,
              status: 'COMPLETED'
            }
          })
        })

        return NextResponse.json({
          success: true,
          message: `Vote submitted successfully with ${votingPower} ECE voting power`
        })
      }

      case 'create-proposal': {
        if (!proposalData) {
          return NextResponse.json({
            success: false,
            error: 'Proposal data required'
          }, { status: 400 })
        }

        const { title, description, proposalType, votingDuration = 7 } = proposalData

        if (!title || !description || !proposalType) {
          return NextResponse.json({
            success: false,
            error: 'Title, description, and proposal type required'
          }, { status: 400 })
        }

        // Check if user has enough voting power to create proposals
        const userStaking = await prisma.stakingPosition.aggregate({
          where: {
            userId,
            isActive: true
          },
          _sum: { amount: true }
        })

        const votingPower = userStaking._sum.amount || 0
        const minProposalPower = 1000 // Minimum 1000 ECE staked to create proposals

        if (votingPower < minProposalPower) {
          return NextResponse.json({
            success: false,
            error: `You need at least ${minProposalPower} ECE staked to create proposals`
          }, { status: 400 })
        }

        const votingStartsAt = new Date()
        const votingEndsAt = new Date(Date.now() + votingDuration * 24 * 60 * 60 * 1000)

        const proposal = await prisma.governanceProposal.create({
          data: {
            title,
            description,
            proposalType: proposalType as any,
            proposerId: userId,
            votingStartsAt,
            votingEndsAt,
            minQuorum: proposalType === 'SECURITY_UPDATE' ? 0.20 : 0.15,
            minApproval: proposalType === 'SECURITY_UPDATE' ? 0.75 : 0.51
          }
        })

        // Create transaction record
        await prisma.transaction.create({
          data: {
            userId,
            type: 'PROPOSAL_CREATED',
            amount: 0,
            eceAmount: 0,
            description: `Created proposal: ${title}`,
            reference: proposal.id,
            status: 'COMPLETED'
          }
        })

        return NextResponse.json({
          success: true,
          data: proposal
        })
      }

      case 'delegate-voting-power': {
        // Future feature for delegated voting
        return NextResponse.json({
          success: false,
          error: 'Delegation feature not yet implemented'
        }, { status: 501 })
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Governance action error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process governance action'
    }, { status: 500 })
  }
}

// Background job to update proposal status
export async function PUT(request: NextRequest) {
  try {
    // This would typically be called by a cron job
    const now = new Date()
    
    // Find expired proposals that haven't been processed
    const expiredProposals = await prisma.governanceProposal.findMany({
      where: {
        status: 'ACTIVE',
        votingEndsAt: {
          lt: now
        }
      }
    })

    // Get total voting power for quorum calculations
    const totalVotingPower = await prisma.stakingPosition.aggregate({
      where: { isActive: true },
      _sum: { amount: true }
    })

    const totalPower = totalVotingPower._sum.amount || 1

    for (const proposal of expiredProposals) {
      const quorumReached = proposal.totalVotes / totalPower >= proposal.minQuorum
      const approvalRate = proposal.totalVotes > 0 ? proposal.yesVotes / proposal.totalVotes : 0
      const approvalReached = approvalRate >= proposal.minApproval

      let newStatus: 'PASSED' | 'REJECTED' | 'EXPIRED' = 'EXPIRED'

      if (quorumReached) {
        newStatus = approvalReached ? 'PASSED' : 'REJECTED'
      }

      await prisma.governanceProposal.update({
        where: { id: proposal.id },
        data: { status: newStatus }
      })
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${expiredProposals.length} proposals`
    })

  } catch (error) {
    console.error('Proposal update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update proposals'
    }, { status: 500 })
  }
}
