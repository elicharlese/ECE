/**
 * Mobbin Template Service
 * Analyzes UI patterns from mobbin.com and creates ECE-compliant templates
 * Inspired by best practices from top mobile and web applications
 */

export interface MobbinTemplate {
  id: string;
  name: string;
  category: string;
  complexity: number;
  features: string[];
  uiPatterns: {
    navigation: 'header' | 'sidebar' | 'bottom' | 'tabs' | 'drawer';
    layout: 'single-column' | 'two-column' | 'three-column' | 'grid' | 'masonry';
    components: string[];
    interactions: string[];
  };
  designSystem: {
    colorScheme: 'light' | 'dark' | 'system';
    spacing: 'compact' | 'comfortable' | 'spacious';
    typography: 'minimal' | 'editorial' | 'expressive';
    animations: 'subtle' | 'moderate' | 'dynamic';
  };
  responsiveBreakpoints: string[];
  accessibility: {
    level: 'AA' | 'AAA';
    features: string[];
  };
  performance: {
    loadTime: number;
    bundleSize: number;
    score: number;
  };
}

export interface TemplateRequest {
  projectType: string;
  complexity: number;
  features: string[];
  industry?: string;
  targetAudience?: string;
  deviceTargets?: ('mobile' | 'tablet' | 'desktop')[];
}

export class MobbinTemplateService {
  
  private static templates: MobbinTemplate[] = [
    {
      id: 'saas-dashboard',
      name: 'SaaS Dashboard',
      category: 'BUSINESS',
      complexity: 0.8,
      features: ['analytics', 'user-management', 'billing', 'settings', 'notifications'],
      uiPatterns: {
        navigation: 'sidebar',
        layout: 'two-column',
        components: ['data-table', 'charts', 'stats-cards', 'filters', 'search'],
        interactions: ['drag-drop', 'sorting', 'filtering', 'export', 'bulk-actions']
      },
      designSystem: {
        colorScheme: 'dark',
        spacing: 'comfortable',
        typography: 'minimal',
        animations: 'subtle'
      },
      responsiveBreakpoints: ['sm', 'md', 'lg', 'xl'],
      accessibility: {
        level: 'AA',
        features: ['keyboard-navigation', 'screen-reader', 'high-contrast', 'focus-indicators']
      },
      performance: {
        loadTime: 2.5,
        bundleSize: 150,
        score: 90
      }
    },
    {
      id: 'ecommerce-store',
      name: 'E-commerce Store',  
      category: 'RETAIL',
      complexity: 0.9,
      features: ['product-catalog', 'shopping-cart', 'checkout', 'user-accounts', 'reviews'],
      uiPatterns: {
        navigation: 'header',
        layout: 'grid',
        components: ['product-grid', 'filters', 'cart', 'checkout-flow', 'product-detail'],
        interactions: ['quick-view', 'wishlist', 'compare', 'search', 'recommendations']
      },
      designSystem: {
        colorScheme: 'light',
        spacing: 'comfortable',
        typography: 'editorial',
        animations: 'moderate'
      },
      responsiveBreakpoints: ['sm', 'md', 'lg', 'xl', '2xl'],
      accessibility: {
        level: 'AA',
        features: ['alt-text', 'color-contrast', 'keyboard-navigation', 'aria-labels']
      },
      performance: {
        loadTime: 3.0,
        bundleSize: 200,
        score: 85
      }
    },
    {
      id: 'social-platform',
      name: 'Social Platform',
      category: 'SOCIAL',
      complexity: 1.2,
      features: ['feeds', 'messaging', 'profiles', 'content-creation', 'notifications'],
      uiPatterns: {
        navigation: 'bottom',
        layout: 'single-column',
        components: ['feed', 'stories', 'chat', 'profile', 'media-upload'],
        interactions: ['swipe', 'infinite-scroll', 'pull-refresh', 'reactions', 'sharing']
      },
      designSystem: {
        colorScheme: 'system',
        spacing: 'compact',
        typography: 'expressive',
        animations: 'dynamic'
      },
      responsiveBreakpoints: ['sm', 'md', 'lg'],
      accessibility: {
        level: 'AA',
        features: ['voice-over', 'reduce-motion', 'large-text', 'color-blind-friendly']
      },
      performance: {
        loadTime: 2.0,
        bundleSize: 300,
        score: 80
      }
    },
    {
      id: 'fintech-app',
      name: 'Fintech Application',
      category: 'FINANCE',
      complexity: 1.4,
      features: ['transactions', 'account-overview', 'budgeting', 'investments', 'security'],
      uiPatterns: {
        navigation: 'tabs',
        layout: 'single-column',
        components: ['account-cards', 'transaction-list', 'charts', 'quick-actions', 'security-center'],
        interactions: ['biometric-auth', 'quick-transfer', 'goal-tracking', 'spending-insights']
      },
      designSystem: {
        colorScheme: 'dark',
        spacing: 'comfortable',
        typography: 'minimal',
        animations: 'subtle'
      },
      responsiveBreakpoints: ['sm', 'md', 'lg'],
      accessibility: {
        level: 'AAA',
        features: ['voice-control', 'haptic-feedback', 'high-contrast', 'large-touch-targets']
      },
      performance: {
        loadTime: 1.5,
        bundleSize: 120,
        score: 95
      }
    },
    {
      id: 'healthcare-portal',
      name: 'Healthcare Portal',
      category: 'HEALTHCARE',
      complexity: 1.1,
      features: ['appointments', 'medical-records', 'prescriptions', 'telemedicine', 'health-tracking'],
      uiPatterns: {
        navigation: 'sidebar',
        layout: 'two-column',
        components: ['calendar', 'medical-history', 'vitals-dashboard', 'prescription-tracker'],
        interactions: ['appointment-booking', 'document-upload', 'video-calls', 'health-logging']
      },
      designSystem: {
        colorScheme: 'light',
        spacing: 'spacious',
        typography: 'editorial',
        animations: 'subtle'
      },
      responsiveBreakpoints: ['sm', 'md', 'lg', 'xl'],
      accessibility: {
        level: 'AAA',
        features: ['screen-reader', 'voice-navigation', 'motor-impairment-support', 'cognitive-accessibility']
      },
      performance: {
        loadTime: 2.0,
        bundleSize: 180,
        score: 88
      }
    },
    {
      id: 'education-platform',
      name: 'Education Platform',
      category: 'EDUCATION',
      complexity: 1.0,
      features: ['courses', 'progress-tracking', 'assignments', 'discussions', 'certificates'],
      uiPatterns: {
        navigation: 'header',
        layout: 'three-column',
        components: ['course-grid', 'video-player', 'progress-bars', 'quiz-interface', 'discussion-forum'],
        interactions: ['bookmarking', 'note-taking', 'progress-saving', 'collaborative-editing']
      },
      designSystem: {
        colorScheme: 'light',
        spacing: 'comfortable',
        typography: 'editorial',
        animations: 'moderate'
      },
      responsiveBreakpoints: ['sm', 'md', 'lg', 'xl'],
      accessibility: {
        level: 'AA',
        features: ['closed-captions', 'transcript-support', 'dyslexia-friendly', 'keyboard-shortcuts']
      },
      performance: {
        loadTime: 2.8,
        bundleSize: 220,
        score: 82
      }
    }
  ];

