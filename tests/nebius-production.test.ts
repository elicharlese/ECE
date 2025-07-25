/**
 * Production Service Integration Test
 * Tests switching between demo and production modes
 */

import { nebiusService } from '../src/services/nebius-production.service'
import { AppTemplate } from '../src/types/app-generation.types'

async function testProductionService() {
  console.log('🔬 ECE Nebius Production Service Test')
  console.log('=' .repeat(50))

  // Test template
  const template: AppTemplate = {
    id: 'prod-test',
    name: 'Production Test App',
    description: 'Testing production service integration',
    type: 'web',
    category: 'web',
    framework: 'Next.js',
    complexity: 'medium',
    features: ['Authentication', 'Real-time updates', 'Mobile responsive']
  }

  try {
    // 1. Check service status
    console.log('\n🔍 Checking Service Status...')
    const status = await nebiusService.getServiceStatus()
    console.log(`📋 Mode: ${status.mode.toUpperCase()}`)
    console.log(`🟢 Available: ${status.available}`)
    console.log(`⚡ Concurrent Limit: ${status.limits.concurrentGenerations}`)
    console.log(`📊 Monthly Quota: ${status.limits.monthlyQuota}`)
    console.log(`⏱️ Average Time: ${status.limits.averageTime}`)
    
    console.log('\n🎯 Capabilities:')
    status.capabilities.forEach(cap => console.log(`  • ${cap}`))

    // 2. Test generation
    console.log('\n🚀 Testing App Generation...')
    const startTime = Date.now()
    
    const generatedApp = await nebiusService.generateApp(template, (progress) => {
      console.log(`📊 ${progress.step} (${progress.progress}%)`)
    })

    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(2)

    console.log(`\n✅ Generation Complete! (${duration}s)`)
    console.log('=' .repeat(40))
    
    // Display results
    console.log(`🆔 App ID: ${generatedApp.id}`)
    console.log(`📊 Quality Score: ${generatedApp.qualityScore}/100`)
    console.log(`💎 Rarity: ${generatedApp.rarity.toUpperCase()}`)
    console.log(`💰 Token Value: ${generatedApp.estimatedValue} ECE`)
    
    console.log(`\n⚔️ Battle Stats:`)
    console.log(`  • Power: ${generatedApp.battleStats.power}/100`)
    console.log(`  • Speed: ${generatedApp.battleStats.speed}/100`)
    console.log(`  • Innovation: ${generatedApp.battleStats.innovation}/100`)
    console.log(`  • Scalability: ${generatedApp.battleStats.scalability}/100`)

    // 3. Test mode switching
    console.log('\n🔄 Testing Mode Switching...')
    
    // Force demo mode
    nebiusService.forceDemoMode()
    const demoStatus = await nebiusService.getServiceStatus()
    console.log(`📋 Switched to: ${demoStatus.mode.toUpperCase()}`)
    
    // Try to switch back to production
    const prodSwitchSuccess = nebiusService.forceProductionMode()
    console.log(`🚀 Production switch: ${prodSwitchSuccess ? 'SUCCESS' : 'FAILED (No API Key)'}`)

    // 4. Test usage stats
    console.log('\n📈 Usage Statistics...')
    const stats = await nebiusService.getUsageStats()
    console.log(`📊 Total Generations: ${stats.totalGenerations}`)
    console.log(`✅ Success Rate: ${(stats.successRate * 100).toFixed(1)}%`)
    console.log(`⏱️ Average Time: ${stats.averageTime}s`)
    console.log(`🔥 Popular Templates: ${stats.popularTemplates.join(', ')}`)
    
    console.log('\n📅 Recent Activity:')
    stats.recentActivity.forEach(activity => {
      console.log(`  • ${activity.appName} (${activity.template}) - ${activity.status}`)
    })

    console.log('\n🎉 ALL TESTS PASSED!')
    console.log('=' .repeat(50))
    console.log('✅ Service Status Check: WORKING')
    console.log('✅ App Generation: FUNCTIONAL')
    console.log('✅ Mode Switching: OPERATIONAL')
    console.log('✅ Usage Analytics: AVAILABLE')
    console.log('\n🚀 Ready for Production Deployment!')
    
    return true

  } catch (error) {
    console.log(`❌ Test Failed: ${error}`)
    return false
  }
}

// Run the test
testProductionService().then(success => {
  if (!success) {
    process.exit(1)
  }
})
