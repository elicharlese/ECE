/**
 * Nebius AI Integration Test
 * Tests the Nebius AI service with a simple generation request
 */

import { nebiusAI } from '../src/services/nebius-ai.service'
import { APP_TEMPLATES } from '../src/types/app-generation'

async function testNebiusIntegration() {
  console.log('🧪 Testing Nebius AI Integration...')
  console.log('================================')

  try {
    // Test with a simple web app template
    const template = APP_TEMPLATES[0] // Modern Web App
    
    console.log(`📋 Template: ${template.name}`)
    console.log(`🏗️ Category: ${template.category}`)
    console.log(`⚡ Framework: ${template.frameworks[0]}`)
    console.log('--------------------------------')

    const startTime = Date.now()
    let stepCount = 0

    const result = await nebiusAI.generateApp({
      template,
      projectName: 'ECE Test App',
      description: 'A test application generated with Nebius AI to verify integration',
      features: ['Responsive Design', 'API Integration'],
      complexity: 'simple',
      framework: 'React',
      onProgress: (progress) => {
        stepCount++
        console.log(`📊 Step ${progress.step}/${progress.totalSteps}: ${progress.message}`)
        console.log(`📈 Progress: ${progress.percentage}%`)
        console.log('--------------------------------')
      }
    })

    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000

    console.log('✅ GENERATION SUCCESSFUL!')
    console.log('================================')
    console.log(`🚀 Generated App: ${result.name}`)
    console.log(`⏱️ Duration: ${duration.toFixed(2)} seconds`)
    console.log(`📊 Quality Score: ${result.qualityScore}/100`)
    console.log(`⚔️ Battle Stats:`)
    console.log(`   • Power: ${result.battleStats.power}`)
    console.log(`   • Speed: ${result.battleStats.speed}`)
    console.log(`   • Innovation: ${result.battleStats.innovation}`)
    console.log(`   • Scalability: ${result.battleStats.scalability}`)
    console.log(`💎 Rarity: ${result.rarity.toUpperCase()}`)
    console.log(`💰 Trading Value: ${result.tradingValue} ECE`)
    console.log(`📁 Files Generated: ${Object.keys(result.files).length}`)
    console.log('--------------------------------')
    
    console.log('📁 Generated Files:')
    Object.keys(result.files).forEach(file => {
      console.log(`   • ${file}`)
    })

    return result

  } catch (error) {
    console.error('❌ TEST FAILED!')
    console.error('================================')
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    
    if (error instanceof Error && error.message.includes('API key')) {
      console.log('💡 TIP: Make sure to set your NEXT_PUBLIC_NEBIUS_API_KEY environment variable')
    }
    
    throw error
  }
}

// Export for use in other tests
export { testNebiusIntegration }

// Run test if this file is executed directly
if (require.main === module) {
  testNebiusIntegration()
    .then(() => {
      console.log('🎉 All tests passed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Test failed:', error)
      process.exit(1)
    })
}
