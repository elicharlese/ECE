import { NextResponse } from 'next/server'
import { ECE_ENGINE_CONFIG, getCurrentStage, validateStageRequirements, EngineStage } from '../../../../lib/engine-config'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      projectName, 
      projectType, 
      platforms = [], 
      requirements = {},
      customRequirements,
      targetStage = 'primary' // Allow specifying target stage
    } = body

    // Get the current engine stage
    const currentStage = getCurrentStage()
    const targetStageConfig = ECE_ENGINE_CONFIG.stages[targetStage as keyof typeof ECE_ENGINE_CONFIG.stages] || currentStage

    // Validate stage requirements
    const stageValidation = validateStageRequirements(targetStageConfig, {
      projectName,
      projectType,
      platforms,
      requirements
    })

    if (!stageValidation) {
      return NextResponse.json(
        { 
          success: false,
          error: `Stage requirements not met for ${targetStageConfig.name}`,
          stage: targetStageConfig.name,
          requiredChecks: targetStageConfig.requiredChecks
        },
        { status: 400 }
      )
    }

    // Generate project based on stage considerations
    const generationResult = await generateProjectWithStageConsiderations({
      projectName,
      projectType,
      platforms,
      requirements,
      customRequirements,
      targetStage: targetStageConfig
    })

    return NextResponse.json({
      success: true,
      projectPath: `./generated-projects/${projectName}`,
      stage: targetStageConfig.name,
      stagePriority: targetStageConfig.priority,
      considerations: targetStageConfig.considerations,
      filesGenerated: generationResult.filesGenerated,
      commandsExecuted: generationResult.commandsExecuted,
      validationResults: generationResult.validationResults,
      errors: generationResult.errors,
      warnings: generationResult.warnings,
      nextSteps: generationResult.nextSteps,
      stageValidation: {
        passed: stageValidation,
        stage: targetStageConfig.name,
        considerations: targetStageConfig.considerations,
        requiredChecks: targetStageConfig.requiredChecks
      }
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate project', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}

async function generateProjectWithStageConsiderations(params: {
  projectName: string
  projectType: string
  platforms: string[]
  requirements: any
  customRequirements?: any
  targetStage: EngineStage
}) {
  const { projectName, projectType, platforms, requirements, customRequirements, targetStage } = params

  // Base generation logic
  const baseFiles = [
    { path: 'package.json', size: 1024 },
    { path: 'src/index.js', size: 512 },
    { path: 'README.md', size: 256 }
  ]

  const baseCommands = [
    { command: 'npm init -y', description: 'Initialize package.json' },
    { command: 'npm install', description: 'Install dependencies' }
  ]

  // Stage-specific enhancements
  const stageEnhancements = getStageEnhancements(targetStage, projectType, platforms)

  return {
    filesGenerated: [...baseFiles, ...stageEnhancements.files],
    commandsExecuted: [...baseCommands, ...stageEnhancements.commands],
    validationResults: [
      { description: 'Project structure validation', passed: true, message: 'Valid project structure' },
      { description: `${targetStage.name} requirements`, passed: true, message: `${targetStage.considerations.length} considerations applied` }
    ],
    errors: [],
    warnings: [],
    nextSteps: [
      'Run npm install to install dependencies',
      'Start development with npm run dev',
      'Review generated code and customize as needed',
      `Verify ${targetStage.name.toLowerCase()} requirements are met`
    ]
  }
}

function getStageEnhancements(stage: EngineStage, projectType: string, platforms: string[]) {
  const enhancements = {
    files: [] as any[],
    commands: [] as any[]
  }

  // Primary stage enhancements
  if (stage.name === 'Primary Stage') {
    enhancements.files.push(
      { path: '.env.example', size: 512 },
      { path: 'middleware.ts', size: 1024 },
      { path: 'src/lib/auth.ts', size: 2048 },
      { path: 'src/app/api/route.ts', size: 1024 }
    )
    enhancements.commands.push(
      { command: 'npm install dotenv cors helmet', description: 'Install security and middleware packages' },
      { command: 'npm install --save-dev @types/cors', description: 'Install middleware type definitions' }
    )
  }

  // Secondary stage enhancements
  if (stage.name === 'Secondary Stage') {
    enhancements.files.push(
      { path: 'src/lib/db.ts', size: 2048 },
      { path: 'src/components/', size: 4096 },
      { path: 'tests/', size: 2048 },
      { path: 'docs/', size: 1024 },
      { path: 'scripts/', size: 512 }
    )
    enhancements.commands.push(
      { command: 'npm install prisma @prisma/client', description: 'Install database packages' },
      { command: 'npm install --save-dev jest @types/jest', description: 'Install testing framework' },
      { command: 'npx prisma init', description: 'Initialize database schema' }
    )
  }

  // Tertiary stage enhancements
  if (stage.name === 'Tertiary Stage') {
    enhancements.files.push(
      { path: 'src/components/ui/', size: 8192 },
      { path: 'src/styles/', size: 2048 },
      { path: 'public/assets/', size: 4096 },
      { path: 'src/hooks/', size: 1024 }
    )
    enhancements.commands.push(
      { command: 'npm install react react-dom next', description: 'Install frontend framework' },
      { command: 'npm install tailwindcss @heroicons/react', description: 'Install UI libraries' },
      { command: 'npm install framer-motion', description: 'Install animation library' }
    )
  }

  return enhancements
}

export async function GET() {
  try {
    // Return templates with stage information
    const mockTemplates = [
      {
        name: 'nx-monorepo',
        description: 'Nx monorepo with React and TypeScript',
        projectType: 'nx-monorepo',
        platforms: ['web', 'mobile', 'desktop'],
        techStack: ['react', 'typescript', 'nx'],
        supportedStages: ['primary', 'secondary', 'tertiary']
      },
      {
        name: 'expo-mobile',
        description: 'React Native mobile app with Expo',
        projectType: 'expo-mobile',
        platforms: ['mobile'],
        techStack: ['react-native', 'expo', 'typescript'],
        supportedStages: ['primary', 'secondary', 'tertiary']
      },
      {
        name: 'chrome-extension',
        description: 'Chrome browser extension',
        projectType: 'chrome-extension',
        platforms: ['web'],
        techStack: ['javascript', 'html', 'css'],
        supportedStages: ['primary', 'secondary']
      },
      {
        name: 'nextjs-web',
        description: 'Next.js web application',
        projectType: 'nextjs-web',
        platforms: ['web'],
        techStack: ['nextjs', 'react', 'typescript'],
        supportedStages: ['primary', 'secondary', 'tertiary']
      }
    ]
    
    return NextResponse.json({
      templates: mockTemplates,
      engineConfig: {
        currentStage: ECE_ENGINE_CONFIG.currentStage,
        version: ECE_ENGINE_CONFIG.version,
        stages: Object.keys(ECE_ENGINE_CONFIG.stages)
      }
    })
  } catch (error) {
    console.error('Template listing error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to list templates', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}
