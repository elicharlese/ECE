'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Code, 
  Palette, 
  Rocket, 
  Download,
  Eye,
  Wand2,
  FileText,
  Folder,
  Github,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react'
import { GlassCard } from '../../components/ui/glass-card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'

// Enhanced ECE App Structure with GitHub Copilot Optimization
const ECE_APP_STRUCTURE = {
  folders: [
    'docs',                    // Comprehensive documentation
    'docs/development',        // Development guidelines
    'docs/deployment',         // Deployment instructions
    'docs/api',               // API documentation
    'src/components',         // React components
    'src/components/ui',      // UI component library
    'src/components/3d',      // 3D/Spline components
    'src/pages',              // Application pages
    'src/utils',              // Utility functions
    'src/styles',             // Styling and themes
    'src/assets',             // Static assets
    'src/hooks',              // Custom React hooks
    'src/services',           // API and service layers
    'src/types',              // TypeScript type definitions
    'public',                 // Public static files
    'tests',                  // Testing files
    'tests/components',       // Component tests
    'tests/integration',      // Integration tests
    'tests/e2e',             // End-to-end tests
    '.github/workflows',      // GitHub Actions
    '.vscode'                 // VS Code configuration
  ],
  files: [
    {
      name: 'README.md',
      template: 'ece-readme',
      description: 'ECE standardized README with branding and GitHub Copilot instructions',
      category: 'documentation'
    },
    {
      name: 'package.json',
      template: 'ece-package',
      description: 'Package configuration with ECE metadata and optimized scripts',
      category: 'configuration'
    },
    {
      name: 'docs/DEVELOPMENT.md',
      template: 'development-guide',
      description: 'Development guidelines with ECE standards and GitHub Copilot best practices',
      category: 'documentation'
    },
    {
      name: 'docs/DEPLOYMENT.md',
      template: 'deployment-guide',
      description: 'Deployment instructions with ECE infrastructure integration',
      category: 'documentation'
    },
    {
      name: 'docs/GITHUB_COPILOT_INSTRUCTIONS.md',
      template: 'copilot-instructions',
      description: 'Optimized instructions for GitHub Copilot AI assistance',
      category: 'documentation'
    },
    {
      name: '.github/workflows/ci.yml',
      template: 'github-ci',
      description: 'GitHub Actions CI/CD pipeline with ECE quality standards',
      category: 'configuration'
    },
    {
      name: '.vscode/settings.json',
      template: 'vscode-settings',
      description: 'VS Code settings optimized for ECE development and GitHub Copilot',
      category: 'configuration'
    },
    {
      name: 'tailwind.config.js',
      template: 'ece-tailwind',
      description: 'Tailwind configuration with Beach Monokai theme integration',
      category: 'configuration'
    },
    {
      name: 'src/components/ECEButton.tsx',
      template: 'ece-button',
      description: 'Standardized ECE button component with Beach Monokai styling',
      category: 'component'
    },
    {
      name: 'src/styles/globals.css',
      template: 'ece-globals',
      description: 'Global styles with ECE theming and CSS variables',
      category: 'styling'
    },
    {
      name: 'docs/ECE_BRAND_COMPLIANCE.md',
      template: 'brand-compliance',
      description: 'ECE brand compliance checklist and guidelines',
      category: 'documentation'
    },
    {
      name: 'CHANGELOG.md',
      template: 'changelog',
      description: 'Version changelog following ECE standards',
      category: 'documentation'
    }
  ],
  templates: {
    'ece-readme': `# ECE Trading Cards - {{APP_NAME}}

{{APP_DESCRIPTION}}

## 🏖️ Beach Monokai Theme Integration

This application follows ECE's standardized Beach Monokai color system and branding guidelines.

### 🎨 Color Palette
- **Primary**: #F8EFD6 (Light backgrounds, primary text)
- **Dark**: #272822 (Main background, dark canvas)
- **Accent**: #F92672 (Buttons, highlights, alerts)
- **Success**: #A6E22E (Success states, positive actions)
- **Info**: #66D9EF (Info states, links, sky themes)
- **Warning**: #E6DB74 (Warning states, caution)
- **Error**: #FD5C63 (Error states, destructive actions)

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── components/          # Reusable UI components with ECE branding
├── components/ui/       # Standardized UI component library
├── components/3d/       # 3D/Spline integration components
├── pages/              # Application pages and routing
├── utils/              # Utility functions and helpers
├── styles/             # Styling and Beach Monokai theme
├── hooks/              # Custom React hooks
├── services/           # API and external service integrations
└── types/              # TypeScript type definitions
\`\`\`

## 🎯 ECE Standards Compliance

This project follows ECE development standards:

- ✅ **Beach Monokai Theme**: Consistent color palette and visual design
- ✅ **TypeScript**: Full type safety and modern development practices
- ✅ **Performance**: Optimized for speed and efficiency
- ✅ **Accessibility**: WCAG 2.1 AA compliance
- ✅ **Security**: Best practices for authentication and data protection
- ✅ **3D Integration**: Spline 3D support with fallback systems
- ✅ **GitHub Copilot**: Optimized code structure for AI assistance

## 🧪 Quality Assurance

\`\`\`bash
# Code quality checks
npm run lint           # ESLint checks
npm run type-check     # TypeScript validation
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests

# Build and deployment
npm run build          # Production build
npm run start          # Production server
\`\`\`

## 🤖 GitHub Copilot Optimization

This project is optimized for GitHub Copilot AI assistance:

- **Structured Comments**: Clear function and component descriptions
- **Type Definitions**: Comprehensive TypeScript interfaces
- **Naming Conventions**: Descriptive and consistent naming
- **Code Organization**: Logical file and folder structure
- **Documentation**: Inline comments and comprehensive guides

## 📚 Documentation

- [Development Guide](docs/DEVELOPMENT.md) - Setup and development workflow
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions
- [GitHub Copilot Instructions](docs/GITHUB_COPILOT_INSTRUCTIONS.md) - AI assistance optimization
- [Brand Compliance](docs/ECE_BRAND_COMPLIANCE.md) - ECE branding guidelines

## 🤝 Contributing

1. Follow ECE coding standards and branding guidelines
2. Use GitHub Copilot for enhanced development productivity
3. Ensure accessibility and performance compliance
4. Add comprehensive tests for new features
5. Update documentation for significant changes

## 🔧 Technology Stack

{{TECH_STACK}}

## 📈 Performance Targets

- **Lighthouse Score**: >90 across all metrics
- **Page Load Time**: <3 seconds
- **3D Rendering**: 60fps on target devices
- **Bundle Size**: Optimized with code splitting
- **Accessibility**: WCAG 2.1 AA compliance

---

**Created with ❤️ by ECE Development Team**  
**Powered by GitHub Copilot AI Assistance**

*Elite Card Exchange - Where Innovation Meets Excellence*`,

    'copilot-instructions': `# GitHub Copilot Instructions for {{APP_NAME}}

## 🤖 AI-Assisted Development Guidelines

This document provides optimized instructions for GitHub Copilot to enhance development productivity and code quality for ECE Trading Cards applications.

### 🎯 Project Context

**Application Type**: {{APP_TYPE}}
**Framework**: {{FRAMEWORK}}
**Styling**: Tailwind CSS with Beach Monokai theme
**Architecture**: {{ARCHITECTURE}}

### 🏗️ Code Structure Guidelines

#### Component Development
When creating React components:
- Use TypeScript with strict typing
- Follow ECE naming conventions (PascalCase for components)
- Include comprehensive JSDoc comments
- Implement Beach Monokai color variables
- Add accessibility attributes (ARIA labels, roles)
- Include error boundaries and loading states

#### Styling Standards
- Use Tailwind CSS classes with ECE color palette
- Implement glassmorphism effects with backdrop-blur
- Ensure responsive design (mobile-first approach)
- Add smooth animations with Framer Motion
- Follow 8px grid system for spacing

#### API Integration
- Use TypeScript interfaces for all API responses
- Implement proper error handling with user-friendly messages
- Add loading states and optimistic updates
- Include retry logic for failed requests
- Use React Query for caching and synchronization

#### 3D Integration
- Implement Spline 3D components with fallback systems
- Add performance monitoring and adaptive quality
- Include mobile optimization and battery considerations
- Provide accessibility alternatives for 3D content

### 🎨 ECE Design System

#### Color Palette
Use these Tailwind classes for consistent theming:

\`\`\`css
/* Primary Colors */
bg-[#F8EFD6]  /* Light background */
bg-[#272822]  /* Dark background */
text-[#F8EFD6] /* Primary text */
text-[#75715E] /* Muted text */

/* Accent Colors */
bg-[#F92672]  /* Accent/Pink */
bg-[#A6E22E]  /* Success/Green */
bg-[#66D9EF]  /* Info/Blue */
bg-[#E6DB74]  /* Warning/Yellow */
bg-[#FD5C63]  /* Error/Red */
\`\`\`

#### Component Patterns
- Use GlassCard for container elements
- Implement hover states with scale transformations
- Add loading spinners with ECE branding
- Include proper focus management for accessibility

### 🧪 Testing Guidelines

#### Unit Tests
- Test all component props and state changes
- Mock external dependencies and APIs
- Include accessibility testing with @testing-library
- Test error scenarios and edge cases

#### Integration Tests
- Test complete user workflows
- Verify API integrations and data flow
- Test responsive design across devices
- Validate 3D fallback systems

### 🚀 Performance Optimization

#### Code Splitting
- Lazy load routes and heavy components
- Split vendor bundles appropriately
- Implement progressive loading for 3D assets
- Use dynamic imports for conditional features

#### Image Optimization
- Use Next.js Image component with optimization
- Implement responsive images with srcset
- Add proper alt text for accessibility
- Use WebP format with fallbacks

### 🔒 Security Best Practices

#### Authentication
- Implement proper JWT token handling
- Add CSRF protection for forms
- Validate all user inputs on client and server
- Use secure HTTP headers

#### Data Protection
- Sanitize user inputs to prevent XSS
- Implement proper authorization checks
- Use environment variables for sensitive data
- Add rate limiting for API endpoints

### 📱 Mobile Optimization

#### Responsive Design
- Use mobile-first CSS approach
- Implement touch-friendly interface elements
- Add haptic feedback for mobile interactions
- Optimize 3D performance for mobile devices

#### Progressive Web App
- Add service worker for offline functionality
- Implement app manifest for installation
- Add push notification support
- Optimize for various screen sizes and orientations

### 🔧 Development Workflow

#### Git Commit Messages
Follow ECE commit message conventions:
- feat: new feature implementation
- fix: bug fixes and corrections
- docs: documentation updates
- style: code formatting and style changes
- refactor: code restructuring without functionality changes
- test: adding or updating tests
- chore: maintenance and configuration updates

#### Code Review Checklist
- [ ] TypeScript strict mode compliance
- [ ] ECE branding guidelines followed
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Performance optimizations implemented
- [ ] Security best practices followed
- [ ] Tests added for new functionality
- [ ] Documentation updated

### 🎯 GitHub Copilot Prompts

Use these optimized prompts for better AI assistance:

#### Component Creation
"Create a TypeScript React component with ECE branding that [specific functionality] using Tailwind CSS and Framer Motion animations"

#### API Integration
"Implement a TypeScript service for [API endpoint] with proper error handling, loading states, and ECE user feedback patterns"

#### Testing
"Write comprehensive tests for [component/function] including edge cases, accessibility, and ECE-specific functionality"

#### 3D Integration
"Create a Spline 3D component with performance optimization, mobile support, and accessibility fallbacks following ECE standards"

### 📈 Performance Monitoring

Track these key metrics:
- Lighthouse scores (aim for >90)
- Core Web Vitals (LCP, FID, CLS)
- Bundle size and loading times
- 3D rendering performance (aim for 60fps)
- Mobile performance and battery usage

---

**Last Updated**: {{CURRENT_DATE}}
**ECE Standards Version**: 2.1
**GitHub Copilot Compatibility**: Optimized

*This document ensures consistent, high-quality code generation with GitHub Copilot assistance while maintaining ECE standards and branding guidelines.*`
  }
}
    },
    {
      name: 'docs/DEPLOYMENT.md',
      template: 'ece-deployment',
      description: 'Standardized deployment guide'
    },
    {
      name: 'docs/DEVELOPMENT.md',
      template: 'ece-development',
      description: 'Development setup and guidelines'
    },
    {
      name: '.github/COPILOT_INSTRUCTIONS.md',
      template: 'ece-copilot',
      description: 'GitHub Copilot optimization instructions'
    }
  ],
  branding: {
    colors: {
      primary: '#F92672',
      secondary: '#A6E22E',
      accent: '#66D9EF',
      background: '#272822',
      text: '#F8EFD6'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    logo: 'ECE Trading Cards',
    tagline: 'Elite Card Exchange'
  }
}