  static async getOptimalTemplate(request: TemplateRequest): Promise<MobbinTemplate> {
    // Find the best matching template based on project requirements
    const matchingTemplates = this.templates.filter(template => {
      // Match by category/industry
      const categoryMatch = this.matchesCategory(template, request);
      
      // Match by complexity
      const complexityMatch = Math.abs(template.complexity - request.complexity) <= 0.3;
      
      // Match by features
      const featureMatchScore = this.calculateFeatureMatch(template.features, request.features);
      
      return categoryMatch && complexityMatch && featureMatchScore > 0.3;
    });

    if (matchingTemplates.length === 0) {
      // Return default web application template
      return this.createDefaultTemplate(request);
    }

    // Sort by best match and return top result
    const bestMatch = matchingTemplates.sort((a, b) => {
      const scoreA = this.calculateOverallScore(a, request);
      const scoreB = this.calculateOverallScore(b, request);
      return scoreB - scoreA;
    })[0];

    // Customize template for specific requirements
    return this.customizeTemplate(bestMatch, request);
  }

  static async getTemplatesByCategory(category: string): Promise<MobbinTemplate[]> {
    return this.templates.filter(template => 
      template.category.toLowerCase() === category.toLowerCase()
    );
  }

  static async getAllTemplates(): Promise<MobbinTemplate[]> {
    return [...this.templates];
  }

