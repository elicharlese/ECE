#!/usr/bin/env ts-node

import 'dotenv/config'
import fetch from 'node-fetch'

interface TestResult {
  test: string
  passed: boolean
  message: string
  data?: any
}

class GenerationEngineTest {
  private baseUrl = 'http://localhost:3000'
  private results: TestResult[] = []

  async runAllTests() {
    console.log('🚀 Starting ECE Generation Engine Tests\n')

    // Test API endpoints
    await this.testListTemplates()
    await this.testGenerateProject()
    
    // Test AI echo endpoints
    await this.testAIEcho()
    
    // Print results
    this.printResults()
  }

  async testListTemplates() {
    try {
      const response = await fetch(`${this.baseUrl}/api/engine/generate`)
      const data = await response.json() as Record<string, unknown>
      
      if (response.ok && data.templates) {
        this.results.push({
          test: 'List Templates API',
          passed: true,
          message: `Found ${data.templates.length} templates`,
          data: data.templates.map((t: any) => t.name)
        })
      } else {
        this.results.push({
          test: 'List Templates API',
          passed: false,
          message: `Failed: ${response.status} ${response.statusText}`,
          data: data
        })
      }
    } catch (error) {
      this.results.push({
        test: 'List Templates API',
        passed: false,
        message: `Error: ${error}`,
      })
    }
  }

  async testGenerateProject() {
    try {
      const payload = {
        projectName: 'test-chrome-extension',
        projectType: 'chrome-extension',
        platforms: ['web'],
        requirements: {
          authentication: false,
          database: false,
          testing: true
        },
        architecture: {
          spa: true
        },
        compliance: {
          security: true,
          performance: true
        },
        customRequirements: 'Add a simple popup with a greeting message'
      }

      const response = await fetch(`${this.baseUrl}/api/engine/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json() as Record<string, unknown>
      
      if (response.ok) {
        this.results.push({
          test: 'Generate Project API',
          passed: data.success || false,
          message: data.success 
            ? `Generated ${data.filesGenerated?.length || 0} files`
            : `Generation failed: ${data.errors?.join(', ') || 'Unknown error'}`,
          data: {
            success: data.success,
            filesGenerated: data.filesGenerated?.length || 0,
            errors: data.errors || [],
            nextSteps: data.nextSteps || []
          }
        })
      } else {
        this.results.push({
          test: 'Generate Project API',
          passed: false,
          message: `API Error: ${response.status} ${response.statusText}`,
          data: data
        })
      }
    } catch (error) {
      this.results.push({
        test: 'Generate Project API',
        passed: false,
        message: `Error: ${error}`,
      })
    }
  }

  async testAIEcho() {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/echo?provider=openai&message=ping`)
      const data = await response.json() as Record<string, unknown>
      
      if (response.ok && data.ok) {
        this.results.push({
          test: 'AI Echo API',
          passed: true,
          message: `AI responded: ${data.contentSnippet?.substring(0, 50) || 'No content'}`,
          data: {
            provider: data.routedProvider,
            model: data.model
          }
        })
      } else {
        this.results.push({
          test: 'AI Echo API',
          passed: false,
          message: `Failed: ${data.error || 'Unknown error'}`,
          data: data
        })
      }
    } catch (error) {
      this.results.push({
        test: 'AI Echo API',
        passed: false,
        message: `Error: ${error}`,
      })
    }
  }

  printResults() {
    console.log('\n📊 Test Results Summary\n')
    
    let passed = 0
    let failed = 0

    this.results.forEach((result) => {
      const status = result.passed ? '✅' : '❌'
      const color = result.passed ? '\x1b[32m' : '\x1b[31m'
      const reset = '\x1b[0m'
      
      console.log(`${status} ${color}${result.test}${reset}`)
      console.log(`   ${result.message}`)
      
      if (result.data && Object.keys(result.data).length > 0) {
        console.log(`   Data: ${JSON.stringify(result.data, null, 2).substring(0, 200)}...`)
      }
      console.log('')

      if (result.passed) passed++
      else failed++
    })

    console.log(`\n🎯 Final Score: ${passed}/${passed + failed} tests passed`)
    
    if (failed === 0) {
      console.log('🎉 All tests passed! The generation engine is working correctly.')
    } else {
      console.log('⚠️  Some tests failed. Check the errors above.')
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new GenerationEngineTest()
  tester.runAllTests().catch(console.error)
}

export { GenerationEngineTest }
