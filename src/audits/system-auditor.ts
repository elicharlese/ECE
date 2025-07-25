/**
 * Comprehensive System Audit Tool
 * Analyzes entire ECE codebase for optimization opportunities
 */

import { promises as fs } from 'fs'
import path from 'path'

interface AuditResult {
  summary: {
    totalFiles: number
    totalLines: number
    duplicateComponents: string[]
    unusedFiles: string[]
    missingDependencies: string[]
    performanceIssues: string[]
    integrationGaps: string[]
  }
  recommendations: {
    cleanup: string[]
    optimization: string[]
    integration: string[]
  }
}

export class SystemAuditor {
  private rootPath: string
  private auditResults: AuditResult

  constructor(rootPath: string) {
    this.rootPath = rootPath
    this.auditResults = {
      summary: {
        totalFiles: 0,
        totalLines: 0,
        duplicateComponents: [],
        unusedFiles: [],
        missingDependencies: [],
        performanceIssues: [],
        integrationGaps: []
      },
      recommendations: {
        cleanup: [],
        optimization: [],
        integration: []
      }
    }
  }

  /**
   * Run complete system audit
   */
  async runFullAudit(): Promise<AuditResult> {
    console.log('🔍 Starting Comprehensive System Audit...')
    console.log('=' .repeat(60))

    try {
      // 1. File structure analysis
      await this.analyzeFileStructure()
      
      // 2. Component analysis
      await this.analyzeComponents()
      
      // 3. Dependency analysis
      await this.analyzeDependencies()
      
      // 4. Performance analysis
      await this.analyzePerformance()
      
      // 5. Integration analysis
      await this.analyzeIntegrations()
      
      // 6. Generate recommendations
      this.generateRecommendations()

      this.displayResults()
      return this.auditResults

    } catch (error) {
      console.error('❌ Audit failed:', error)
      throw error
    }
  }

