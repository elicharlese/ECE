// Template system for generating different types of software projects

import type { 
  GenerationTemplate, 
  TemplateFile, 
  TemplateCommand, 
  TemplateDependency,
  ValidationRule,
  ProjectType,
  GenerationContext 
} from './types'
import { ConstraintEngine } from './constraints'

export class TemplateEngine {
  private static templates: Map<string, GenerationTemplate> = new Map()

  static initialize() {
    // Nx Monorepo Template
    this.registerTemplate({
      id: 'nx-monorepo-full-stack',
      name: 'Nx Full-Stack Monorepo',
      description: 'Complete Nx monorepo with web, mobile, and desktop apps',
      projectType: 'nx-monorepo',
      constraints: ConstraintEngine.getConstraints('nx-monorepo')!,
      files: [
        {
          path: 'nx.json',
          content: (ctx) => this.generateNxConfig(ctx)
        },
        {
          path: 'package.json',
          content: (ctx) => this.generatePackageJson(ctx)
        },
        {
          path: 'tsconfig.base.json',
          content: (ctx) => this.generateTsConfig(ctx)
        },
        {
          path: 'apps/web/src/app/page.tsx',
          content: (ctx) => this.generateNextJsPage(ctx)
        },
        {
          path: 'apps/mobile/App.tsx',
          content: (ctx) => this.generateExpoApp(ctx)
        },
        {
          path: 'apps/desktop/src/main.ts',
          content: (ctx) => this.generateElectronMain(ctx)
        },
        {
          path: 'libs/shared-ui/src/index.ts',
          content: (ctx) => this.generateSharedUI(ctx)
        },
        {
          path: 'libs/shared-types/src/index.ts',
          content: (ctx) => this.generateSharedTypes(ctx)
        },
        {
          path: 'libs/shared-business-logic/src/index.ts',
          content: (ctx) => this.generateBusinessLogic(ctx)
        }
      ],
      commands: [
        {
          command: 'npx create-nx-workspace {{projectName}} --preset=react-ts --appName=web --style=css --defaultBase=main --no-interactive',
          description: 'Initialize Nx workspace'
        },
        {
          command: 'nx g @nx/expo:app mobile --no-interactive',
          description: 'Generate Expo mobile app'
        },
        {
          command: 'nx g @nx/js:lib shared-ui --no-interactive',
          description: 'Generate shared UI library'
        },
        {
          command: 'nx g @nx/js:lib shared-types --no-interactive',
          description: 'Generate shared types library'
        },
        {
          command: 'nx g @nx/js:lib shared-business-logic --no-interactive',
          description: 'Generate shared business logic library'
        },
        {
          command: 'npm install',
          description: 'Install dependencies'
        }
      ],
      dependencies: [
        { name: 'nx', version: '^21.0.0', dev: true },
        { name: '@nx/react', version: '^21.0.0', dev: true },
        { name: '@nx/expo', version: '^21.0.0', dev: true },
        { name: '@nx/next', version: '^21.0.0', dev: true },
        { name: 'react', version: '^18.0.0' },
        { name: 'react-dom', version: '^18.0.0' },
        { name: 'typescript', version: '^5.0.0', dev: true },
        { name: 'tailwindcss', version: '^3.0.0', dev: true }
      ],
      validation: [
        {
          type: 'file-exists',
          description: 'Nx configuration exists',
          files: ['nx.json', 'package.json']
        },
        {
          type: 'command-success',
          description: 'Project builds successfully',
          command: 'nx build web'
        },
        {
          type: 'lint-pass',
          description: 'Code passes linting',
          command: 'nx lint'
        }
      ]
    })

    // Expo Mobile Template
    this.registerTemplate({
      id: 'expo-mobile-app',
      name: 'Expo React Native App',
      description: 'Cross-platform mobile app with Expo and TypeScript',
      projectType: 'expo-mobile',
      constraints: ConstraintEngine.getConstraints('expo-mobile')!,
      files: [
        {
          path: 'app.json',
          content: (ctx) => this.generateExpoConfig(ctx)
        },
        {
          path: 'App.tsx',
          content: (ctx) => this.generateExpoApp(ctx)
        },
        {
          path: 'src/screens/HomeScreen.tsx',
          content: (ctx) => this.generateExpoScreen(ctx, 'Home')
        },
        {
          path: 'src/navigation/AppNavigator.tsx',
          content: (ctx) => this.generateExpoNavigation(ctx)
        }
      ],
      commands: [
        {
          command: 'npx create-expo-app {{projectName}} --template blank-typescript',
          description: 'Create Expo app'
        },
        {
          command: 'npm install @react-navigation/native @react-navigation/stack',
          description: 'Install navigation'
        },
        {
          command: 'npx expo install react-native-screens react-native-safe-area-context',
          description: 'Install native dependencies'
        }
      ],
      dependencies: [
        { name: 'expo', version: '~51.0.0' },
        { name: 'react', version: '18.2.0' },
        { name: 'react-native', version: '0.74.5' },
        { name: '@react-navigation/native', version: '^6.0.0' },
        { name: '@react-navigation/stack', version: '^6.0.0' },
        { name: 'typescript', version: '^5.0.0', dev: true }
      ],
      validation: [
        {
          type: 'file-exists',
          description: 'Expo configuration exists',
          files: ['app.json', 'App.tsx']
        },
        {
          type: 'command-success',
          description: 'App builds for development',
          command: 'npx expo export'
        }
      ]
    })

    // Electron Desktop Template
    this.registerTemplate({
      id: 'electron-desktop-app',
      name: 'Electron Desktop App',
      description: 'Cross-platform desktop app with Electron and React',
      projectType: 'electron-desktop',
      constraints: ConstraintEngine.getConstraints('electron-desktop')!,
      files: [
        {
          path: 'src/main/main.ts',
          content: (ctx) => this.generateElectronMain(ctx)
        },
        {
          path: 'src/renderer/App.tsx',
          content: (ctx) => this.generateElectronRenderer(ctx)
        },
        {
          path: 'src/preload/preload.ts',
          content: (ctx) => this.generateElectronPreload(ctx)
        },
        {
          path: 'package.json',
          content: (ctx) => this.generateElectronPackageJson(ctx)
        }
      ],
      commands: [
        {
          command: 'npm init -y',
          description: 'Initialize package.json'
        },
        {
          command: 'npm install electron react react-dom',
          description: 'Install core dependencies'
        },
        {
          command: 'npm install -D @types/react @types/react-dom typescript webpack',
          description: 'Install dev dependencies'
        }
      ],
      dependencies: [
        { name: 'electron', version: '^28.0.0' },
        { name: 'react', version: '^18.0.0' },
        { name: 'react-dom', version: '^18.0.0' },
        { name: 'typescript', version: '^5.0.0', dev: true },
        { name: '@types/react', version: '^18.0.0', dev: true },
        { name: '@types/react-dom', version: '^18.0.0', dev: true }
      ],
      validation: [
        {
          type: 'file-exists',
          description: 'Electron main process exists',
          files: ['src/main/main.ts']
        },
        {
          type: 'command-success',
          description: 'App builds successfully',
          command: 'npm run build'
        }
      ]
    })
  }