interface AppTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  techStack: string[]
  features: string[]
  complexity: 'simple' | 'medium' | 'complex'
  estimatedTime: string
  preview?: string
}

// Enhanced ECE App Templates with GitHub Copilot Optimization
const APP_TEMPLATES = {
  'trading-dashboard': {
    name: 'Trading Dashboard',
    description: 'Advanced trading interface with ECE branding and 3D card displays',
    icon: '📊',
    gradient: 'from-[#F92672] to-[#FD5C63]',
    features: ['Real-time Data', '3D Card Views', 'Analytics', 'ECE Wallet Integration', 'Beach Monokai Theme'],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Spline 3D'],
    complexity: 'Advanced',
    estimatedTime: '4-6 weeks',
    copilotOptimized: true,
    eceCompliant: true
  },
  'mobile-app': {
    name: 'Mobile Trading App',
    description: 'React Native app with ECE branding and cross-platform compatibility',
    icon: '📱',
    gradient: 'from-[#A6E22E] to-[#3EBA7C]',
    features: ['Native Performance', 'Push Notifications', 'Biometric Auth', 'Offline Support', 'ECE Integration'],
    techStack: ['React Native', 'TypeScript', 'React Navigation', 'AsyncStorage', 'ECE API'],
    complexity: 'Advanced',
    estimatedTime: '6-8 weeks',
    copilotOptimized: true,
    eceCompliant: true
  },
  'landing-page': {
    name: 'Marketing Landing Page',
    description: 'High-converting landing page with ECE branding and 3D hero sections',
    icon: '🌊',
    gradient: 'from-[#66D9EF] to-[#819AFF]',
    features: ['3D Hero Section', 'Conversion Optimization', 'SEO Ready', 'Performance Optimized', 'ECE Branding'],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Spline 3D', 'Framer Motion'],
    complexity: 'Intermediate',
    estimatedTime: '2-3 weeks',
    copilotOptimized: true,
    eceCompliant: true
  },
  'admin-panel': {
    name: 'Admin Management Panel',
    description: 'Comprehensive admin interface with ECE security and branding standards',
    icon: '⚙️',
    gradient: 'from-[#E6DB74] to-[#F8EFD6]',
    features: ['User Management', 'Analytics Dashboard', 'Content Management', 'Security Controls', 'ECE Integration'],
    techStack: ['Next.js', 'TypeScript', 'Prisma', 'NextAuth', 'Radix UI'],
    complexity: 'Advanced',
    estimatedTime: '5-7 weeks',
    copilotOptimized: true,
    eceCompliant: true
  },
  'api-service': {
    name: 'Backend API Service',
    description: 'Scalable API service with ECE authentication and database integration',
    icon: '🔗',
    gradient: 'from-[#819AFF] to-[#7B1FA2]',
    features: ['RESTful API', 'GraphQL Support', 'Authentication', 'Rate Limiting', 'ECE Database'],
    techStack: ['Node.js', 'TypeScript', 'Express', 'Prisma', 'JWT'],
    complexity: 'Advanced',
    estimatedTime: '4-5 weeks',
    copilotOptimized: true,
    eceCompliant: true
  },
  'custom-app': {
    name: 'Custom Application',
    description: 'Fully customizable app with ECE standards and GitHub Copilot optimization',
    icon: '🎨',
    gradient: 'from-[#F92672] to-[#E6DB74]',
    features: ['Custom Requirements', 'ECE Branding', 'Flexible Architecture', 'Performance Optimized', 'AI Enhanced'],
    techStack: ['Configurable', 'TypeScript', 'ECE Standards', 'GitHub Copilot', 'Best Practices'],
    complexity: 'Variable',
    estimatedTime: '2-8 weeks',
    copilotOptimized: true,
    eceCompliant: true
  }
}export default function AIAppGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<AppTemplate | null>(null)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [customFeatures, setCustomFeatures] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedApp, setGeneratedApp] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [showPreview, setShowPreview] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerate = async () => {
    if (!selectedTemplate || !projectName) return

    setIsGenerating(true)
    
    // Simulate app generation process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const generatedAppData = {
      name: projectName,
      description: projectDescription,
      template: selectedTemplate,
      structure: ECE_APP_STRUCTURE,
      generatedFiles: generateAppFiles(),
      downloadUrl: '#',
      previewUrl: '#',
      timestamp: new Date().toISOString()
    }
    
    setGeneratedApp(generatedAppData)
    setIsGenerating(false)
    setCurrentStep(3)
  }

  const generateAppFiles = () => {
    return [
      {
        path: 'README.md',
        content: generateReadmeContent(),
        type: 'markdown'
      },
      {
        path: 'package.json',
        content: generatePackageJson(),
        type: 'json'
      },
      {
        path: 'src/App.tsx',
        content: generateAppComponent(),
        type: 'typescript'
      },
      {
        path: 'docs/DEPLOYMENT.md',
        content: generateDeploymentDocs(),
        type: 'markdown'
      },
      {
        path: '.github/COPILOT_INSTRUCTIONS.md',
        content: generateCopilotInstructions(),
        type: 'markdown'
      }
    ]
  }

  const generateReadmeContent = () => {
    return `# ${projectName}

${projectDescription}

## 🚀 Built with ECE Standards

This application follows ECE Trading Cards' standardized development practices and branding guidelines.

### 🎯 Features

${selectedTemplate?.features.map(feature => `- ${feature}`).join('\n')}
${customFeatures ? `\n### 🔧 Custom Features\n\n${customFeatures.split('\n').map(f => `- ${f}`).join('\n')}` : ''}

### 🛠️ Tech Stack

${selectedTemplate?.techStack.map(tech => `- ${tech}`).join('\n')}

### 📦 ECE Branding

This project maintains ECE Trading Cards branding:
- **Colors**: Beach Monokai theme (#F92672, #A6E22E, #66D9EF, #272822)
- **Typography**: Inter font family
- **Logo**: ECE Trading Cards - Elite Card Exchange
- **Voice**: Professional, innovative, collector-focused

### 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

### 📚 Documentation

- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Development Setup](./docs/DEVELOPMENT.md)
- [ECE Standards](./docs/ECE_STANDARDS.md)

### 🤝 Contributing

This project follows ECE Trading Cards development standards. Please read our contributing guidelines before submitting pull requests.

### 📄 License

© ${new Date().getFullYear()} ECE Trading Cards. All rights reserved.

---

**Generated by ECE AI App Generator** | [ECE Trading Cards](https://ece-cards.com)
`
  }

  const generatePackageJson = () => {
    return JSON.stringify({
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: projectDescription,
      main: 'src/index.js',
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
        test: 'jest'
      },
      dependencies: {
        'react': '^18.0.0',
        'react-dom': '^18.0.0',
        'next': '^14.0.0',
        '@types/react': '^18.0.0',
        'tailwindcss': '^3.0.0',
        'framer-motion': '^10.0.0'
      },
      keywords: [
        'ece-trading-cards',
        'digital-cards',
        'trading',
        'marketplace',
        selectedTemplate?.id || 'app'
      ],
      author: 'ECE Trading Cards',
      license: 'PROPRIETARY',
      repository: {
        type: 'git',
        url: 'https://github.com/ece-trading-cards/' + projectName.toLowerCase().replace(/\s+/g, '-')
      },
      homepage: 'https://ece-cards.com',
      ece: {
        template: selectedTemplate?.id,
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        branding: ECE_APP_STRUCTURE.branding
      }
    }, null, 2)
  }

  const generateAppComponent = () => {
    return `import React from 'react';
import { motion } from 'framer-motion';

// ECE Trading Cards - ${projectName}
// Generated with ECE AI App Generator
// Follows ECE branding and development standards

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] to-[#3E3D32]">
      {/* ECE Branding Header */}
      <header className="py-6 px-4">
        <div className="container mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#F92672] to-[#66D9EF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#F8EFD6]">${projectName}</h1>
              <p className="text-[#75715E] text-sm">Powered by ECE Trading Cards</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-[#F8EFD6] mb-4">
            Welcome to ${projectName}
          </h2>
          <p className="text-[#75715E] text-lg mb-8 max-w-2xl mx-auto">
            ${projectDescription}
          </p>
          
          {/* ECE Styled Components */}
          <div className="grid md:grid-cols-3 gap-6">
            ${selectedTemplate?.features.map((feature, index) => `
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h3 className="text-[#66D9EF] font-semibold mb-2">${feature}</h3>
              <p className="text-[#75715E] text-sm">Feature description here</p>
            </div>`).join('')}
          </div>
        </motion.div>
      </main>

      {/* ECE Footer */}
      <footer className="py-6 text-center border-t border-[#75715E]/30 mt-12">
        <p className="text-[#75715E] text-sm">
          Built with <span className="text-[#F92672]">♥</span> by ECE Trading Cards
        </p>
      </footer>
    </div>
  );
}`
  }

  const generateDeploymentDocs = () => {
    return `# Deployment Guide - ${projectName}

## ECE Standardized Deployment Process

This document outlines the standardized deployment process for ECE Trading Cards applications.

### 🚀 Quick Deploy

\`\`\`bash
# 1. Build the application
npm run build

# 2. Test the build locally
npm run start

# 3. Deploy to production
npm run deploy
\`\`\`

### 🌐 Platform Support

#### Vercel (Recommended)
- Automatic deployments from GitHub
- ECE custom domain configuration
- Environment variables setup

#### Netlify
- Build command: \`npm run build\`
- Publish directory: \`out\`

#### Docker
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### 🔐 Environment Variables

Required environment variables:
- \`NEXT_PUBLIC_ECE_API_URL\`
- \`NEXT_PUBLIC_ECE_BRAND_TOKEN\`
- \`DATABASE_URL\`

### 📊 Monitoring

- Health check endpoint: \`/api/health\`
- Analytics: ECE Analytics integration
- Error tracking: Sentry configuration

### 🎯 ECE Standards Compliance

- All deployments must include ECE branding
- Analytics tracking required
- Performance monitoring enabled
- Security headers configured

---

**ECE Trading Cards Deployment Standards v1.0**
`
  }

  const generateCopilotInstructions = () => {
    return `# GitHub Copilot Instructions - ${projectName}

## ECE Trading Cards Development Standards

### 🎨 Branding Guidelines
- **Primary Colors**: #F92672 (pink), #A6E22E (green), #66D9EF (blue)
- **Background**: #272822 (dark), #F8EFD6 (light text)
- **Typography**: Inter font family
- **Logo**: "ECE Trading Cards" with tagline "Elite Card Exchange"

### 🏗️ Architecture Patterns
- Use glassmorphism effects with \`backdrop-blur-md\` and transparency
- Implement beach monokai color scheme consistently
- Add GSAP animations for smooth transitions
- Follow responsive design patterns

### 📱 Component Standards
- All components should include ECE branding elements
- Use consistent spacing and typography scales
- Implement proper error boundaries
- Add loading states with ECE styled spinners

### 🔧 Technical Requirements
- TypeScript for all new components
- Tailwind CSS for styling
- Framer Motion for animations
- ESLint configuration following ECE standards

### 📝 Documentation Standards
- All functions must have JSDoc comments
- README files follow ECE template
- Include deployment and development guides
- Add contributing guidelines

### 🚀 Performance Standards
- Lighthouse score > 90
- Bundle size optimization
- Image optimization with Next.js
- Lazy loading for heavy components

### 🎯 SEO Requirements
- Meta tags with ECE branding
- Open Graph images
- Structured data markup
- Sitemap generation

### 🔒 Security Standards
- Input validation on all forms
- XSS protection
- CSRF protection
- Rate limiting on APIs

### 📊 Analytics Integration
- ECE Analytics tracking
- Performance monitoring
- Error reporting
- User behavior tracking

---

**Generated by ECE AI App Generator** | Follow these guidelines for consistent ECE branding and development standards.
`
  }

  const complexityColors = {
    simple: 'text-[#A6E22E] bg-[#A6E22E]/20',
    medium: 'text-[#E6DB74] bg-[#E6DB74]/20',
    complex: 'text-[#F92672] bg-[#F92672]/20'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#3E3D32] to-[#272822]">
      {/* Header */}
      <div className="relative pt-8 pb-4">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#F92672] to-[#66D9EF] rounded-lg flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#F8EFD6] to-[#66D9EF] bg-clip-text text-transparent">
                  ECE AI App Generator
                </h1>
                <p className="text-[#75715E] text-sm">Elite Card Exchange - Standardized App Creation</p>
              </div>
            </div>
            <p className="text-[#75715E] max-w-2xl mx-auto">
              Generate production-ready applications with ECE branding, documentation standards, and GitHub Copilot optimization.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  ${currentStep >= step 
                    ? 'bg-gradient-to-r from-[#F92672] to-[#66D9EF] text-white' 
                    : 'bg-[#75715E]/30 text-[#75715E]'
                  }
                `}>
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`
                    w-20 h-1 mx-4
                    ${currentStep > step ? 'bg-gradient-to-r from-[#F92672] to-[#66D9EF]' : 'bg-[#75715E]/30'}
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Template Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#F8EFD6] mb-4">Choose Your App Template</h2>
                  <p className="text-[#75715E]">Select a template that matches your project requirements</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {APP_TEMPLATES.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        cursor-pointer transition-all duration-300
                        ${selectedTemplate?.id === template.id 
                          ? 'ring-2 ring-[#F92672]' 
                          : ''
                        }
                      `}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <GlassCard variant="dark" className="p-6 h-full">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="p-3 bg-gradient-to-r from-[#66D9EF]/20 to-[#66D9EF]/10 rounded-lg">
                            {template.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#F8EFD6] mb-1">{template.name}</h3>
                            <Badge className={`${complexityColors[template.complexity]} border-0 mb-2`}>
                              {template.complexity}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-[#75715E] text-sm mb-4">{template.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="text-[#F8EFD6] font-semibold text-sm mb-2">Tech Stack:</h4>
                          <div className="flex flex-wrap gap-1">
                            {template.techStack.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs bg-[#272822]/50 text-[#75715E]">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-[#F8EFD6] font-semibold text-sm mb-2">Features:</h4>
                          <ul className="text-xs text-[#75715E] space-y-1">
                            {template.features.slice(0, 3).map((feature) => (
                              <li key={feature} className="flex items-center">
                                <div className="w-1 h-1 bg-[#66D9EF] rounded-full mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-[#75715E]">
                          <span>Estimated: {template.estimatedTime}</span>
                          {selectedTemplate?.id === template.id && (
                            <CheckCircle className="w-4 h-4 text-[#A6E22E]" />
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!selectedTemplate}
                    className="bg-gradient-to-r from-[#F92672] to-[#66D9EF] text-white px-8"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Project Configuration */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#F8EFD6] mb-4">Configure Your Project</h2>
                  <p className="text-[#75715E]">Provide details for your application</p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <GlassCard variant="dark" className="p-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[#F8EFD6] font-medium mb-2">Project Name *</label>
                        <Input
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          placeholder="My Awesome ECE App"
                          className="bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#F8EFD6] font-medium mb-2">Project Description *</label>
                        <Textarea
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                          placeholder="Describe what your application will do..."
                          rows={3}
                          className="bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#F8EFD6] font-medium mb-2">Custom Features (Optional)</label>
                        <Textarea
                          value={customFeatures}
                          onChange={(e) => setCustomFeatures(e.target.value)}
                          placeholder="List any specific features you need..."
                          rows={4}
                          className="bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]"
                        />
                      </div>

                      {/* Selected Template Summary */}
                      {selectedTemplate && (
                        <div className="border border-[#75715E]/30 rounded-lg p-4">
                          <h4 className="text-[#F8EFD6] font-semibold mb-2">Selected Template</h4>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-[#66D9EF]/20 to-[#66D9EF]/10 rounded">
                              {selectedTemplate.icon}
                            </div>
                            <div>
                              <p className="text-[#F8EFD6] font-medium">{selectedTemplate.name}</p>
                              <p className="text-[#75715E] text-sm">{selectedTemplate.estimatedTime}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </GlassCard>

                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="border-[#75715E]/30 text-[#75715E]"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      disabled={!projectName || !projectDescription || isGenerating}
                      className="bg-gradient-to-r from-[#F92672] to-[#66D9EF] text-white px-8"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate App
                          <Rocket className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Generated App */}
            {currentStep === 3 && generatedApp && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-[#F8EFD6] mb-4">App Generated Successfully! 🎉</h2>
                  <p className="text-[#75715E]">Your ECE-standardized application is ready for download</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* App Details */}
                  <GlassCard variant="dark" className="p-6">
                    <h3 className="text-xl font-bold text-[#F8EFD6] mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-[#66D9EF]" />
                      Project Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-[#75715E] text-sm">Name:</span>
                        <p className="text-[#F8EFD6] font-medium">{generatedApp.name}</p>
                      </div>
                      <div>
                        <span className="text-[#75715E] text-sm">Template:</span>
                        <p className="text-[#F8EFD6] font-medium">{generatedApp.template.name}</p>
                      </div>
                      <div>
                        <span className="text-[#75715E] text-sm">Generated:</span>
                        <p className="text-[#F8EFD6] font-medium">{new Date(generatedApp.timestamp).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <Button 
                        className="w-full bg-[#66D9EF]/20 text-[#66D9EF] hover:bg-[#66D9EF]/30"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {showPreview ? 'Hide Preview' : 'Preview Files'}
                      </Button>
                      
                      <Button className="w-full bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download Project
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="w-full border-[#E6DB74]/30 text-[#E6DB74] hover:bg-[#E6DB74]/20"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Create GitHub Repo
                      </Button>
                    </div>
                  </GlassCard>

                  {/* File Structure */}
                  <GlassCard variant="dark" className="p-6">
                    <h3 className="text-xl font-bold text-[#F8EFD6] mb-4 flex items-center">
                      <Folder className="w-5 h-5 mr-2 text-[#E6DB74]" />
                      Project Structure
                    </h3>
                    
                    <div className="space-y-2 text-sm max-h-96 overflow-y-auto">
                      {generatedApp.structure.folders.map((folder: string) => (
                        <div key={folder} className="flex items-center text-[#66D9EF]">
                          <Folder className="w-4 h-4 mr-2" />
                          {folder}/
                        </div>
                      ))}
                      {generatedApp.structure.files.map((file: any) => (
                        <div key={file.name} className="flex items-center text-[#F8EFD6] ml-4">
                          <FileText className="w-4 h-4 mr-2 text-[#75715E]" />
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* File Preview */}
                <AnimatePresence>
                  {showPreview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-8"
                    >
                      <GlassCard variant="dark" className="p-6">
                        <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Generated Files Preview</h3>
                        
                        <div className="space-y-4">
                          {generatedApp.generatedFiles.slice(0, 2).map((file: any) => (
                            <div key={file.path} className="border border-[#75715E]/30 rounded-lg p-4">
                              <h4 className="text-[#66D9EF] font-semibold mb-2 flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                {file.path}
                              </h4>
                              <pre className="text-[#F8EFD6] text-xs bg-[#272822]/50 p-3 rounded overflow-x-auto max-h-32">
                                {file.content.substring(0, 300)}...
                              </pre>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => {
                      setCurrentStep(1)
                      setGeneratedApp(null)
                      setSelectedTemplate(null)
                      setProjectName('')
                      setProjectDescription('')
                      setCustomFeatures('')
                    }}
                    variant="outline"
                    className="border-[#75715E]/30 text-[#75715E]"
                  >
                    Generate Another App
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ECE Branding Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16 pt-8 border-t border-[#75715E]/30"
          >
            <p className="text-[#75715E] text-sm mb-2">
              Powered by <span className="text-[#66D9EF] font-semibold">ECE AI App Generator</span>
            </p>
            <p className="text-[#75715E] text-xs">
              Elite Card Exchange - Standardized Development, Consistent Branding
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
