/**
 * Codebase Viability Service
 * Analyzes existing codebases to determine if they can be enhanced with ECE integration
 * Performs security, structure, and compatibility checks
 */

export interface CodebaseViabilityResult {
  isViable: boolean;
  score: number; // 0-100
  reason?: string;
  analysis: {
    structure: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
    security: {
      score: number;
      vulnerabilities: Array<{
        severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        type: string;
        description: string;
        file?: string;
        line?: number;
      }>;
      recommendations: string[];
    };
    compatibility: {
      score: number;
      framework: string;
      version: string;
      dependencies: Array<{
        name: string;
        version: string;
        compatible: boolean;
        issues?: string[];
      }>;
      recommendations: string[];
    };
    quality: {
      score: number;
      metrics: {
        complexity: number;
        maintainability: number;
        testCoverage: number;
        documentation: number;
      };
      issues: string[];
      recommendations: string[];
    };
  };
  enhancementPlan?: {
    estimatedEffort: number; // hours
    phases: Array<{
      name: string;
      description: string;
      effort: number;
      tasks: string[];
    }>;
    risks: Array<{
      type: string;
      probability: 'LOW' | 'MEDIUM' | 'HIGH';
      impact: 'LOW' | 'MEDIUM' | 'HIGH';
      mitigation: string;
    }>;
  };
}

export interface CodebaseMetadata {
  url: string;
  type: 'github' | 'gitlab' | 'bitbucket' | 'zip' | 'other';
  branch?: string;
  accessToken?: string;
  size?: number;
  lastModified?: Date;
}

export class CodebaseViabilityService {
  
  static async checkViability(codebaseUrl: string, metadata?: Partial<CodebaseMetadata>): Promise<CodebaseViabilityResult> {
    try {
      // Parse and validate the codebase URL
      const parsedMetadata = await this.parseCodebaseMetadata(codebaseUrl, metadata);
      
      // Clone or download the codebase for analysis
      const codebaseContent = await this.downloadCodebase(parsedMetadata);
      
      // Perform comprehensive analysis
      const structureAnalysis = await this.analyzeStructure(codebaseContent);
      const securityAnalysis = await this.analyzeSecurity(codebaseContent);
      const compatibilityAnalysis = await this.analyzeCompatibility(codebaseContent);
      const qualityAnalysis = await this.analyzeQuality(codebaseContent);
      
      // Calculate overall viability score
      const overallScore = this.calculateOverallScore({
        structure: structureAnalysis.score,
        security: securityAnalysis.score,
        compatibility: compatibilityAnalysis.score,
        quality: qualityAnalysis.score
      });
      
      const isViable = overallScore >= 60 && securityAnalysis.score >= 70;
      
      // Generate enhancement plan if viable
      const enhancementPlan = isViable ? 
        await this.generateEnhancementPlan(codebaseContent, {
          structure: structureAnalysis,
          security: securityAnalysis,
          compatibility: compatibilityAnalysis,
          quality: qualityAnalysis
        }) : undefined;
      
      return {
        isViable,
        score: overallScore,
        reason: isViable ? 'Codebase is suitable for ECE enhancement' : this.getViabilityReason(overallScore, securityAnalysis.score),
        analysis: {
          structure: structureAnalysis,
          security: securityAnalysis,
          compatibility: compatibilityAnalysis,
          quality: qualityAnalysis
        },
        enhancementPlan
      };
      
    } catch (error) {
      console.error('Codebase viability check failed:', error);
      return {
        isViable: false,
        score: 0,
        reason: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        analysis: {
          structure: { score: 0, issues: ['Analysis failed'], recommendations: [] },
          security: { score: 0, vulnerabilities: [], recommendations: [] },
          compatibility: { score: 0, framework: 'unknown', version: 'unknown', dependencies: [], recommendations: [] },
          quality: { score: 0, metrics: { complexity: 0, maintainability: 0, testCoverage: 0, documentation: 0 }, issues: ['Analysis failed'], recommendations: [] }
        }
      };
    }
  }

