#!/usr/bin/env node

/**
 * ECE App Creation Algorithm - Universal Framework
 * 
 * Standardized app scaffolding tool supporting multiple tech stacks:
 * - React/Next.js applications
 * - React Native mobile apps
 * - Electron desktop apps
 * - Vue.js applications
 * - Backend services (Node.js, Python)
 * 
 * Features:
 * - Consistent ECE branding and Beach Monokai theme
 * - Automated dependency management
 * - Quality assurance checklists
 * - Performance optimization presets
 * - 3D integration templates
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// App template configurations
const APP_TEMPLATES = {
  'next-js': {
    name: 'Next.js Web Application',
    description: 'React-based web application with ECE branding and 3D integration',
    dependencies: [
      'next@15.3.5',
      'react@18.3.1',
      'react-dom@18.3.1',
      'typescript@5.8.3',
      'tailwindcss@3.4.17',
      'framer-motion@11.15.0',
      '@splinetool/react-spline@4.1.0',
      'gsap@3.13.0',
      'lucide-react@0.468.0'
    ],
    devDependencies: [
      '@types/react@18.3.17',
      '@types/react-dom@18.3.5',
      '@types/node@22.10.2',
      'eslint@9.17.0',
      'prettier@3.4.2',
      'autoprefixer@10.4.20',
      'postcss@8.4.49'
    ],
    structure: 'nextjs',
    features: ['3d-integration', 'beach-monokai', 'responsive-design', 'accessibility']
  },
  
  'react-native': {
    name: 'React Native Mobile App',
    description: 'Cross-platform mobile application with ECE trading features',
    dependencies: [
      'react-native@0.73.0',
      'react@18.3.1',
      '@react-navigation/native@6.1.0',
      '@react-navigation/stack@6.3.0',
      'react-native-reanimated@3.6.0',
      'react-native-gesture-handler@2.14.0'
    ],
    devDependencies: [
      '@types/react@18.3.17',
      '@types/react-native@0.73.0',
      'metro@0.80.0',
      '@react-native/metro-config@0.73.0'
    ],
    structure: 'react-native',
    features: ['native-performance', 'beach-monokai', 'trading-ui', 'notifications']
  },
  
  'electron': {
    name: 'Electron Desktop App',
    description: 'Cross-platform desktop application for ECE trading',
    dependencies: [
      'electron@28.0.0',
      'react@18.3.1',
      'react-dom@18.3.1',
      'typescript@5.8.3',
      'electron-builder@24.9.0'
    ],
    devDependencies: [
      '@types/react@18.3.17',
      '@types/react-dom@18.3.5',
      '@types/electron@1.6.10',
      'webpack@5.89.0',
      'webpack-cli@5.1.0'
    ],
    structure: 'electron',
    features: ['desktop-integration', 'beach-monokai', 'offline-support', 'auto-updater']
  },
  
  'vue-js': {
    name: 'Vue.js Web Application',
    description: 'Vue-based web application with ECE branding',
    dependencies: [
      'vue@3.4.0',
      'vue-router@4.2.0',
      'vuex@4.1.0',
      'typescript@5.8.3',
      'tailwindcss@3.4.17'
    ],
    devDependencies: [
      '@vitejs/plugin-vue@5.0.0',
      'vite@6.3.5',
      '@vue/compiler-sfc@3.4.0'
    ],
    structure: 'vue',
    features: ['composition-api', 'beach-monokai', 'state-management', 'routing']
  },
  
  'node-backend': {
    name: 'Node.js Backend Service',
    description: 'RESTful API service for ECE platform',
    dependencies: [
      'express@4.18.0',
      'typescript@5.8.3',
      'prisma@6.11.1',
      '@prisma/client@6.11.1',
      'cors@2.8.5',
      'helmet@7.1.0'
    ],
    devDependencies: [
      '@types/express@4.17.0',
      '@types/cors@2.8.17',
      '@types/node@22.10.2',
      'nodemon@3.0.0',
      'ts-node@10.9.2'
    ],
    structure: 'node-backend',
    features: ['rest-api', 'database-integration', 'authentication', 'security']
  }
};

// Beach Monokai theme configuration
const BEACH_MONOKAI_THEME = {
  colors: {
    dark: '#272822',
    light: '#F8EFD6',
    muted: '#75715E',
    accent: '#F92672',
    success: '#A6E22E',
    info: '#66D9EF',
    warning: '#E6DB74',
    error: '#FD5C63',
    primary: '#819AFF',
    secondary: '#3EBA7C'
  },
  gradients: {
    sunset: 'linear-gradient(90deg, #F92672, #FD5C63)',
    tide: 'linear-gradient(90deg, #66D9EF, #3EBA7C)',
    sand: 'linear-gradient(180deg, #F8EFD6, #819AFF)'
  }
};

// Quality assurance checklist
const QA_CHECKLIST = {
  'code-quality': [
    'TypeScript strict mode enabled',
    'ESLint configuration with ECE rules',
    'Prettier formatting setup',
    'Git hooks for pre-commit checks',
    'Unit test setup with Jest'
  ],
  'performance': [
    'Bundle size optimization',
    'Lazy loading implementation',
    'Image optimization setup',
    'Performance monitoring',
    'Lighthouse score > 90'
  ],
  'accessibility': [
    'ARIA labels implementation',
    'Keyboard navigation support',
    'Screen reader compatibility',
    'Color contrast compliance',
    'Focus management'
  ],
  'security': [
    'Input validation',
    'XSS protection',
    'CSRF protection',
    'Secure headers configuration',
    'Dependency vulnerability scanning'
  ],
  'ece-branding': [
    'Beach Monokai theme integration',
    'ECE logo and typography',
    'Consistent component library',
    'Brand guideline compliance',
    'Responsive design patterns'
  ]
};

class ECEAppCreator {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async createApp() {
    console.log('\n🏖️  ECE App Creation Tool - Beach Monokai Edition\n');
    
    const projectName = await this.askQuestion('Project name: ');
    const appType = await this.selectAppType();
    const features = await this.selectFeatures(appType);
    const outputDir = await this.askQuestion('Output directory (default: current): ') || '.';
    
    console.log('\n🚀 Creating your ECE application...\n');
    
    try {
      await this.scaffoldProject(projectName, appType, features, outputDir);
      await this.installDependencies(path.join(outputDir, projectName));
      await this.setupECEBranding(path.join(outputDir, projectName), appType);
      await this.generateQAChecklist(path.join(outputDir, projectName));
      
      console.log('\n✅ ECE application created successfully!\n');
      console.log('Next steps:');
      console.log(`  cd ${projectName}`);
      console.log('  npm run dev\n');
      
      this.displayQAReminder();
      
    } catch (error) {
      console.error('\n❌ Error creating application:', error.message);
    }
    
    this.rl.close();
  }

  async askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  async selectAppType() {
    console.log('Available app types:');
    const types = Object.keys(APP_TEMPLATES);
    types.forEach((type, index) => {
      const template = APP_TEMPLATES[type];
      console.log(`  ${index + 1}. ${template.name} - ${template.description}`);
    });
    
    const selection = await this.askQuestion('\nSelect app type (1-5): ');
    const typeIndex = parseInt(selection) - 1;
    
    if (typeIndex < 0 || typeIndex >= types.length) {
      throw new Error('Invalid selection');
    }
    
    return types[typeIndex];
  }

  async selectFeatures(appType) {
    const template = APP_TEMPLATES[appType];
    console.log(`\nDefault features for ${template.name}:`);
    template.features.forEach(feature => {
      console.log(`  ✅ ${feature}`);
    });
    
    const additional = await this.askQuestion('\nAdd 3D integration? (y/N): ');
    const features = [...template.features];
    
    if (additional.toLowerCase() === 'y') {
      features.push('3d-spline-integration');
    }
    
    return features;
  }

  async scaffoldProject(projectName, appType, features, outputDir) {
    const projectPath = path.join(outputDir, projectName);
    const template = APP_TEMPLATES[appType];
    
    // Create project directory
    fs.mkdirSync(projectPath, { recursive: true });
    
    // Generate package.json
    const packageJson = this.generatePackageJson(projectName, template);
    fs.writeFileSync(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create project structure
    await this.createProjectStructure(projectPath, template.structure);
    
    // Add ECE-specific configurations
    await this.addECEConfigurations(projectPath, appType);
    
    console.log(`📁 Project structure created: ${projectPath}`);
  }

  generatePackageJson(projectName, template) {
    return {
      name: projectName,
      version: '1.0.0',
      description: `ECE Trading Cards - ${template.description}`,
      private: true,
      scripts: this.getScriptsForTemplate(template.structure),
      dependencies: template.dependencies.reduce((acc, dep) => {
        const [name, version] = dep.split('@');
        acc[name] = `^${version}`;
        return acc;
      }, {}),
      devDependencies: template.devDependencies.reduce((acc, dep) => {
        const [name, version] = dep.split('@');
        acc[name] = `^${version}`;
        return acc;
      }, {}),
      keywords: ['ece', 'trading-cards', 'beach-monokai', '3d-integration'],
      author: 'ECE Development Team',
      license: 'MIT'
    };
  }

  getScriptsForTemplate(structure) {
    const scripts = {
      'nextjs': {
        'dev': 'next dev',
        'build': 'next build',
        'start': 'next start',
        'lint': 'eslint . --ext .ts,.tsx',
        'type-check': 'tsc --noEmit'
      },
      'react-native': {
        'start': 'react-native start',
        'android': 'react-native run-android',
        'ios': 'react-native run-ios',
        'test': 'jest',
        'lint': 'eslint . --ext .ts,.tsx'
      },
      'electron': {
        'start': 'electron .',
        'build': 'electron-builder',
        'dev': 'webpack --mode development --watch',
        'compile': 'webpack --mode production'
      },
      'vue': {
        'dev': 'vite',
        'build': 'vite build',
        'preview': 'vite preview',
        'lint': 'eslint . --ext .ts,.vue'
      },
      'node-backend': {
        'start': 'node dist/index.js',
        'dev': 'nodemon src/index.ts',
        'build': 'tsc',
        'test': 'jest'
      }
    };
    
    return scripts[structure] || scripts['nextjs'];
  }

  async createProjectStructure(projectPath, structure) {
    const structures = {
      'nextjs': [
        'src/app',
        'src/components/ui',
        'src/components/3d',
        'src/lib',
        'src/hooks',
        'public',
        'docs'
      ],
      'react-native': [
        'src/components',
        'src/screens',
        'src/navigation',
        'src/services',
        'assets',
        'android',
        'ios'
      ],
      'electron': [
        'src/main',
        'src/renderer',
        'src/common',
        'assets',
        'build'
      ],
      'vue': [
        'src/components',
        'src/views',
        'src/router',
        'src/store',
        'public'
      ],
      'node-backend': [
        'src/routes',
        'src/controllers',
        'src/services',
        'src/models',
        'src/middleware',
        'tests'
      ]
    };
    
    const dirs = structures[structure] || structures['nextjs'];
    
    dirs.forEach(dir => {
      fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
    });
  }

  async addECEConfigurations(projectPath, appType) {
    // Add TypeScript config
    const tsConfig = {
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'es6'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
          '@/components/*': ['./src/components/*'],
          '@/lib/*': ['./src/lib/*']
        }
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules']
    };
    
    fs.writeFileSync(
      path.join(projectPath, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );
    
    // Add Tailwind config with Beach Monokai theme
    if (appType === 'next-js' || appType === 'vue-js') {
      const tailwindConfig = this.generateTailwindConfig();
      fs.writeFileSync(
        path.join(projectPath, 'tailwind.config.js'),
        `module.exports = ${JSON.stringify(tailwindConfig, null, 2)}`
      );
    }
    
    // Add ESLint config
    const eslintConfig = {
      extends: [
        'next/core-web-vitals',
        '@typescript-eslint/recommended',
        'prettier'
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        'prefer-const': 'error'
      }
    };
    
    fs.writeFileSync(
      path.join(projectPath, '.eslintrc.json'),
      JSON.stringify(eslintConfig, null, 2)
    );
  }

  generateTailwindConfig() {
    return {
      content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}'
      ],
      theme: {
        extend: {
          colors: {
            background: 'var(--background)',
            foreground: 'var(--foreground)',
            'beach-dark': BEACH_MONOKAI_THEME.colors.dark,
            'beach-light': BEACH_MONOKAI_THEME.colors.light,
            'beach-muted': BEACH_MONOKAI_THEME.colors.muted,
            'beach-accent': BEACH_MONOKAI_THEME.colors.accent,
            'beach-success': BEACH_MONOKAI_THEME.colors.success,
            'beach-info': BEACH_MONOKAI_THEME.colors.info,
            'beach-warning': BEACH_MONOKAI_THEME.colors.warning,
            'beach-error': BEACH_MONOKAI_THEME.colors.error,
            'beach-primary': BEACH_MONOKAI_THEME.colors.primary,
            'beach-secondary': BEACH_MONOKAI_THEME.colors.secondary
          },
          backgroundImage: {
            'gradient-sunset': BEACH_MONOKAI_THEME.gradients.sunset,
            'gradient-tide': BEACH_MONOKAI_THEME.gradients.tide,
            'gradient-sand': BEACH_MONOKAI_THEME.gradients.sand
          }
        }
      },
      plugins: []
    };
  }

  async installDependencies(projectPath) {
    console.log('📦 Installing dependencies...');
    try {
      execSync('npm install', { 
        cwd: projectPath, 
        stdio: 'inherit',
        timeout: 300000 // 5 minutes timeout
      });
      console.log('✅ Dependencies installed successfully');
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error.message);
      throw error;
    }
  }

  async setupECEBranding(projectPath, appType) {
    console.log('🎨 Setting up ECE branding...');
    
    // Create basic component templates
    const componentTemplate = this.generateECEComponent();
    fs.writeFileSync(
      path.join(projectPath, 'src/components/ECEButton.tsx'),
      componentTemplate
    );
    
    // Create README with ECE branding
    const readme = this.generateECEReadme(appType);
    fs.writeFileSync(
      path.join(projectPath, 'README.md'),
      readme
    );
    
    console.log('✅ ECE branding setup complete');
  }

  generateECEComponent() {
    return `'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ECEButtonProps {
  children: ReactNode;
  variant?: 'accent' | 'success' | 'info' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * ECE Button Component with Beach Monokai Theme
 * 
 * Standardized button component following ECE design guidelines
 * with consistent Beach Monokai color palette and smooth animations.
 */
