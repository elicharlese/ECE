/**
 * ECE Branding Schema - STRICT COMPLIANCE REQUIRED
 * All generated applications MUST adhere to these standards
 * Any deviation will result in generation failure
 */

export interface ECEBrandingSchema {
  version: string;
  compliance: {
    level: 'STRICT' | 'ENFORCED' | 'MANDATORY';
    violations: {
      allowedCount: number;
      severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: {
      primary: string;
      secondary: string;
      gradient: string[];
    };
    text: {
      primary: string;
      secondary: string;
      accent: string;
      muted: string;
    };
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      monospace: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      extrabold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    unit: number; // Base spacing unit in pixels
    scale: number[]; // Multipliers for consistent spacing
  };
  borderRadius: {
    none: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    inner: string;
    glow: string;
  };
  logo: {
    url: string;
    alt: string;
    dimensions: {
      width: number;
      height: number;
    };
    variants: {
      light: string;
      dark: string;
      icon: string;
      wordmark: string;
    };
  };
  layout: {
    headerHeight: string;
    footerHeight: string;
    sidebarWidth: string;
    containerMaxWidth: string;
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
  };
  components: {
    button: {
      variants: ('primary' | 'secondary' | 'outline' | 'ghost' | 'destructive')[];
      sizes: ('sm' | 'base' | 'lg' | 'xl')[];
      required: boolean;
    };
    card: {
      variants: ('glass' | 'solid' | 'outlined' | 'elevated')[];
      required: boolean;
    };
    navigation: {
      style: 'header' | 'sidebar' | 'bottom' | 'tabs';
      required: boolean;
    };
    footer: {
      style: 'minimal' | 'extended' | 'social';
      required: boolean;
      mustInclude: string[]; // Required footer elements
    };
  };
  animations: {
    durations: {
      fast: string;
      normal: string;
      slow: string;
    };
    easings: {
      in: string;
      out: string;
      inOut: string;
    };
    transitions: {
      hover: string;
      focus: string;
      active: string;
    };
  };
  accessibility: {
    contrast: {
      minimum: number; // WCAG AA compliance
      enhanced: number; // WCAG AAA compliance
    };
    focusIndicators: {
      required: boolean;
      style: string;
    };
    screenReader: {
      required: boolean;
      labels: string[];
    };
  };
  security: {
    csp: {
      required: boolean;
      directives: string[];
    };
    headers: {
      required: string[];
    };
    auth: {
      provider: 'thirdweb';
      required: boolean;
    };
  };
}

export const ECE_DEFAULT_BRANDING_SCHEMA: ECEBrandingSchema = {
  version: '2.0.0',
  compliance: {
    level: 'STRICT',
    violations: {
      allowedCount: 0,
      severity: 'CRITICAL'
    }
  },
  colors: {
    primary: '#3B82F6', // Blue 500
    secondary: '#8B5CF6', // Purple 500
    accent: '#06B6D4', // Cyan 500
    background: {
      primary: '#0F172A', // Slate 900
      secondary: '#1E293B', // Slate 800
      gradient: [
        'from-gray-900',
        'via-blue-900/20',
        'to-purple-900/20'
      ]
    },
    text: {
      primary: '#F8FAFC', // Slate 50
      secondary: '#CBD5E1', // Slate 300
      accent: '#38BDF8', // Sky 400
      muted: '#64748B' // Slate 500
    },
    success: '#10B981', // Emerald 500
    warning: '#F59E0B', // Amber 500
    error: '#EF4444', // Red 500
    info: '#3B82F6' // Blue 500
  },
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'JetBrains Mono, monospace',
      monospace: 'Fira Code, Consolas, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  spacing: {
    unit: 4, // 4px base unit
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64]
  },
  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    glow: '0 0 20px rgb(59 130 246 / 0.5)'
  },
  logo: {
    url: '/api/branding/logo',
    alt: 'ECE Platform',
    dimensions: {
      width: 120,
      height: 32
    },
    variants: {
      light: '/api/branding/logo/light',
      dark: '/api/branding/logo/dark',
      icon: '/api/branding/logo/icon',
      wordmark: '/api/branding/logo/wordmark'
    }
  },
  layout: {
    headerHeight: '4rem',
    footerHeight: '6rem',
    sidebarWidth: '16rem',
    containerMaxWidth: '1280px',
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  },
  components: {
    button: {
      variants: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      sizes: ['sm', 'base', 'lg', 'xl'],
      required: true
    },
    card: {
      variants: ['glass', 'solid', 'outlined', 'elevated'],
      required: true
    },
    navigation: {
      style: 'header',
      required: true
    },
    footer: {
      style: 'minimal',
      required: true,
      mustInclude: [
        'Powered by ECE Platform',
        'Built with ECE Standards',
        'ThirdWeb Authentication'
      ]
    }
  },
  animations: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easings: {
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    transitions: {
      hover: 'all 150ms cubic-bezier(0, 0, 0.2, 1)',
      focus: 'all 150ms cubic-bezier(0, 0, 0.2, 1)',
      active: 'all 100ms cubic-bezier(0, 0, 0.2, 1)'
    }
  },
  accessibility: {
    contrast: {
      minimum: 4.5, // WCAG AA
      enhanced: 7.0 // WCAG AAA
    },
    focusIndicators: {
      required: true,
      style: '2px solid #3B82F6'
    },
    screenReader: {
      required: true,
      labels: [
        'Skip to main content',
        'Main navigation',
        'Search',
        'User menu',
        'Close dialog'
      ]
    }
  },
  security: {
    csp: {
      required: true,
      directives: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://embed.thirdweb.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' https://api.thirdweb.com wss://ws.thirdweb.com"
      ]
    },
    headers: [
      'X-Frame-Options: DENY',
      'X-Content-Type-Options: nosniff',
      'Referrer-Policy: strict-origin-when-cross-origin',
      'Permissions-Policy: camera=(), microphone=(), geolocation=()'
    ],
    auth: {
      provider: 'thirdweb',
      required: true
    }
  }
};