  private static async parseCodebaseMetadata(url: string, metadata?: Partial<CodebaseMetadata>): Promise<CodebaseMetadata> {
    // Parse GitHub, GitLab, Bitbucket URLs
    if (url.includes('github.com')) {
      return {
        url,
        type: 'github',
        branch: metadata?.branch || 'main',
        ...metadata
      };
    } else if (url.includes('gitlab.com')) {
      return {
        url,
        type: 'gitlab',
        branch: metadata?.branch || 'main',
        ...metadata
      };
    } else if (url.includes('bitbucket.org')) {
      return {
        url,
        type: 'bitbucket',
        branch: metadata?.branch || 'main',
        ...metadata
      };
    } else if (url.endsWith('.zip')) {
      return {
        url,
        type: 'zip',
        ...metadata
      };
    } else {
      return {
        url,
        type: 'other',
        ...metadata
      };
    }
  }

  private static async downloadCodebase(metadata: CodebaseMetadata): Promise<{
    files: Array<{ path: string; content: string; size: number }>;
    packageJson?: any;
    readme?: string;
    structure: string[];
  }> {
    // Simulate codebase download and parsing
    // In a real implementation, this would use git clone, API calls, or file downloads
    
    return {
      files: [
        { path: 'package.json', content: '{"name": "sample-app", "version": "1.0.0"}', size: 1024 },
        { path: 'src/index.js', content: 'console.log("Hello World");', size: 512 },
        { path: 'README.md', content: '# Sample Application', size: 256 }
      ],
      packageJson: { name: 'sample-app', version: '1.0.0', dependencies: {} },
      readme: '# Sample Application',
      structure: ['src/', 'package.json', 'README.md']
    };
  }

  private static async analyzeStructure(codebase: any): Promise<{
    score: number;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check for standard project structure
    const hasPackageJson = codebase.files.some((f: any) => f.path === 'package.json');
    const hasSrcFolder = codebase.structure.some((s: string) => s.includes('src/'));
    const hasReadme = codebase.files.some((f: any) => f.path.toLowerCase().includes('readme'));

    if (!hasPackageJson) {
      issues.push('Missing package.json file');
      recommendations.push('Add package.json with proper dependencies and scripts');
      score -= 20;
    }

    if (!hasSrcFolder) {
      issues.push('No clear source code organization');
      recommendations.push('Organize code in src/ directory structure');
      score -= 15;
    }

    if (!hasReadme) {
      issues.push('Missing README documentation');
      recommendations.push('Add comprehensive README.md with setup instructions');
      score -= 10;
    }

    // Check for modern project structure
    const hasConfigFiles = codebase.structure.some((s: string) => 
      s.includes('tsconfig.json') || s.includes('babel.config') || s.includes('webpack.config')
    );

    if (!hasConfigFiles) {
      issues.push('Missing build configuration files');
      recommendations.push('Add TypeScript, Babel, or Webpack configuration');
      score -= 10;
    }

    // Check for testing setup
    const hasTests = codebase.structure.some((s: string) => 
      s.includes('test/') || s.includes('__tests__/') || s.includes('.test.') || s.includes('.spec.')
    );

    if (!hasTests) {
      issues.push('No testing infrastructure found');
      recommendations.push('Add testing framework (Jest, Vitest, etc.)');
      score -= 15;
    }

    return {
      score: Math.max(0, score),
      issues,
      recommendations
    };
  }