  /**
   * Analyze file structure and identify issues
   */
  private async analyzeFileStructure(): Promise<void> {
    console.log('\n📁 Analyzing File Structure...')
    
    const fileExtensions = ['.tsx', '.ts', '.js', '.jsx', '.css', '.scss']
    const files = await this.getAllFiles(this.rootPath, fileExtensions)
    
    this.auditResults.summary.totalFiles = files.length
    
    // Count total lines
    let totalLines = 0
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8')
        totalLines += content.split('\n').length
      } catch (error) {
        console.warn(`⚠️ Could not read ${file}`)
      }
    }
    this.auditResults.summary.totalLines = totalLines

    console.log(`📊 Found ${files.length} files with ${totalLines.toLocaleString()} total lines`)
  }

  /**
   * Analyze components for duplicates and unused code
   */
  private async analyzeComponents(): Promise<void> {
    console.log('\n🧩 Analyzing Components...')
    
    const componentFiles = await this.getAllFiles(this.rootPath, ['.tsx', '.jsx'])
    const componentMap = new Map<string, string[]>()
    
    // Find component definitions
    for (const file of componentFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8')
        const componentNames = this.extractComponentNames(content)
        
        for (const name of componentNames) {
          if (!componentMap.has(name)) {
            componentMap.set(name, [])
          }
          componentMap.get(name)!.push(file)
        }
      } catch (error) {
        console.warn(`⚠️ Could not analyze ${file}`)
      }
    }

    // Find duplicates
    for (const [name, files] of componentMap) {
      if (files.length > 1) {
        this.auditResults.summary.duplicateComponents.push(`${name}: ${files.join(', ')}`)
      }
    }

    console.log(`🔍 Found ${this.auditResults.summary.duplicateComponents.length} duplicate components`)
  }

  /**
   * Analyze dependencies and imports
   */
  private async analyzeDependencies(): Promise<void> {
    console.log('\n📦 Analyzing Dependencies...')
    
    try {
      const packageJson = await fs.readFile(path.join(this.rootPath, 'package.json'), 'utf-8')
      const pkg = JSON.parse(packageJson)
      
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies
      }

      // Check for unused dependencies
      const codeFiles = await this.getAllFiles(this.rootPath, ['.tsx', '.ts', '.js', '.jsx'])
      const usedDeps = new Set<string>()

      for (const file of codeFiles) {
        try {
          const content = await fs.readFile(file, 'utf-8')
          const imports = this.extractImports(content)
          imports.forEach(imp => usedDeps.add(imp))
        } catch (error) {
          // Skip problematic files
        }
      }

      // Find potentially unused dependencies
      for (const dep of Object.keys(allDeps)) {
        if (!usedDeps.has(dep) && !this.isSystemDependency(dep)) {
          this.auditResults.summary.unusedFiles.push(`Potentially unused dependency: ${dep}`)
        }
      }

      console.log(`📋 Analyzed ${Object.keys(allDeps).length} dependencies`)
    } catch (error) {
      console.warn('⚠️ Could not analyze package.json')
    }
  }

  /**
   * Analyze performance issues
   */
  private async analyzePerformance(): Promise<void> {
    console.log('\n⚡ Analyzing Performance...')
    
    const issues: string[] = []
    const codeFiles = await this.getAllFiles(this.rootPath, ['.tsx', '.ts', '.js', '.jsx'])

    for (const file of codeFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8')
        
        // Check for performance anti-patterns
        if (content.includes('useEffect(() => {') && content.includes('[]') === false) {
          issues.push(`${file}: Missing dependency array in useEffect`)
        }
        
        if (content.includes('console.log') && !file.includes('test')) {
          issues.push(`${file}: Console.log statements in production code`)
        }
        
        if (content.includes('import *') && !content.includes('import * as React')) {
          issues.push(`${file}: Wildcard imports may increase bundle size`)
        }
        
        if (content.length > 50000) {
          issues.push(`${file}: Large file (${Math.round(content.length/1000)}KB) - consider splitting`)
        }
        
      } catch (error) {
        // Skip problematic files
      }
    }

    this.auditResults.summary.performanceIssues = issues
    console.log(`⚠️ Found ${issues.length} potential performance issues`)
  }

  /**
   * Analyze system integrations
   */
  private async analyzeIntegrations(): Promise<void> {
    console.log('\n🔗 Analyzing System Integrations...')
    
    const gaps: string[] = []
    
    // Check for common integration patterns
    const hasComponents = await this.directoryExists(path.join(this.rootPath, 'src/components'))
    const hasServices = await this.directoryExists(path.join(this.rootPath, 'src/services'))
    const hasTypes = await this.directoryExists(path.join(this.rootPath, 'src/types'))
    const hasHooks = await this.directoryExists(path.join(this.rootPath, 'src/hooks'))
    
    if (!hasComponents) gaps.push('Missing components directory structure')
    if (!hasServices) gaps.push('Missing services directory structure')
    if (!hasTypes) gaps.push('Missing types directory structure')
    if (!hasHooks) gaps.push('Missing hooks directory structure')

    // Check for API integration consistency
    const apiFiles = await this.getAllFiles(this.rootPath, ['.ts', '.tsx'])
    let hasApiClient = false
    let hasErrorHandling = false
    
    for (const file of apiFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8')
        if (content.includes('apiClient') || content.includes('fetch(')) {
          hasApiClient = true
        }
        if (content.includes('try {') && content.includes('catch')) {
          hasErrorHandling = true
        }
      } catch (error) {
        // Skip problematic files
      }
    }

    if (!hasApiClient) gaps.push('No consistent API client pattern found')
    if (!hasErrorHandling) gaps.push('Limited error handling patterns found')

    this.auditResults.summary.integrationGaps = gaps
    console.log(`🔍 Found ${gaps.length} integration gaps`)
  }

  /**
   * Generate recommendations based on audit results
   */
  private generateRecommendations(): void {
    console.log('\n💡 Generating Recommendations...')
    
    const { summary } = this.auditResults
    
    // Cleanup recommendations
    if (summary.duplicateComponents.length > 0) {
      this.auditResults.recommendations.cleanup.push('Consolidate duplicate components')
    }
    if (summary.unusedFiles.length > 0) {
      this.auditResults.recommendations.cleanup.push('Remove unused dependencies and files')
    }
    
    // Performance recommendations
    if (summary.performanceIssues.length > 0) {
      this.auditResults.recommendations.optimization.push('Fix performance anti-patterns')
      this.auditResults.recommendations.optimization.push('Implement code splitting for large files')
      this.auditResults.recommendations.optimization.push('Remove console.log statements')
    }
    
    // Integration recommendations
    if (summary.integrationGaps.length > 0) {
      this.auditResults.recommendations.integration.push('Establish consistent API client pattern')
      this.auditResults.recommendations.integration.push('Implement comprehensive error handling')
      this.auditResults.recommendations.integration.push('Create standardized directory structure')
    }
  }

  /**
   * Display audit results
   */
  private displayResults(): void {
    console.log('\n🎯 AUDIT RESULTS')
    console.log('=' .repeat(60))
    
    const { summary, recommendations } = this.auditResults
    
    console.log('\n📊 Summary:')
    console.log(`  • Total Files: ${summary.totalFiles}`)
    console.log(`  • Total Lines: ${summary.totalLines.toLocaleString()}`)
    console.log(`  • Duplicate Components: ${summary.duplicateComponents.length}`)
    console.log(`  • Unused Dependencies: ${summary.unusedFiles.length}`)
    console.log(`  • Performance Issues: ${summary.performanceIssues.length}`)
    console.log(`  • Integration Gaps: ${summary.integrationGaps.length}`)
    
    if (summary.duplicateComponents.length > 0) {
      console.log('\n🔄 Duplicate Components:')
      summary.duplicateComponents.forEach(dup => console.log(`  • ${dup}`))
    }
    
    if (summary.performanceIssues.length > 0) {
      console.log('\n⚡ Performance Issues:')
      summary.performanceIssues.slice(0, 10).forEach(issue => console.log(`  • ${issue}`))
      if (summary.performanceIssues.length > 10) {
        console.log(`  • ... and ${summary.performanceIssues.length - 10} more`)
      }
    }
    
    console.log('\n💡 Recommendations:')
    console.log('\n🧹 Cleanup:')
    recommendations.cleanup.forEach(rec => console.log(`  • ${rec}`))
    
    console.log('\n⚡ Optimization:')
    recommendations.optimization.forEach(rec => console.log(`  • ${rec}`))
    
    console.log('\n🔗 Integration:')
    recommendations.integration.forEach(rec => console.log(`  • ${rec}`))
  }

  /**
   * Helper: Get all files with specific extensions
   */
  private async getAllFiles(dir: string, extensions: string[]): Promise<string[]> {
    const files: string[] = []
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        
        if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
          const subFiles = await this.getAllFiles(fullPath, extensions)
          files.push(...subFiles)
        } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath)
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
    
    return files
  }

  /**
   * Helper: Check if directory exists
   */
  private async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(dirPath)
      return stats.isDirectory()
    } catch {
      return false
    }
  }

  /**
   * Helper: Extract component names from file content
   */
  private extractComponentNames(content: string): string[] {
    const componentRegex = /(?:export\s+(?:default\s+)?(?:function|const|class)\s+)(\w+)|(?:const\s+(\w+)\s*=\s*(?:\(\)|React\.forwardRef))/g
    const names: string[] = []
    let match
    
    while ((match = componentRegex.exec(content)) !== null) {
      names.push(match[1] || match[2])
    }
    
    return names
  }

  /**
   * Helper: Extract import statements
   */
  private extractImports(content: string): string[] {
    const importRegex = /import.*?from\s+['"]([^'"]+)['"]/g
    const imports: string[] = []
    let match
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1]
      if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
        const packageName = importPath.split('/')[0]
        imports.push(packageName)
      }
    }
    
    return imports
  }

  /**
   * Helper: Check if dependency is system-level
   */
  private isSystemDependency(dep: string): boolean {
    const systemDeps = [
      'react', 'react-dom', 'next', 'typescript', 'eslint', 'prettier',
      'tailwindcss', 'postcss', 'autoprefixer', '@types/react', '@types/node'
    ]
    return systemDeps.includes(dep)
  }

  /**
   * Helper: Check if directory should be skipped
   */
  private shouldSkipDirectory(name: string): boolean {
    const skipDirs = [
      'node_modules', '.git', '.next', 'dist', 'build', 
      '.vercel', 'coverage', '.nx', 'tmp'
    ]
    return skipDirs.includes(name)
  }
}

// Export for use in other modules
export const systemAuditor = new SystemAuditor('/workspaces/ECE')