export class ECEBrandingValidator {
  
  static validateCompliance(generatedCode: string, schema: ECEBrandingSchema = ECE_DEFAULT_BRANDING_SCHEMA): {
    isCompliant: boolean;
    violations: Array<{
      type: string;
      severity: string;
      message: string;
      line?: number;
    }>;
    score: number;
  } {
    const violations: Array<{
      type: string;
      severity: string;
      message: string;
      line?: number;
    }> = [];

    // Check for required ECE components
    this.validateRequiredComponents(generatedCode, schema, violations);
    
    // Check color usage
    this.validateColorUsage(generatedCode, schema, violations);
    
    // Check typography compliance
    this.validateTypography(generatedCode, schema, violations);
    
    // Check layout compliance
    this.validateLayout(generatedCode, schema, violations);
    
    // Check security compliance
    this.validateSecurity(generatedCode, schema, violations);
    
    // Check accessibility compliance
    this.validateAccessibility(generatedCode, schema, violations);

    const criticalViolations = violations.filter(v => v.severity === 'CRITICAL').length;
    const isCompliant = criticalViolations === 0 && violations.length <= schema.compliance.violations.allowedCount;
    const score = Math.max(0, 100 - (violations.length * 10) - (criticalViolations * 50));

    return {
      isCompliant,
      violations,
      score
    };
  }

  private static validateRequiredComponents(code: string, schema: ECEBrandingSchema, violations: any[]): void {
    // Check for ECE Header
    if (!code.includes('ECEHeader') && !code.includes('<ECEHeader')) {
      violations.push({
        type: 'MISSING_COMPONENT',
        severity: 'CRITICAL',
        message: 'ECE Header component is required but missing'
      });
    }

    // Check for ECE Footer
    if (!code.includes('ECEFooter') && !code.includes('<ECEFooter')) {
      violations.push({
        type: 'MISSING_COMPONENT',
        severity: 'CRITICAL',
        message: 'ECE Footer component is required but missing'
      });
    }

    // Check for ThirdWeb Provider
    if (!code.includes('ThirdWebProvider') && !code.includes('ThirdwebProvider')) {
      violations.push({
        type: 'MISSING_AUTH',
        severity: 'CRITICAL',  
        message: 'ThirdWeb Provider is required for authentication'
      });
    }

    // Check for ECE branding config
    if (!code.includes('ECE_BRANDING_CONFIG')) {
      violations.push({
        type: 'MISSING_BRANDING',
        severity: 'CRITICAL',
        message: 'ECE branding configuration is required'
      });
    }
  }