  static registerTemplate(template: GenerationTemplate) {
    this.templates.set(template.id, template)
  }

  static getTemplate(id: string): GenerationTemplate | null {
    return this.templates.get(id) || null
  }

  static getTemplatesForProjectType(projectType: ProjectType): GenerationTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.projectType === projectType)
  }

  static getAllTemplates(): GenerationTemplate[] {
    return Array.from(this.templates.values())
  }

  // Template content generators
  private static generateNxConfig(ctx: GenerationContext): string {
    return JSON.stringify({
      "$schema": "./node_modules/nx/schemas/nx-schema.json",
      "defaultBase": "main",
      "namedInputs": {
        "default": ["{projectRoot}/**/*", "sharedGlobals"],
        "production": ["default"],
        "sharedGlobals": []
      },
      "targetDefaults": {
        "build": {
          "dependsOn": ["^build"],
          "inputs": ["production", "^production"]
        }
      },
      "generators": {
        "@nx/react": {
          "application": {
            "style": "css",
            "linter": "eslint",
            "bundler": "vite"
          },
          "component": {
            "style": "css"
          },
          "library": {
            "style": "css",
            "linter": "eslint"
          }
        }
      }
    }, null, 2)
  }

  private static generatePackageJson(ctx: GenerationContext): string {
    return JSON.stringify({
      name: ctx.projectName,
      version: "1.0.0",
      private: true,
      scripts: {
        "build": "nx build",
        "test": "nx test",
        "lint": "nx lint",
        "serve": "nx serve",
        "dev": "nx serve web",
        "dev:mobile": "nx serve mobile",
        "dev:desktop": "nx serve desktop",
        "build:all": "nx run-many --target=build --all"
      },
      devDependencies: {
        "nx": "^21.0.0",
        "@nx/react": "^21.0.0",
        "@nx/next": "^21.0.0",
        "@nx/expo": "^21.0.0",
        "typescript": "^5.0.0",
        "tailwindcss": "^3.0.0"
      },
      dependencies: {
        "react": "^18.0.0",
        "react-dom": "^18.0.0"
      }
    }, null, 2)
  }

  private static generateTsConfig(ctx: GenerationContext): string {
    return JSON.stringify({
      compileOnSave: false,
      compilerOptions: {
        rootDir: ".",
        sourceMap: true,
        declaration: false,
        moduleResolution: "node",
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        importHelpers: true,
        target: "es2015",
        module: "esnext",
        lib: ["es2020", "dom"],
        skipLibCheck: true,
        skipDefaultLibCheck: true,
        baseUrl: ".",
        paths: {
          [`@${ctx.projectName}/shared-ui`]: ["libs/shared-ui/src/index.ts"],
          [`@${ctx.projectName}/shared-types`]: ["libs/shared-types/src/index.ts"],
          [`@${ctx.projectName}/shared-business-logic`]: ["libs/shared-business-logic/src/index.ts"]
        }
      },
      exclude: ["node_modules", "tmp"]
    }, null, 2)
  }

  private static generateNextJsPage(ctx: GenerationContext): string {
    return `import React from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to ${ctx.projectName}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern full-stack application built with Nx monorepo
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Web App</h3>
              <p className="text-gray-600">Next.js web application</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Mobile App</h3>
              <p className="text-gray-600">Expo React Native mobile app</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Desktop App</h3>
              <p className="text-gray-600">Electron desktop application</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}`
  }

  private static generateExpoApp(ctx: GenerationContext): string {
    return `import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ${ctx.projectName}</Text>
      <Text style={styles.subtitle}>Mobile App</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
})`
  }

  private static generateElectronMain(ctx: GenerationContext): string {
    return `import { app, BrowserWindow } from 'electron'
import * as path from 'path'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js')
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})`
  }

  private static generateExpoConfig(ctx: GenerationContext): string {
    return JSON.stringify({
      expo: {
        name: ctx.projectName,
        slug: ctx.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        splash: {
          image: "./assets/splash.png",
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        },
        assetBundlePatterns: ["**/*"],
        ios: {
          supportsTablet: true
        },
        android: {
          adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#ffffff"
          }
        },
        web: {
          favicon: "./assets/favicon.png"
        }
      }
    }, null, 2)
  }

  private static generateExpoScreen(ctx: GenerationContext, screenName: string): string {
    return `import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function ${screenName}Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${screenName} Screen</Text>
      <Text style={styles.subtitle}>Welcome to ${ctx.projectName}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
})`
  }

  private static generateExpoNavigation(ctx: GenerationContext): string {
    return `import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen'

const Stack = createStackNavigator()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: '${ctx.projectName}' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}`
  }

  private static generateElectronRenderer(ctx: GenerationContext): string {
    return `import React from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to ${ctx.projectName}</h1>
      <p>This is your Electron desktop application.</p>
    </div>
  )
}

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(<App />)`
  }

  private static generateElectronPreload(ctx: GenerationContext): string {
    return `import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Add your API methods here
  getVersion: () => process.versions.electron,
})`
  }

  private static generateElectronPackageJson(ctx: GenerationContext): string {
    return JSON.stringify({
      name: ctx.projectName,
      version: "1.0.0",
      description: `${ctx.projectName} desktop application`,
      main: "dist/main/main.js",
      scripts: {
        "start": "electron .",
        "dev": "concurrently \"npm run build:watch\" \"wait-on dist/main/main.js && electron .\"",
        "build": "tsc",
        "build:watch": "tsc --watch",
        "pack": "electron-builder",
        "dist": "npm run build && electron-builder"
      },
      dependencies: {
        "electron": "^28.0.0"
      },
      devDependencies: {
        "@types/node": "^20.0.0",
        "typescript": "^5.0.0",
        "electron-builder": "^24.0.0",
        "concurrently": "^8.0.0",
        "wait-on": "^7.0.0"
      }
    }, null, 2)
  }

  private static generateSharedUI(ctx: GenerationContext): string {
    return `// Shared UI components for ${ctx.projectName}

export interface ButtonProps {
  title: string
  onPress?: () => void
  variant?: 'primary' | 'secondary'
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary' }) => {
  // Implementation would vary by platform (web vs mobile vs desktop)
  return null // Placeholder
}

export interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return null // Placeholder
}`
  }

  private static generateSharedTypes(ctx: GenerationContext): string {
    return `// Shared TypeScript types for ${ctx.projectName}

export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}`
  }

  private static generateBusinessLogic(ctx: GenerationContext): string {
    return `// Shared business logic for ${ctx.projectName}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`)
    return response.json()
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }
}

export const createApiClient = (baseUrl: string) => new ApiClient(baseUrl)`
  }
}

// Initialize templates on module load
TemplateEngine.initialize()
