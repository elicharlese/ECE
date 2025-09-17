'use client'

import React from 'react'
import { GenerationEngineUI } from '@ece-platform/shared-ui'
import { ECEWalletGuard } from '@ece-platform/shared-ui'
import type { GenerationResult } from '@ece-platform/shared-business-logic'

export default function GenerationEnginePage() {
  const handleGenerationComplete = (result: GenerationResult) => {
    console.log('Generation completed:', result)
    
    // Here you could:
    // 1. Save the generation result to user's profile
    // 2. Create an order record
    // 3. Send notifications
    // 4. Update user's project portfolio
    
    if (result.success) {
      // Show success notification
      // Redirect to project management or download
    }
  }

  return (
    <ECEWalletGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                AI Software Generation Engine
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Generate complete software applications using our advanced AI developer engine. 
                From simple tools to complex full-stack applications, we build it all.
              </p>
            </div>

            <GenerationEngineUI 
              onGenerate={handleGenerationComplete}
              className="max-w-4xl mx-auto"
            />
          </div>
        </div>
      </div>
    </ECEWalletGuard>
  )
}
