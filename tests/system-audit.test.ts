/**
 * System Audit Test Runner
 * Executes comprehensive codebase analysis
 */

import { systemAuditor } from '../src/audits/system-auditor'

async function runSystemAudit() {
  console.log('🔍 ECE SYSTEM AUDIT - PATCH 14')
  console.log('=' .repeat(60))
  console.log('Starting comprehensive codebase analysis...')
  console.log('This may take a few minutes...')

  try {
    const results = await systemAuditor.runFullAudit()
    
    console.log('\n🎯 AUDIT COMPLETE!')
    console.log('=' .repeat(60))
    
    // Calculate overall health score
    const healthScore = calculateHealthScore(results)
    console.log(`\n📊 Overall Codebase Health: ${healthScore}/100`)
    
    // Priority recommendations
    console.log('\n🚨 HIGH PRIORITY ITEMS:')
    const highPriority = getHighPriorityItems(results)
    highPriority.forEach(item => console.log(`  • ${item}`))
    
    console.log('\n✅ NEXT STEPS:')
    console.log('  1. Review and implement cleanup recommendations')
    console.log('  2. Address performance optimization opportunities')
    console.log('  3. Enhance system integration points')
    console.log('  4. Run follow-up audit to measure improvements')
    
    return results
    
  } catch (error) {
    console.error('❌ Audit failed:', error)
    return null
  }
}

function calculateHealthScore(results: any): number {
  let score = 100
  
  // Deduct points for issues
  score -= Math.min(results.summary.duplicateComponents.length * 5, 20)
  score -= Math.min(results.summary.unusedFiles.length * 2, 15)
  score -= Math.min(results.summary.performanceIssues.length * 1, 25)
  score -= Math.min(results.summary.integrationGaps.length * 3, 15)
  
  return Math.max(score, 0)
}

function getHighPriorityItems(results: any): string[] {
  const items: string[] = []
  
  if (results.summary.duplicateComponents.length > 0) {
    items.push(`${results.summary.duplicateComponents.length} duplicate components need consolidation`)
  }
  
  if (results.summary.performanceIssues.length > 10) {
    items.push(`${results.summary.performanceIssues.length} performance issues need attention`)
  }
  
  if (results.summary.integrationGaps.length > 0) {
    items.push(`${results.summary.integrationGaps.length} integration gaps need fixing`)
  }
  
  if (items.length === 0) {
    items.push('No critical issues found - codebase is in excellent condition!')
  }
  
  return items
}

// Run the audit
runSystemAudit()