  private static validateColorUsage(code: string, schema: ECEBrandingSchema, violations: any[]): void {
    // Check if hardcoded colors are used instead of schema colors
    const hardcodedColorRegex = /#[0-9a-fA-F]{6}|rgb\(|rgba\(/g;
    const matches = code.match(hardcodedColorRegex);
    
    if (matches && matches.length > 0) {
      violations.push({
        type: 'HARDCODED_COLORS',
        severity: 'HIGH',
        message: `Found ${matches.length} hardcoded colors. Use ECE branding schema colors instead.`
      });
    }
  }

  private static validateTypography(code: string, schema: ECEBrandingSchema, violations: any[]): void {
    // Check for hardcoded font families
    if (code.includes('font-family:') && !code.includes(schema.typography.fontFamily.primary)) {
      violations.push({
        type: 'INVALID_TYPOGRAPHY',
        severity: 'MEDIUM',
        message: 'Custom font families detected. Use ECE typography schema.'
      });
    }
  }

  private static validateLayout(code: string, schema: ECEBrandingSchema, violations: any[]): void {
    // Check for proper container max-width usage
    if (!code.includes('container') && !code.includes('max-w-')) {
      violations.push({
        type: 'LAYOUT_VIOLATION',
        severity: 'MEDIUM',
        message: 'Proper container layouts are required for consistency'
      });
    }
  }

  private static validateSecurity(code: string, schema: ECEBrandingSchema, violations: any[]): void {
    // Check for ECE security middleware
    if (code.includes('express') && !code.includes('ECESecurityMiddleware')) {
      violations.push({
        type: 'MISSING_SECURITY',
        severity: 'CRITICAL',
        message: 'ECE Security Middleware is required for all backend code'
      });
    }

    // Check for proper auth middleware
    if (code.includes('/api/') && !code.includes('ECEAuthMiddleware')) {
      violations.push({
        type: 'MISSING_AUTH_MIDDLEWARE',
        severity: 'CRITICAL',
        message: 'ECE Auth Middleware is required for all API routes'
      });
    }
  }

  private static validateAccessibility(code: string, schema: ECEBrandingSchema, violations: any[]): void {
    // Check for alt attributes on images
    if (code.includes('<img') && !code.includes('alt=')) {
      violations.push({
        type: 'ACCESSIBILITY_VIOLATION',
        severity: 'HIGH',
        message: 'All images must have alt attributes for accessibility'
      });
    }

    // Check for aria labels
    if (code.includes('button') && !code.includes('aria-label')) {
      violations.push({
        type: 'ACCESSIBILITY_VIOLATION',
        severity: 'MEDIUM',
        message: 'Interactive elements should have proper ARIA labels'
      });
    }
  }

  static generateComplianceReport(validation: ReturnType<typeof ECEBrandingValidator.validateCompliance>): string {
    const { isCompliant, violations, score } = validation;
    
    let report = `
# ECE Branding Compliance Report

**Overall Score:** ${score}/100
**Compliance Status:** ${isCompliant ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}
**Total Violations:** ${violations.length}

## Violation Summary
`;

    const violationsBySeverity = violations.reduce((acc, violation) => {
      acc[violation.severity] = (acc[violation.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(violationsBySeverity).forEach(([severity, count]) => {
      report += `- **${severity}:** ${count}\n`;
    });

    if (violations.length > 0) {
      report += `\n## Detailed Violations\n`;
      violations.forEach((violation, index) => {
        report += `
### ${index + 1}. ${violation.type}
- **Severity:** ${violation.severity}
- **Message:** ${violation.message}
${violation.line ? `- **Line:** ${violation.line}` : ''}
`;
      });
    }

    report += `
## Compliance Requirements
- ECE Header and Footer components are mandatory
- ThirdWeb authentication provider must be included
- Use ECE branding schema colors and typography
- Include ECE security and auth middleware
- Follow accessibility guidelines (WCAG AA minimum)
- All generated apps must display "Powered by ECE Platform"
`;

    return report;
  }
}

export default ECE_DEFAULT_BRANDING_SCHEMA;