  static async analyzeUIPatterns(appUrl: string): Promise<{
    patterns: string[];
    components: string[];
    interactions: string[];
    designSystem: any;
    accessibility: any;
    performance: any;
  }> {
    // This would integrate with actual UI analysis tools
    // For now, return simulated analysis based on common patterns
    
    return {
      patterns: [
        'responsive-grid',
        'mobile-first',
        'progressive-disclosure',
        'card-based-layout',
        'sticky-navigation'
      ],
      components: [
        'header-navigation',
        'breadcrumbs',
        'search-filter',
        'data-visualization',
        'call-to-action-buttons',
        'footer-links'
      ],
      interactions: [
        'hover-effects',
        'smooth-scrolling',
        'modal-dialogs',
        'form-validation',
        'loading-states',
        'error-handling'
      ],
      designSystem: {
        colorPalette: ['primary', 'secondary', 'accent', 'neutral'],
        typography: 'system-fonts',
        spacing: 'consistent-scale',
        shadows: 'layered-elevation'
      },
      accessibility: {
        score: 85,
        features: ['alt-text', 'focus-indicators', 'color-contrast'],
        violations: ['missing-aria-labels', 'low-contrast-text']
      },
      performance: {
        lighthouse: 88,
        bundleSize: '2.3MB',
        loadTime: '2.1s',
        coreWebVitals: 'good'
      }
    };
  }

  private static matchesCategory(template: MobbinTemplate, request: TemplateRequest): boolean {
    const projectType = request.projectType?.toLowerCase();
    const category = template.category.toLowerCase();
    
    // Define category mappings
    const categoryMappings: Record<string, string[]> = {
      'business': ['saas', 'dashboard', 'crm', 'erp', 'analytics'],
      'retail': ['ecommerce', 'store', 'marketplace', 'shopping'],
      'social': ['social', 'community', 'messaging', 'networking'],
      'finance': ['fintech', 'banking', 'investment', 'payment', 'crypto'],
      'healthcare': ['medical', 'health', 'wellness', 'telemedicine'],
      'education': ['learning', 'course', 'training', 'academic', 'tutorial']
    };

    return categoryMappings[category]?.some(term => 
      projectType?.includes(term) || request.industry?.toLowerCase().includes(term)
    ) || false;
  }

  private static calculateFeatureMatch(templateFeatures: string[], requestedFeatures: string[]): number {
    if (requestedFeatures.length === 0) return 0.5; // neutral score
    
    const matches = requestedFeatures.filter(feature => 
      templateFeatures.some(templateFeature => 
        templateFeature.toLowerCase().includes(feature.toLowerCase()) ||
        feature.toLowerCase().includes(templateFeature.toLowerCase())
      )
    );
    
    return matches.length / requestedFeatures.length;
  }

  private static calculateOverallScore(template: MobbinTemplate, request: TemplateRequest): number {
    const complexityScore = 1 - Math.abs(template.complexity - request.complexity);
    const featureScore = this.calculateFeatureMatch(template.features, request.features);
    const performanceScore = template.performance.score / 100;
    
    return (complexityScore * 0.3) + (featureScore * 0.4) + (performanceScore * 0.3);
  }

  private static customizeTemplate(template: MobbinTemplate, request: TemplateRequest): MobbinTemplate {
    // Create customized version of template
    const customized = { ...template };
    
    // Adjust features based on request
    customized.features = [
      ...template.features,
      ...request.features.filter(f => !template.features.includes(f))
    ];
    
    // Adjust complexity if needed
    if (Math.abs(template.complexity - request.complexity) > 0.1) {
      customized.complexity = (template.complexity + request.complexity) / 2;
    }
    
    // Customize for device targets
    if (request.deviceTargets) {
      if (request.deviceTargets.includes('mobile')) {
        customized.uiPatterns.navigation = 'bottom';
        customized.designSystem.spacing = 'compact';
      }
      if (request.deviceTargets.includes('desktop')) {
        customized.uiPatterns.navigation = 'sidebar';
        customized.designSystem.spacing = 'comfortable';
      }
    }
    
    return customized;
  }