export function ECEButton({
  children,
  variant = 'accent',
  size = 'md',
  onClick,
  disabled = false
}: ECEButtonProps) {
  const variants = {
    accent: 'bg-[#F92672] text-[#F8EFD6] hover:bg-[#FD5C63]',
    success: 'bg-[#A6E22E] text-[#272822] hover:bg-[#3EBA7C]',
    info: 'bg-[#66D9EF] text-[#272822] hover:bg-[#819AFF]',
    warning: 'bg-[#E6DB74] text-[#272822] hover:bg-[#F8EFD6]'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <motion.button
      className={\`\${variants[variant]} \${sizes[size]} rounded-lg font-medium transition-colors duration-200 \${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}\`}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

export default ECEButton;
`;
  }

  generateECEReadme(appType) {
    const template = APP_TEMPLATES[appType];
    return `# ECE Trading Cards - ${template.name}

${template.description}

## 🏖️ Beach Monokai Theme

This project uses the ECE Beach Monokai color system:

- **Primary**: #F8EFD6 (Light backgrounds, primary text)
- **Dark**: #272822 (Main background, dark canvas)
- **Accent**: #F92672 (Buttons, highlights, alerts)
- **Success**: #A6E22E (Success states, positive actions)
- **Info**: #66D9EF (Info states, links, sky themes)
- **Warning**: #E6DB74 (Warning states, caution)
- **Error**: #FD5C63 (Error states, destructive actions)

## 🚀 Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
├── app/                # Next.js app directory
├── lib/                # Utility functions
└── hooks/              # Custom React hooks
\`\`\`

## 🎨 Component Library

This project includes ECE-standardized components:

- **ECEButton**: Beach Monokai themed buttons
- **ECECard**: Trading card display components
- **ECE3DScene**: 3D integration components (if enabled)

## 🔧 Quality Assurance

Run the following commands to ensure code quality:

- \`npm run lint\` - ESLint checks
- \`npm run type-check\` - TypeScript validation
- \`npm run test\` - Unit tests
- \`npm run build\` - Production build

## 🌊 3D Integration

This project supports Spline 3D integration for immersive experiences.
See \`src/components/3d/\` for 3D-specific components.

## 📚 Documentation

- [ECE Design System](./docs/design-system.md)
- [Component API](./docs/components.md)
- [3D Integration Guide](./docs/3d-integration.md)

## 🤝 Contributing

1. Follow the ECE coding standards
2. Use Beach Monokai color palette
3. Ensure accessibility compliance
4. Add unit tests for new features

---

Created with ❤️ by ECE Development Team
`;
  }

  async generateQAChecklist(projectPath) {
    const checklist = Object.entries(QA_CHECKLIST)
      .map(([category, items]) => {
        const itemList = items.map(item => `- [ ] ${item}`).join('\n');
        return `## ${category.replace('-', ' ').toUpperCase()}\n\n${itemList}`;
      })
      .join('\n\n');
    
    const qaContent = `# ECE Quality Assurance Checklist

This checklist ensures your ECE application meets our quality standards.

${checklist}

## Final Review

- [ ] All checklist items completed
- [ ] Performance tests passing
- [ ] Accessibility audit passed
- [ ] Security scan completed
- [ ] ECE branding guidelines followed

---

*Complete this checklist before deploying to production.*
`;
    
    fs.writeFileSync(
      path.join(projectPath, 'QA_CHECKLIST.md'),
      qaContent
    );
  }

  displayQAReminder() {
    console.log('📋 Quality Assurance Reminder:');
    console.log('  - Review QA_CHECKLIST.md before deployment');
    console.log('  - Ensure Beach Monokai theme consistency');
    console.log('  - Test 3D features across devices');
    console.log('  - Validate accessibility compliance');
    console.log('  - Run performance audits\n');
  }
}

// CLI execution
if (require.main === module) {
  const creator = new ECEAppCreator();
  creator.createApp().catch(console.error);
}

export default ECEAppCreator;
