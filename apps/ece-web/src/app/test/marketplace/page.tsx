'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Database,
  Zap,
  TrendingUp,
  Users,
  ShoppingCart,
  Swords
} from 'lucide-react'

interface TestResult {
  id: string
  name: string
  status: 'pending' | 'running' | 'success' | 'error'
  message?: string
  duration?: number
  data?: any
}

const marketplaceTests = [
  {
    id: 'seed-data',
    name: 'Seed Marketplace Data',
    description: 'Populate database with sample companies, cards, and markets',
    icon: Database,
    endpoint: '/api/admin/marketplace',
    method: 'POST',
    payload: { action: 'seed-marketplace' }
  },
  {
    id: 'automation-markets',
    name: 'Create Daily Markets',
    description: 'Test automated betting market creation',
    icon: Zap,
    endpoint: '/api/marketplace/automation',
    method: 'GET',
    payload: null,
    params: '?action=create-markets'
  },
  {
    id: 'settle-markets',
    name: 'Settle Expired Markets',
    description: 'Test market settlement and payout processing',
    icon: CheckCircle,
    endpoint: '/api/marketplace/automation',
    method: 'GET',
    payload: null,
    params: '?action=settle-markets'
  },
  {
    id: 'close-auctions',
    name: 'Close Ended Auctions',
    description: 'Test auction finalization and card transfers',
    icon: ShoppingCart,
    endpoint: '/api/marketplace/automation',
    method: 'GET',
    payload: null,
    params: '?action=close-auctions'
  },
  {
    id: 'resolve-battles',
    name: 'Resolve M&A Battles',
    description: 'Test battle completion and reward distribution',
    icon: Swords,
    endpoint: '/api/marketplace/automation',
    method: 'GET',
    payload: null,
    params: '?action=resolve-battles'
  },
  {
    id: 'marketplace-stats',
    name: 'Get Marketplace Stats',
    description: 'Verify marketplace analytics and metrics',
    icon: TrendingUp,
    endpoint: '/api/admin/marketplace',
    method: 'GET',
    payload: null,
    params: '?action=marketplace-stats'
  }
]