  private static createDefaultTemplate(request: TemplateRequest): MobbinTemplate {
    return {
      id: 'default-web-app',
      name: 'Default Web Application',
      category: 'GENERAL',
      complexity: request.complexity,
      features: request.features,
      uiPatterns: {
        navigation: 'header',
        layout: 'single-column',
        components: ['header', 'main-content', 'sidebar', 'footer'],
        interactions: ['navigation', 'forms', 'buttons']
      },
      designSystem: {
        colorScheme: 'system',
        spacing: 'comfortable',
        typography: 'minimal',
        animations: 'subtle'
      },
      responsiveBreakpoints: ['sm', 'md', 'lg', 'xl'],
      accessibility: {
        level: 'AA',
        features: ['keyboard-navigation', 'screen-reader', 'color-contrast']
      },
      performance: {
        loadTime: 2.5,
        bundleSize: 150,
        score: 85
      }
    };
  }

  static generateTemplateCode(template: MobbinTemplate, projectDetails: any): {
    components: string[];
    styles: string;
    layout: string;
    navigation: string;
  } {
    return {
      components: this.generateComponentList(template),
      styles: this.generateStyleSystem(template),
      layout: this.generateLayoutStructure(template),
      navigation: this.generateNavigationStructure(template)
    };
  }

  private static generateComponentList(template: MobbinTemplate): string[] {
    const baseComponents = [
      'ECEHeader',
      'ECEFooter',
      'ECEWalletConnect',
      'GlassCard',
      'Button'
    ];

    const templateComponents = template.uiPatterns.components.map(component => {
      return `ECE${component.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join('')}`;
    });

    return [...baseComponents, ...templateComponents];
  }

  private static generateStyleSystem(template: MobbinTemplate): string {
    const { designSystem } = template;
    
    return `
// ECE Template Styles - ${template.name}
// Design System: ${designSystem.colorScheme} theme, ${designSystem.spacing} spacing

:root {
  --ece-spacing-scale: ${designSystem.spacing === 'compact' ? '0.75' : designSystem.spacing === 'spacious' ? '1.25' : '1'};
  --ece-animation-duration: ${designSystem.animations === 'subtle' ? '150ms' : designSystem.animations === 'dynamic' ? '500ms' : '300ms'};
}

.ece-template-${template.id} {
  /* Base layout styles */
  min-height: 100vh;
  background: var(--ece-bg-gradient);
}

.ece-navigation-${template.uiPatterns.navigation} {
  /* Navigation styles based on pattern */
  ${this.getNavigationStyles(template.uiPatterns.navigation)}
}

.ece-layout-${template.uiPatterns.layout} {
  /* Layout styles based on pattern */
  ${this.getLayoutStyles(template.uiPatterns.layout)}
}
    `;
  }

  private static generateLayoutStructure(template: MobbinTemplate): string {
    switch (template.uiPatterns.layout) {
      case 'two-column':
        return `
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <div className="lg:col-span-1">
    <ECESidebar />
  </div>
  <div className="lg:col-span-3">
    <ECEMainContent />
  </div>
</div>`;
      
      case 'three-column':
        return `
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  <div className="lg:col-span-2">
    <ECESidebar />
  </div>
  <div className="lg:col-span-8">
    <ECEMainContent />
  </div>
  <div className="lg:col-span-2">
    <ECEAsideContent />
  </div>
</div>`;
      
      case 'grid':
        return `
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <ECEGridItems />
</div>`;
      
      default:
        return `
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <ECEMainContent />
</div>`;
    }
  }

  private static generateNavigationStructure(template: MobbinTemplate): string {
    switch (template.uiPatterns.navigation) {
      case 'sidebar':
        return `
<nav className="fixed left-0 top-0 h-full w-64 bg-gray-900/80 backdrop-blur-sm">
  <ECESidebarNav />
</nav>`;
      
      case 'bottom':
        return `
<nav className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
  <ECEBottomNav />
</nav>`;
      
      case 'tabs':
        return `
<nav className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg">
  <ECETabNav />
</nav>`;
      
      default:
        return `
<nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
  <ECEHeaderNav />
</nav>`;
    }
  }

  private static getNavigationStyles(navType: string): string {
    switch (navType) {
      case 'sidebar':
        return `
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 16rem;
  z-index: 40;`;
      
      case 'bottom':
        return `
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;`;
      
      default:
        return `
  position: sticky;
  top: 0;
  z-index: 50;`;
    }
  }

  private static getLayoutStyles(layoutType: string): string {
    switch (layoutType) {
      case 'two-column':
        return `
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;`;
      
      case 'three-column':
        return `
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2rem;`;
      
      case 'grid':
        return `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;`;
      
      default:
        return `
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;`;
    }
  }
}
