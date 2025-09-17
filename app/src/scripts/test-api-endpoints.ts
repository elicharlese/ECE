#!/usr/bin/env tsx
/**
 * API Endpoint Test Script
 * Tests all API endpoints with real database integration
 * Run with: npx tsx src/scripts/test-api-endpoints.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface TestResult {
  endpoint: string
  method: string
  status: 'PASS' | 'FAIL'
  message?: string
  responseTime?: number
}

const results: TestResult[] = []

// Test utilities
async function makeRequest(
  path: string,
  options: RequestInit = {}
): Promise<{ response: Response; responseTime: number }> {
  const url = `${API_BASE_URL}${path}`
  const startTime = Date.now()
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
    
    const responseTime = Date.now() - startTime
    
    return { response, responseTime }
  } catch (error) {
    throw new Error(`Request failed: ${error}`)
  }
}

async function logResult(
  endpoint: string,
  method: string,
  status: 'PASS' | 'FAIL',
  message?: string,
  responseTime?: number
) {
  results.push({ endpoint, method, status, message, responseTime })
  const emoji = status === 'PASS' ? '✅' : '❌'
  const time = responseTime ? ` (${responseTime}ms)` : ''
  console.log(`${emoji} ${method} ${endpoint}${time} - ${message || status}`)
}

// Test data
let testUserId: string
let testToken: string
let testCardId: string
let testOrderId: string
let testTransactionId: string

async function setupTestData() {
  console.log('\n🔧 Setting up test data...\n')
  
  // Create test user
  const hashedPassword = await bcrypt.hash('testpassword123', 10)
  const uniqueSuffix = Date.now()
  const testUser = await prisma.user.create({
    data: {
      email: `test-${uniqueSuffix}@example.com`,
      username: `testuser_${uniqueSuffix}`,
      passwordHash: hashedPassword,
      eceBalance: 10000
    }
  })
  testUserId = testUser.id
  
  // Create test card
  const testCard = await prisma.card.create({
    data: {
      name: 'Test Card',
      description: 'A test trading card',
      imageUrl: 'https://example.com/card.jpg',
      rarity: 'RARE',
      category: 'TECHNOLOGY',
      currentPrice: 100,
      ownerId: testUserId
    }
  })
  testCardId = testCard.id
  
  console.log('✅ Test data created')
}

async function cleanupTestData() {
  console.log('\n🧹 Cleaning up test data...\n')
  
  try {
    // Delete in order of dependencies
    await prisma.orderCommunication.deleteMany({ where: { userId: testUserId } })
    await prisma.orderRevision.deleteMany({ where: { userId: testUserId } })
    await prisma.appOrder.deleteMany({ where: { userId: testUserId } })
    await prisma.transaction.deleteMany({ where: { userId: testUserId } })
    await prisma.card.deleteMany({ where: { ownerId: testUserId } })
    await prisma.user.delete({ where: { id: testUserId } })
    
    console.log('✅ Test data cleaned up')
  } catch (error) {
    console.error('⚠️  Cleanup error:', error)
  }
}

// Test suites
async function testAuthEndpoints() {
  console.log('\n🔐 Testing Authentication Endpoints...\n')
  
  // Test registration
  const { response: registerResponse, responseTime: registerTime } = await makeRequest('/api/auth', {
    method: 'POST',
    body: JSON.stringify({
      action: 'register',
      email: `newuser-${Date.now()}@example.com`,
      username: `newuser_${Date.now()}`,
      password: 'password123'
    })
  })
  
  if (registerResponse.ok) {
    const data = await registerResponse.json()
    await logResult('/api/auth', 'POST (register)', 'PASS', 'User registered', registerTime)
    
    // Clean up the registered user
    if (data.data?.user?.id) {
      await prisma.user.delete({ where: { id: data.data.user.id } })
    }
  } else {
    await logResult('/api/auth', 'POST (register)', 'FAIL', `Status: ${registerResponse.status}`)
  }
  
  // Test login
  const { response: loginResponse, responseTime: loginTime } = await makeRequest('/api/auth', {
    method: 'POST',
    body: JSON.stringify({
      action: 'login',
      email: (await prisma.user.findUnique({ where: { id: testUserId } }))?.email,
      password: 'testpassword123'
    })
  })
  
  if (loginResponse.ok) {
    const data = await loginResponse.json()
    testToken = data.data?.token
    await logResult('/api/auth', 'POST (login)', 'PASS', 'Login successful', loginTime)
  } else {
    await logResult('/api/auth', 'POST (login)', 'FAIL', `Status: ${loginResponse.status}`)
  }
}

async function testCardsEndpoints() {
  console.log('\n🎴 Testing Cards Endpoints...\n')
  
  // Test get cards
  const { response: getCardsResponse, responseTime: getCardsTime } = await makeRequest('/api/cards?limit=10', {
    headers: {
      'Authorization': `Bearer ${testToken}`,
      'x-user-id': testUserId
    }
  })
  
  if (getCardsResponse.ok) {
    await logResult('/api/cards', 'GET', 'PASS', 'Cards retrieved', getCardsTime)
  } else {
    await logResult('/api/cards', 'GET', 'FAIL', `Status: ${getCardsResponse.status}`)
  }
  
  // Test create card
  const { response: createCardResponse, responseTime: createCardTime } = await makeRequest('/api/cards', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${testToken}`,
      'x-user-id': testUserId
    },
    body: JSON.stringify({
      ownerId: testUserId,
      name: 'New Test Card',
      description: 'Created via API test',
      imageUrl: 'https://example.com/new-card.jpg',
      rarity: 'COMMON',
      category: 'TECHNOLOGY',
      currentPrice: 50
    })
  })
  
  if (createCardResponse.ok) {
    await logResult('/api/cards', 'POST', 'PASS', 'Card created', createCardTime)
  } else {
    await logResult('/api/cards', 'POST', 'FAIL', `Status: ${createCardResponse.status}`)
  }
}

async function testWalletEndpoints() {
  console.log('\n💰 Testing Wallet Endpoints...\n')
  
  // Test get wallet
  const { response: getWalletResponse, responseTime: getWalletTime } = await makeRequest(`/api/wallet?userId=${testUserId}`, {
    headers: {
      'Authorization': `Bearer ${testToken}`,
      'x-user-id': testUserId
    }
  })
  
  if (getWalletResponse.ok) {
    await logResult('/api/wallet', 'GET', 'PASS', 'Wallet retrieved', getWalletTime)
  } else {
    await logResult('/api/wallet', 'GET', 'FAIL', `Status: ${getWalletResponse.status}`)
  }
  
  // Test create transaction
  const { response: createTransactionResponse, responseTime: createTxTime } = await makeRequest('/api/wallet', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${testToken}`,
      'x-user-id': testUserId
    },
    body: JSON.stringify({
      userId: testUserId,
      type: 'DEPOSIT',
      amount: 500,
      currency: 'ECE',
      description: 'Test deposit'
    })
  })
  
  if (createTransactionResponse.ok) {
    const data = await createTransactionResponse.json()
    testTransactionId = data.data?.id
    await logResult('/api/wallet', 'POST', 'PASS', 'Transaction created', createTxTime)
  } else {
    await logResult('/api/wallet', 'POST', 'FAIL', `Status: ${createTransactionResponse.status}`)
  }
}

async function testOrdersEndpoints() {
  console.log('\n📦 Testing Orders Endpoints...\n')
  
  // Test get orders
  const { response: getOrdersResponse, responseTime: getOrdersTime } = await makeRequest(`/api/orders?userId=${testUserId}`, {
    headers: {
      'Authorization': `Bearer ${testToken}`,
      'x-user-id': testUserId
    }
  })
  
  if (getOrdersResponse.ok) {
    await logResult('/api/orders', 'GET', 'PASS', 'Orders retrieved', getOrdersTime)
  } else {
    await logResult('/api/orders', 'GET', 'FAIL', `Status: ${getOrdersResponse.status}`)
  }
  
  // Test create order
  const { response: createOrderResponse, responseTime: createOrderTime } = await makeRequest('/api/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${testToken}`,
      'x-user-id': testUserId
    },
    body: JSON.stringify({
      userId: testUserId,
      projectType: 'MOBILE_APP',
      title: 'Test Order',
      description: 'A test app order',
      requirements: { platform: 'iOS', features: ['login', 'dashboard'] },
      timeline: 'STANDARD_1_MONTH'
    })
  })
  
  if (createOrderResponse.ok) {
    const data = await createOrderResponse.json()
    testOrderId = data.data?.id
    await logResult('/api/orders', 'POST', 'PASS', 'Order created', createOrderTime)
  } else {
    await logResult('/api/orders', 'POST', 'FAIL', `Status: ${createOrderResponse.status}`)
  }
  
  // Test cancel order
  if (testOrderId) {
    const { response: cancelOrderResponse, responseTime: cancelOrderTime } = await makeRequest(`/api/orders/${testOrderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'x-user-id': testUserId
      },
      body: JSON.stringify({
        action: 'cancel',
        userId: testUserId
      })
    })
    
    if (cancelOrderResponse.ok) {
      await logResult('/api/orders', 'PUT (cancel)', 'PASS', 'Order cancelled', cancelOrderTime)
    } else {
      await logResult('/api/orders', 'PUT (cancel)', 'FAIL', `Status: ${cancelOrderResponse.status}`)
    }
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting API Endpoint Tests')
  console.log('================================\n')
  
  try {
    await setupTestData()
    await testAuthEndpoints()
    await testCardsEndpoints()
    await testWalletEndpoints()
    await testOrdersEndpoints()
    
    // Summary
    console.log('\n================================')
    console.log('📊 Test Summary\n')
    
    const passed = results.filter(r => r.status === 'PASS').length
    const failed = results.filter(r => r.status === 'FAIL').length
    const avgResponseTime = results
      .filter(r => r.responseTime)
      .reduce((acc, r) => acc + (r.responseTime || 0), 0) / results.filter(r => r.responseTime).length
    
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`⏱️  Avg Response Time: ${avgResponseTime.toFixed(2)}ms`)
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`)
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:')
      results
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`  - ${r.method} ${r.endpoint}: ${r.message}`))
    }
    
  } catch (error) {
    console.error('\n❌ Test execution failed:', error)
  } finally {
    await cleanupTestData()
    await prisma.$disconnect()
  }
}

// Run tests
runTests().catch(console.error)