export default function MarketplaceTestPage() {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({})
  const [runningAll, setRunningAll] = useState(false)

  const runTest = async (test: any) => {
    const testId = test.id
    
    setTestResults(prev => ({
      ...prev,
      [testId]: { id: testId, name: test.name, status: 'running' }
    }))

    const startTime = Date.now()

    try {
      const url = test.endpoint + (test.params || '')
      const options: RequestInit = {
        method: test.method,
        headers: test.payload ? { 'Content-Type': 'application/json' } : undefined,
        body: test.payload ? JSON.stringify(test.payload) : undefined
      }

      const response = await fetch(url, options)
      const data = await response.json()
      const duration = Date.now() - startTime

      setTestResults(prev => ({
        ...prev,
        [testId]: {
          id: testId,
          name: test.name,
          status: data.success ? 'success' : 'error',
          message: data.success ? 
            (data.message || 'Test completed successfully') : 
            (data.error || 'Test failed'),
          duration,
          data: data.data
        }
      }))

    } catch (error) {
      const duration = Date.now() - startTime
      
      setTestResults(prev => ({
        ...prev,
        [testId]: {
          id: testId,
          name: test.name,
          status: 'error',
          message: `Network error: ${error}`,
          duration
        }
      }))
    }
  }

  const runAllTests = async () => {
    setRunningAll(true)
    
    // Run tests sequentially for better stability
    for (const test of marketplaceTests) {
      await runTest(test)
      // Add small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setRunningAll(false)
  }

  const clearResults = () => {
    setTestResults({})
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-[#A6E22E]" />
      case 'error':
        return <XCircle className="h-5 w-5 text-[#F92672]" />
      case 'running':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="h-5 w-5 text-[#66D9EF]" />
          </motion.div>
        )
      default:
        return <TestTube className="h-5 w-5 text-[#75715E]" />
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30'
      case 'error': return 'text-[#F92672] bg-[#F92672]/20 border-[#F92672]/30'
      case 'running': return 'text-[#66D9EF] bg-[#66D9EF]/20 border-[#66D9EF]/30'
      default: return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
    }
  }

  const completedTests = Object.values(testResults).filter(r => r.status === 'success' || r.status === 'error').length
  const successfulTests = Object.values(testResults).filter(r => r.status === 'success').length
  const averageDuration = Object.values(testResults)
    .filter(r => r.duration)
    .reduce((acc, r) => acc + (r.duration || 0), 0) / 
    Object.values(testResults).filter(r => r.duration).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#272822] to-[#1a1a15] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F92672] to-[#66D9EF] bg-clip-text text-transparent mb-4">
            Marketplace Testing Suite
          </h1>
          <p className="text-lg text-[#75715E] mb-6">
            Comprehensive testing for all marketplace functionality
          </p>

          {/* Test Summary */}
          {Object.keys(testResults).length > 0 && (
            <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F8EFD6]">{completedTests}</div>
                  <div className="text-sm text-[#75715E]">Tests Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#A6E22E]">{successfulTests}</div>
                  <div className="text-sm text-[#75715E]">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F92672]">{completedTests - successfulTests}</div>
                  <div className="text-sm text-[#75715E]">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#66D9EF]">
                    {averageDuration ? `${Math.round(averageDuration)}ms` : '-'}
                  </div>
                  <div className="text-sm text-[#75715E]">Avg Duration</div>
                </div>
              </div>
            </Card>
          )}

          {/* Control Buttons */}
          <div className="flex gap-4 mb-8">
            <Button
              onClick={runAllTests}
              disabled={runningAll}
              className="bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] hover:from-[#A6E22E]/80 hover:to-[#3EBA7C]/80 text-[#272822] font-semibold"
            >
              {runningAll ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Clock className="h-4 w-4" />
                </motion.div>
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              Run All Tests
            </Button>
            
            <Button
              onClick={clearResults}
              variant="outline"
              className="border-[#75715E]/30 text-[#75715E] hover:bg-[#75715E]/10"
            >
              Clear Results
            </Button>
          </div>
        </motion.div>

        {/* Test Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {marketplaceTests.map((test, index) => {
            const result = testResults[test.id]
            
            return (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30 hover:border-[#66D9EF]/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#66D9EF]/20 rounded-lg">
                        <test.icon className="h-5 w-5 text-[#66D9EF]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#F8EFD6]">{test.name}</h3>
                        <p className="text-sm text-[#75715E]">{test.description}</p>
                      </div>
                    </div>
                    
                    {result && (
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Test Details */}
                  <div className="text-xs text-[#75715E] mb-4">
                    <div>Method: {test.method}</div>
                    <div>Endpoint: {test.endpoint}{test.params || ''}</div>
                  </div>

                  {/* Result Details */}
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-4 p-3 bg-[#272822]/50 rounded-lg border border-[#75715E]/20"
                    >
                      <div className="text-sm">
                        <div className="text-[#F8EFD6] font-medium mb-1">Result:</div>
                        <div className={result.status === 'success' ? 'text-[#A6E22E]' : 'text-[#F92672]'}>
                          {result.message}
                        </div>
                        {result.duration && (
                          <div className="text-[#75715E] text-xs mt-1">
                            Duration: {result.duration}ms
                          </div>
                        )}
                        {result.data && (
                          <div className="text-[#66D9EF] text-xs mt-2">
                            Data: {JSON.stringify(result.data, null, 2)}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Run Button */}
                  <Button
                    onClick={() => runTest(test)}
                    disabled={result?.status === 'running' || runningAll}
                    className="w-full bg-gradient-to-r from-[#66D9EF] to-[#819AFF] hover:from-[#66D9EF]/80 hover:to-[#819AFF]/80 text-[#272822] font-semibold"
                  >
                    {result?.status === 'running' ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Clock className="h-4 w-4" />
                        </motion.div>
                        Running...
                      </>
                    ) : (
                      <>
                        <TestTube className="h-4 w-4 mr-2" />
                        Run Test
                      </>
                    )}
                  </Button>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