  private static async analyzeSecurity(codebase: any): Promise<{
    score: number;
    vulnerabilities: Array<{
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      type: string;
      description: string;
      file?: string;
      line?: number;
    }>;
    recommendations: string[];
  }> {
    const vulnerabilities: Array<{
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      type: string;
      description: string;
      file?: string;
      line?: number;
    }> = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check for common security issues
    const codeContent = codebase.files.map((f: any) => f.content).join('\n');

    // Check for hardcoded secrets
    if (codeContent.includes('password') || codeContent.includes('secret') || codeContent.includes('api_key')) {
      vulnerabilities.push({
        severity: 'HIGH',
        type: 'HARDCODED_SECRETS',
        description: 'Potential hardcoded secrets or passwords found',
        file: 'multiple files'
      });
      score -= 25;
    }

    // Check for SQL injection potential
    if (codeContent.includes('SELECT') && codeContent.includes('+')) {
      vulnerabilities.push({
        severity: 'CRITICAL',
        type: 'SQL_INJECTION',
        description: 'Potential SQL injection vulnerability',
        file: 'database queries'
      });
      score -= 40;
    }

    // Check for XSS potential
    if (codeContent.includes('innerHTML') || codeContent.includes('dangerouslySetInnerHTML')) {
      vulnerabilities.push({
        severity: 'MEDIUM',
        type: 'XSS_RISK',
        description: 'Potential XSS vulnerability with innerHTML usage',
        file: 'frontend components'
      });
      score -= 15;
    }

    // Check for insecure dependencies
    if (codebase.packageJson?.dependencies) {
      const deps = Object.keys(codebase.packageJson.dependencies);
      const knownVulnerableDeps = ['lodash', 'moment', 'request']; // Examples
      
      deps.forEach(dep => {
        if (knownVulnerableDeps.includes(dep)) {
          vulnerabilities.push({
            severity: 'MEDIUM',
            type: 'VULNERABLE_DEPENDENCY',
            description: `Dependency ${dep} has known security vulnerabilities`,
            file: 'package.json'
          });
          score -= 10;
        }
      });
    }

    // Security recommendations
    recommendations.push('Implement Content Security Policy (CSP) headers');
    recommendations.push('Add rate limiting and input validation');
    recommendations.push('Use environment variables for sensitive data');
    recommendations.push('Implement proper authentication and authorization');
    recommendations.push('Regular dependency security audits');

    return {
      score: Math.max(0, score),
      vulnerabilities,
      recommendations
    };
  }

  private static async analyzeCompatibility(codebase: any): Promise<{
    score: number;
    framework: string;
    version: string;
    dependencies: Array<{
      name: string;
      version: string;
      compatible: boolean;
      issues?: string[];
    }>;
    recommendations: string[];
  }> {
    const recommendations: string[] = [];
    let score = 100;
    let framework = 'unknown';
    let version = 'unknown';

    // Detect framework
    const packageJson = codebase.packageJson || {};
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (deps.react) {
      framework = 'React';
      version = deps.react;
    } else if (deps.vue) {
      framework = 'Vue';
      version = deps.vue;
    } else if (deps.angular || deps['@angular/core']) {
      framework = 'Angular';
      version = deps['@angular/core'] || deps.angular;
    } else if (deps.next) {
      framework = 'Next.js';
      version = deps.next;
    } else if (deps.express) {
      framework = 'Express';
      version = deps.express;
    }

    // Analyze dependencies compatibility
    const dependencies = Object.entries(deps).map(([name, version]) => {
      const compatible = this.checkECECompatibility(name, version as string);
      return {
        name,
        version: version as string,
        compatible,
        issues: compatible ? undefined : [`Version ${version} may not be compatible with ECE integration`]
      };
    });

    const incompatibleCount = dependencies.filter(d => !d.compatible).length;
    score -= (incompatibleCount * 5);

    // Framework-specific compatibility checks
    if (framework === 'React') {
      const reactVersion = this.parseVersion(version);
      if (reactVersion.major < 17) {
        score -= 20;
        recommendations.push('Upgrade React to version 17+ for better ECE compatibility');
      }
    } else if (framework === 'unknown') {
      score -= 30;
      recommendations.push('Consider migrating to a supported framework (React, Next.js, Vue)');
    }

    // Check for TypeScript
    if (!deps.typescript && !deps['@types/node']) {
      score -= 15;
      recommendations.push('Add TypeScript for better type safety and ECE integration');
    }

    return {
      score: Math.max(0, score),
      framework,
      version,
      dependencies,
      recommendations
    };
  }

  private static async analyzeQuality(codebase: any): Promise<{
    score: number;
    metrics: {
      complexity: number;
      maintainability: number;
      testCoverage: number;
      documentation: number;
    };
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Simulate code quality metrics
    const metrics = {
      complexity: this.calculateComplexity(codebase),
      maintainability: this.calculateMaintainability(codebase),
      testCoverage: this.calculateTestCoverage(codebase),
      documentation: this.calculateDocumentation(codebase)
    };

    const score = (metrics.complexity + metrics.maintainability + metrics.testCoverage + metrics.documentation) / 4;

    if (metrics.complexity < 60) {
      issues.push('High code complexity detected');
      recommendations.push('Refactor complex functions and reduce cyclomatic complexity');
    }

    if (metrics.maintainability < 70) {
      issues.push('Low maintainability score');
      recommendations.push('Improve code organization and reduce coupling');
    }

    if (metrics.testCoverage < 50) {
      issues.push('Insufficient test coverage');
      recommendations.push('Add comprehensive unit and integration tests');
    }

    if (metrics.documentation < 40) {
      issues.push('Poor documentation');
      recommendations.push('Add inline comments and API documentation');
    }

    return {
      score,
      metrics,
      issues,
      recommendations
    };
  }

  private static calculateOverallScore(scores: {
    structure: number;
    security: number;
    compatibility: number;
    quality: number;
  }): number {
    // Weighted average with security being most important
    return Math.round(
      (scores.structure * 0.2) +
      (scores.security * 0.4) +
      (scores.compatibility * 0.25) +
      (scores.quality * 0.15)
    );
  }

  private static getViabilityReason(overallScore: number, securityScore: number): string {
    if (securityScore < 70) {
      return 'Critical security vulnerabilities detected. Enhanced security measures required before ECE integration.';
    }
    if (overallScore < 40) {
      return 'Codebase requires major refactoring before ECE enhancement is viable.';
    }
    if (overallScore < 60) {
      return 'Moderate issues detected. Consider addressing compatibility and quality concerns.';
    }
    return 'Codebase meets minimum requirements for ECE enhancement.';
  }

  private static async generateEnhancementPlan(codebase: any, analysis: any): Promise<{
    estimatedEffort: number;
    phases: Array<{
      name: string;
      description: string;
      effort: number;
      tasks: string[];
    }>;
    risks: Array<{
      type: string;
      probability: 'LOW' | 'MEDIUM' | 'HIGH';
      impact: 'LOW' | 'MEDIUM' | 'HIGH';
      mitigation: string;
    }>;
  }> {
    const phases = [
      {
        name: 'Security Hardening',
        description: 'Address security vulnerabilities and implement ECE security standards',
        effort: analysis.security.vulnerabilities.length * 2,
        tasks: [
          'Fix security vulnerabilities',
          'Implement ECE security middleware',
          'Add authentication integration',
          'Security audit and testing'
        ]
      },
      {
        name: 'ECE Integration',
        description: 'Integrate ECE branding, wallet authentication, and core services',
        effort: 16,
        tasks: [
          'Add ThirdWeb wallet integration',
          'Implement ECE branding schema',
          'Integrate ECE UI components',
          'Add ECE API endpoints'
        ]
      },
      {
        name: 'Quality Improvements',
        description: 'Improve code quality, testing, and documentation',
        effort: Math.max(8, (100 - analysis.quality.score) * 0.2),
        tasks: [
          'Refactor complex code sections',
          'Add comprehensive testing',
          'Improve documentation',
          'Code quality validation'
        ]
      },
      {
        name: 'Deployment & Optimization',
        description: 'Prepare for deployment with ECE standards compliance',
        effort: 8,
        tasks: [
          'ECE compliance validation',
          'Performance optimization',
          'Deployment configuration',
          'Final testing and validation'
        ]
      }
    ];

    const totalEffort = phases.reduce((sum, phase) => sum + phase.effort, 0);

    const risks = [
      {
        type: 'Security Migration',
        probability: analysis.security.vulnerabilities.length > 0 ? 'HIGH' : 'LOW' as 'HIGH' | 'LOW',
        impact: 'HIGH' as 'HIGH',
        mitigation: 'Thorough security testing and gradual migration approach'
      },
      {
        type: 'Framework Compatibility',
        probability: analysis.compatibility.score < 80 ? 'MEDIUM' : 'LOW' as 'MEDIUM' | 'LOW',
        impact: 'MEDIUM' as 'MEDIUM',
        mitigation: 'Compatibility testing and framework-specific adapters'
      },
      {
        type: 'Code Quality Issues',
        probability: analysis.quality.score < 70 ? 'HIGH' : 'LOW' as 'HIGH' | 'LOW',
        impact: 'MEDIUM' as 'MEDIUM',
        mitigation: 'Phased refactoring with comprehensive testing'
      }
    ];

    return {
      estimatedEffort: totalEffort,
      phases,
      risks
    };
  }

  private static checkECECompatibility(packageName: string, version: string): boolean {
    // ECE-compatible packages and versions
    const compatiblePackages: Record<string, string[]> = {
      'react': ['17.x', '18.x'],
      'next': ['12.x', '13.x', '14.x'],
      'typescript': ['4.x', '5.x'],
      'tailwindcss': ['3.x'],
      'framer-motion': ['10.x', '11.x']
    };

    const compatibleVersions = compatiblePackages[packageName];
    if (!compatibleVersions) return true; // Unknown packages are assumed compatible

    const versionInfo = this.parseVersion(version);
    return compatibleVersions.some(compatibleVersion => {
      const compatibleInfo = this.parseVersion(compatibleVersion);
      return versionInfo.major === compatibleInfo.major;
    });
  }

  private static parseVersion(version: string): { major: number; minor: number; patch: number } {
    const cleaned = version.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.').map(Number);
    return {
      major: parts[0] || 0,
      minor: parts[1] || 0,
      patch: parts[2] || 0
    };
  }

  private static calculateComplexity(codebase: any): number {
    // Simulate complexity calculation based on file count, function count, etc.
    const fileCount = codebase.files.length;
    const avgFileSize = codebase.files.reduce((sum: number, f: any) => sum + f.size, 0) / fileCount;
    
    // Simple heuristic: more files and larger files = higher complexity
    let score = 100;
    if (fileCount > 100) score -= 20;
    if (avgFileSize > 5000) score -= 15;
    
    return Math.max(0, score);
  }

  private static calculateMaintainability(codebase: any): number {
    // Check for good practices
    let score = 70; // Base score
    
    const hasLinting = codebase.structure.some((s: string) => s.includes('eslint') || s.includes('.lint'));
    const hasFormatting = codebase.structure.some((s: string) => s.includes('prettier'));
    const hasTypeScript = codebase.files.some((f: any) => f.path.endsWith('.ts') || f.path.endsWith('.tsx'));
    
    if (hasLinting) score += 10;
    if (hasFormatting) score += 10;
    if (hasTypeScript) score += 15;
    
    return Math.min(100, score);
  }

  private static calculateTestCoverage(codebase: any): number {
    const testFiles = codebase.files.filter((f: any) => 
      f.path.includes('.test.') || f.path.includes('.spec.') || f.path.includes('__tests__')
    );
    
    const sourceFiles = codebase.files.filter((f: any) => 
      f.path.includes('src/') && (f.path.endsWith('.js') || f.path.endsWith('.ts') || f.path.endsWith('.tsx'))
    );
    
    if (sourceFiles.length === 0) return 0;
    
    const coverage = (testFiles.length / sourceFiles.length) * 100;
    return Math.min(100, coverage);
  }

  private static calculateDocumentation(codebase: any): number {
    let score = 0;
    
    const hasReadme = codebase.files.some((f: any) => f.path.toLowerCase().includes('readme'));
    const hasChangelog = codebase.files.some((f: any) => f.path.toLowerCase().includes('changelog'));
    const hasContributing = codebase.files.some((f: any) => f.path.toLowerCase().includes('contributing'));
    const hasLicense = codebase.files.some((f: any) => f.path.toLowerCase().includes('license'));
    
    if (hasReadme) score += 40;
    if (hasChangelog) score += 20;
    if (hasContributing) score += 20;
    if (hasLicense) score += 20;
    
    return score;
  }
}
