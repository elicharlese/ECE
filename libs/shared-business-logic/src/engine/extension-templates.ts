// Additional templates for Chrome extensions, VS Code extensions, and other specialized project types

import type { GenerationTemplate, GenerationContext } from './types'
import { ConstraintEngine } from './constraints'

export class ExtensionTemplateEngine {
  static initialize() {
    // Chrome Extension Template
    this.registerChromeExtensionTemplate()
    
    // VS Code Extension Template
    this.registerVSCodeExtensionTemplate()
    
    // CLI Tool Template
    this.registerCLIToolTemplate()
    
    // Shopify App Template
    this.registerShopifyAppTemplate()
    
    // Discord Bot Template
    this.registerDiscordBotTemplate()
  }

  private static registerChromeExtensionTemplate() {
    const template: GenerationTemplate = {
      id: 'chrome-extension-v3',
      name: 'Chrome Extension (Manifest V3)',
      description: 'Modern Chrome extension with TypeScript and React',
      projectType: 'chrome-extension',
      constraints: ConstraintEngine.getConstraints('chrome-extension')!,
      files: [
        {
          path: 'manifest.json',
          content: (ctx) => this.generateChromeManifest(ctx)
        },
        {
          path: 'src/popup/popup.tsx',
          content: (ctx) => this.generateChromePopup(ctx)
        },
        {
          path: 'src/popup/popup.html',
          content: (ctx) => this.generateChromePopupHTML(ctx)
        },
        {
          path: 'src/background/background.ts',
          content: (ctx) => this.generateChromeBackground(ctx)
        },
        {
          path: 'src/content/content.ts',
          content: (ctx) => this.generateChromeContent(ctx)
        },
        {
          path: 'package.json',
          content: (ctx) => this.generateChromePackageJson(ctx)
        },
        {
          path: 'vite.config.ts',
          content: (ctx) => this.generateChromeViteConfig(ctx)
        },
        {
          path: 'tsconfig.json',
          content: (ctx) => this.generateChromeTsConfig(ctx)
        }
      ],
      commands: [
        {
          command: 'npm init -y',
          description: 'Initialize package.json'
        },
        {
          command: 'npm install react react-dom @types/react @types/react-dom',
          description: 'Install React dependencies'
        },
        {
          command: 'npm install -D vite @vitejs/plugin-react typescript @types/chrome',
          description: 'Install build tools'
        },
        {
          command: 'npm run build',
          description: 'Build extension'
        }
      ],
      dependencies: [
        { name: 'react', version: '^18.0.0' },
        { name: 'react-dom', version: '^18.0.0' },
        { name: '@types/react', version: '^18.0.0', dev: true },
        { name: '@types/react-dom', version: '^18.0.0', dev: true },
        { name: 'vite', version: '^5.0.0', dev: true },
        { name: '@vitejs/plugin-react', version: '^4.0.0', dev: true },
        { name: 'typescript', version: '^5.0.0', dev: true },
        { name: '@types/chrome', version: '^0.0.270', dev: true }
      ],
      validation: [
        {
          type: 'file-exists',
          description: 'Extension files exist',
          files: ['manifest.json', 'src/popup/popup.tsx']
        },
        {
          type: 'command-success',
          description: 'Extension builds successfully',
          command: 'npm run build'
        }
      ]
    }

    // Register with main template engine
    const { TemplateEngine } = require('./templates')
    TemplateEngine.registerTemplate(template)
  }

  private static registerVSCodeExtensionTemplate() {
    const template: GenerationTemplate = {
      id: 'vscode-extension-typescript',
      name: 'VS Code Extension (TypeScript)',
      description: 'VS Code extension with TypeScript and comprehensive features',
      projectType: 'vscode-extension',
      constraints: ConstraintEngine.getConstraints('vscode-extension')!,
      files: [
        {
          path: 'package.json',
          content: (ctx) => this.generateVSCodePackageJson(ctx)
        },
        {
          path: 'src/extension.ts',
          content: (ctx) => this.generateVSCodeExtension(ctx)
        },
        {
          path: 'src/commands.ts',
          content: (ctx) => this.generateVSCodeCommands(ctx)
        },
        {
          path: 'tsconfig.json',
          content: (ctx) => this.generateVSCodeTsConfig(ctx)
        },
        {
          path: '.vscode/launch.json',
          content: (ctx) => this.generateVSCodeLaunchConfig(ctx)
        },
        {
          path: 'README.md',
          content: (ctx) => this.generateVSCodeReadme(ctx)
        }
      ],
      commands: [
        {
          command: 'npm init -y',
          description: 'Initialize package.json'
        },
        {
          command: 'npm install -D @types/vscode typescript @vscode/test-cli',
          description: 'Install VS Code dependencies'
        },
        {
          command: 'npm run compile',
          description: 'Compile TypeScript'
        }
      ],
      dependencies: [
        { name: '@types/vscode', version: '^1.80.0', dev: true },
        { name: 'typescript', version: '^5.0.0', dev: true },
        { name: '@vscode/test-cli', version: '^0.0.4', dev: true }
      ],
      validation: [
        {
          type: 'file-exists',
          description: 'Extension files exist',
          files: ['package.json', 'src/extension.ts']
        },
        {
          type: 'command-success',
          description: 'Extension compiles successfully',
          command: 'npm run compile'
        }
      ]
    }

    const { TemplateEngine } = require('./templates')
    TemplateEngine.registerTemplate(template)
  }

  private static registerCLIToolTemplate() {
    const template: GenerationTemplate = {
      id: 'cli-tool-commander',
      name: 'CLI Tool (Commander.js)',
      description: 'Command-line tool with TypeScript and Commander.js',
      projectType: 'cli-tool',
      constraints: ConstraintEngine.getConstraints('cli-tool')!,
      files: [
        {
          path: 'src/index.ts',
          content: (ctx) => this.generateCLIIndex(ctx)
        },
        {
          path: 'src/commands/hello.ts',
          content: (ctx) => this.generateCLICommand(ctx, 'hello')
        },
        {
          path: 'package.json',
          content: (ctx) => this.generateCLIPackageJson(ctx)
        },
        {
          path: 'tsconfig.json',
          content: (ctx) => this.generateCLITsConfig(ctx)
        },
        {
          path: 'README.md',
          content: (ctx) => this.generateCLIReadme(ctx)
        }
      ],
      commands: [
        {
          command: 'npm init -y',
          description: 'Initialize package.json'
        },
        {
          command: 'npm install commander chalk inquirer',
          description: 'Install CLI dependencies'
        },
        {
          command: 'npm install -D typescript @types/node ts-node',
          description: 'Install development dependencies'
        },
        {
          command: 'npm run build',
          description: 'Build CLI tool'
        }
      ],
      dependencies: [
        { name: 'commander', version: '^11.0.0' },
        { name: 'chalk', version: '^5.0.0' },
        { name: 'inquirer', version: '^9.0.0' },
        { name: 'typescript', version: '^5.0.0', dev: true },
        { name: '@types/node', version: '^20.0.0', dev: true },
        { name: 'ts-node', version: '^10.0.0', dev: true }
      ],
      validation: [
        {
          type: 'file-exists',
          description: 'CLI files exist',
          files: ['src/index.ts', 'package.json']
        },
        {
          type: 'command-success',
          description: 'CLI builds successfully',
          command: 'npm run build'
        }
      ]
    }

    const { TemplateEngine } = require('./templates')
    TemplateEngine.registerTemplate(template)
  }

  private static registerShopifyAppTemplate() {
    const template: GenerationTemplate = {
      id: 'shopify-app-remix',
      name: 'Shopify App (Remix)',
      description: 'Shopify app with Remix, Polaris, and GraphQL',
      projectType: 'shopify-app',
      constraints: ConstraintEngine.getConstraints('shopify-app')!,
      files: [
        {
          path: 'app/root.tsx',
          content: (ctx) => this.generateShopifyRoot(ctx)
        },
        {
          path: 'app/routes/_index.tsx',
          content: (ctx) => this.generateShopifyIndex(ctx)
        },
        {
          path: 'app/shopify.server.ts',
          content: (ctx) => this.generateShopifyServer(ctx)
        },
        {
          path: 'package.json',
          content: (ctx) => this.generateShopifyPackageJson(ctx)
        },
        {
          path: 'shopify.app.toml',
          content: (ctx) => this.generateShopifyConfig(ctx)
        }
      ],
      commands: [
        {
          command: 'npm create @shopify/app@latest',
          description: 'Create Shopify app'
        },
        {
          command: 'npm install',
          description: 'Install dependencies'
        },
        {
          command: 'npm run dev',
          description: 'Start development server'
        }
      ],
      dependencies: [
        { name: '@shopify/shopify-app-remix', version: '^2.0.0' },
        { name: '@shopify/polaris', version: '^12.0.0' },
        { name: '@remix-run/node', version: '^2.0.0' },
        { name: '@remix-run/react', version: '^2.0.0' },
        { name: 'react', version: '^18.0.0' },
        { name: 'react-dom', version: '^18.0.0' }
      ],
      validation: [
        {
          type: 'file-exists',
          description: 'Shopify app files exist',
          files: ['app/root.tsx', 'shopify.app.toml']
        }
      ]
    }

    const { TemplateEngine } = require('./templates')
    TemplateEngine.registerTemplate(template)
  }

  private static registerDiscordBotTemplate() {
    const template: GenerationTemplate = {
      id: 'discord-bot-typescript',
      name: 'Discord Bot (TypeScript)',
      description: 'Discord bot with slash commands and event handling',
      projectType: 'discord-bot',
      constraints: ConstraintEngine.getConstraints('discord-bot')!,
      files: [
        {
          path: 'src/index.ts',
          content: (ctx) => this.generateDiscordBot(ctx)
        },
        {
          path: 'src/commands/ping.ts',
          content: (ctx) => this.generateDiscordCommand(ctx, 'ping')
        },
        {
          path: 'src/events/ready.ts',
          content: (ctx) => this.generateDiscordEvent(ctx, 'ready')
        },
        {
          path: 'package.json',
          content: (ctx) => this.generateDiscordPackageJson(ctx)
        },
        {
          path: '.env.example',
          content: () => this.generateDiscordEnvExample()
        }
      ],
      commands: [
        {
          command: 'npm init -y',
          description: 'Initialize package.json'
        },
        {
          command: 'npm install discord.js dotenv',
          description: 'Install Discord.js'
        },
        {
          command: 'npm install -D typescript @types/node ts-node',
          description: 'Install development dependencies'
        }
      ],
      dependencies: [
        { name: 'discord.js', version: '^14.0.0' },
        { name: 'dotenv', version: '^16.0.0' },
        { name: 'typescript', version: '^5.0.0', dev: true },
        { name: '@types/node', version: '^20.0.0', dev: true },
        { name: 'ts-node', version: '^10.0.0', dev: true }
      ],
      validation: [
        {
          type: 'file-exists',
          description: 'Discord bot files exist',
          files: ['src/index.ts', 'package.json']
        }
      ]
    }

    const { TemplateEngine } = require('./templates')
    TemplateEngine.registerTemplate(template)
  }

  // Chrome Extension generators
  private static generateChromeManifest(ctx: GenerationContext): string {
    return JSON.stringify({
      manifest_version: 3,
      name: ctx.projectName,
      version: "1.0.0",
      description: `${ctx.projectName} Chrome Extension`,
      permissions: ["storage", "activeTab"],
      action: {
        default_popup: "popup.html",
        default_title: ctx.projectName
      },
      background: {
        service_worker: "background.js"
      },
      content_scripts: [
        {
          matches: ["<all_urls>"],
          js: ["content.js"]
        }
      ]
    }, null, 2)
  }

  private static generateChromePopup(ctx: GenerationContext): string {
    return `import React from 'react'
import { createRoot } from 'react-dom/client'

function Popup() {
  return (
    <div style={{ width: '300px', padding: '20px' }}>
      <h1>${ctx.projectName}</h1>
      <p>Welcome to your Chrome extension!</p>
      <button onClick={() => chrome.tabs.query({active: true}, (tabs) => {
        console.log('Current tab:', tabs[0])
      })}>
        Get Current Tab
      </button>
    </div>
  )
}

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(<Popup />)`
  }

  private static generateChromePopupHTML(ctx: GenerationContext): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${ctx.projectName}</title>
</head>
<body>
  <div id="root"></div>
  <script src="popup.js"></script>
</body>
</html>`
  }

  private static generateChromeBackground(ctx: GenerationContext): string {
    return `chrome.runtime.onInstalled.addListener(() => {
  console.log('${ctx.projectName} extension installed')
})

chrome.action.onClicked.addListener((tab) => {
  console.log('Extension clicked on tab:', tab.id)
})`
  }

  private static generateChromeContent(ctx: GenerationContext): string {
    return `console.log('${ctx.projectName} content script loaded')

// Add your content script functionality here
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, extension active')
})`
  }

  private static generateChromePackageJson(ctx: GenerationContext): string {
    return JSON.stringify({
      name: ctx.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      version: "1.0.0",
      description: `${ctx.projectName} Chrome Extension`,
      scripts: {
        build: "vite build",
        dev: "vite build --watch"
      }
    }, null, 2)
  }

  private static generateChromeViteConfig(ctx: GenerationContext): string {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: 'src/popup/popup.tsx',
        background: 'src/background/background.ts',
        content: 'src/content/content.ts'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
})`
  }

  private static generateChromeTsConfig(ctx: GenerationContext): string {
    return JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        lib: ["ES2020", "DOM"],
        module: "ESNext",
        moduleResolution: "node",
        strict: true,
        jsx: "react-jsx",
        types: ["chrome"]
      },
      include: ["src/**/*"]
    }, null, 2)
  }

  // VS Code Extension generators
  private static generateVSCodePackageJson(ctx: GenerationContext): string {
    return JSON.stringify({
      name: ctx.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      displayName: ctx.projectName,
      description: `${ctx.projectName} VS Code Extension`,
      version: "0.0.1",
      engines: {
        vscode: "^1.80.0"
      },
      categories: ["Other"],
      activationEvents: [],
      main: "./out/extension.js",
      contributes: {
        commands: [
          {
            command: `${ctx.projectName.toLowerCase()}.hello`,
            title: "Hello World"
          }
        ]
      },
      scripts: {
        compile: "tsc -p ./",
        watch: "tsc -watch -p ./"
      }
    }, null, 2)
  }

  private static generateVSCodeExtension(ctx: GenerationContext): string {
    return `import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  console.log('${ctx.projectName} extension is now active!')

  const disposable = vscode.commands.registerCommand('${ctx.projectName.toLowerCase()}.hello', () => {
    vscode.window.showInformationMessage('Hello World from ${ctx.projectName}!')
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {
  console.log('${ctx.projectName} extension deactivated')
}`
  }

  private static generateVSCodeCommands(ctx: GenerationContext): string {
    return `import * as vscode from 'vscode'

export function registerCommands(context: vscode.ExtensionContext) {
  const commands = [
    vscode.commands.registerCommand('${ctx.projectName.toLowerCase()}.hello', () => {
      vscode.window.showInformationMessage('Hello from ${ctx.projectName}!')
    })
  ]

  commands.forEach(command => context.subscriptions.push(command))
}`
  }

  private static generateVSCodeTsConfig(ctx: GenerationContext): string {
    return JSON.stringify({
      compilerOptions: {
        module: "commonjs",
        target: "ES2020",
        outDir: "out",
        lib: ["ES2020"],
        sourceMap: true,
        rootDir: "src",
        strict: true
      },
      exclude: ["node_modules", ".vscode-test"]
    }, null, 2)
  }

  private static generateVSCodeLaunchConfig(ctx: GenerationContext): string {
    return JSON.stringify({
      version: "0.2.0",
      configurations: [
        {
          name: "Extension",
          type: "extensionHost",
          request: "launch",
          args: ["--extensionDevelopmentPath=${workspaceFolder}"],
          outFiles: ["${workspaceFolder}/out/**/*.js"],
          preLaunchTask: "${workspaceFolder}/npm: compile"
        }
      ]
    }, null, 2)
  }

  private static generateVSCodeReadme(ctx: GenerationContext): string {
    return `# ${ctx.projectName}

${ctx.projectName} VS Code Extension

## Features

- Hello World command

## Requirements

- VS Code 1.80.0 or higher

## Extension Settings

This extension contributes the following settings:

* \`${ctx.projectName.toLowerCase()}.enable\`: Enable/disable this extension.

## Known Issues

None at this time.

## Release Notes

### 1.0.0

Initial release of ${ctx.projectName}`
  }

  // CLI Tool generators
  private static generateCLIIndex(ctx: GenerationContext): string {
    return `#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import { helloCommand } from './commands/hello'

const program = new Command()

program
  .name('${ctx.projectName.toLowerCase()}')
  .description('${ctx.projectName} CLI Tool')
  .version('1.0.0')

program
  .command('hello')
  .description('Say hello')
  .option('-n, --name <name>', 'name to greet', 'World')
  .action(helloCommand)

program.parse()`
  }

  private static generateCLICommand(ctx: GenerationContext, commandName: string): string {
    return `import chalk from 'chalk'

export async function ${commandName}Command(options: { name: string }) {
  console.log(chalk.green(\`Hello \${options.name} from ${ctx.projectName}!\`))
}`
  }

  private static generateCLIPackageJson(ctx: GenerationContext): string {
    return JSON.stringify({
      name: ctx.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      version: "1.0.0",
      description: `${ctx.projectName} CLI Tool`,
      main: "dist/index.js",
      bin: {
        [ctx.projectName.toLowerCase()]: "./dist/index.js"
      },
      scripts: {
        build: "tsc",
        start: "node dist/index.js",
        dev: "ts-node src/index.ts"
      }
    }, null, 2)
  }

  private static generateCLITsConfig(ctx: GenerationContext): string {
    return JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        module: "commonjs",
        outDir: "./dist",
        rootDir: "./src",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist"]
    }, null, 2)
  }

  private static generateCLIReadme(ctx: GenerationContext): string {
    return `# ${ctx.projectName}

A powerful CLI tool built with TypeScript and Commander.js

## Installation

\`\`\`bash
npm install -g ${ctx.projectName.toLowerCase()}
\`\`\`

## Usage

\`\`\`bash
${ctx.projectName.toLowerCase()} hello --name "Your Name"
\`\`\`

## Commands

- \`hello\`: Say hello to someone

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\``
  }

  // Shopify App generators
  private static generateShopifyRoot(ctx: GenerationContext): string {
    return `import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"

export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}`
  }

  private static generateShopifyIndex(ctx: GenerationContext): string {
    return `import { Page, Layout, Card, Button } from "@shopify/polaris"

export default function Index() {
  return (
    <Page title="${ctx.projectName}">
      <Layout>
        <Layout.Section>
          <Card>
            <p>Welcome to your Shopify app!</p>
            <Button primary>Get Started</Button>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}`
  }

  private static generateShopifyServer(ctx: GenerationContext): string {
    return `import { shopifyApp } from "@shopify/shopify-app-remix/server"
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10"

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: ["read_products"],
  appUrl: process.env.SHOPIFY_APP_URL!,
  restResources,
})

export default shopify
export const authenticate = shopify.authenticate`
  }

  private static generateShopifyPackageJson(ctx: GenerationContext): string {
    return JSON.stringify({
      name: ctx.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      private: true,
      sideEffects: false,
      version: "1.0.0",
      scripts: {
        build: "remix build",
        dev: "shopify app dev",
        start: "remix-serve build"
      }
    }, null, 2)
  }

  private static generateShopifyConfig(ctx: GenerationContext): string {
    return `# Learn more about configuring your app at https://shopify.dev/docs/apps/tools/cli/configuration

name = "${ctx.projectName}"
client_id = "YOUR_CLIENT_ID"
application_url = "https://localhost:3000"
embedded = true

[access_scopes]
scopes = "read_products"

[auth]
redirect_urls = [
  "https://localhost:3000/auth/callback",
  "https://localhost:3000/auth/shopify/callback",
]

[webhooks]
api_version = "2023-10"

[pos]
embedded = false`
  }

  // Discord Bot generators
  private static generateDiscordBot(ctx: GenerationContext): string {
    return `import { Client, GatewayIntentBits, Collection } from 'discord.js'
import dotenv from 'dotenv'
import { pingCommand } from './commands/ping'

dotenv.config()

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})

// Commands collection
client.commands = new Collection()
client.commands.set('ping', pingCommand)

client.once('ready', () => {
  console.log(\`\${client.user?.tag} is online!\`)
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = client.commands.get(interaction.commandName)
  if (!command) return

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({ content: 'There was an error!', ephemeral: true })
  }
})

client.login(process.env.DISCORD_TOKEN)`
  }

  private static generateDiscordCommand(ctx: GenerationContext, commandName: string): string {
    return `import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export const pingCommand = {
  data: new SlashCommandBuilder()
    .setName('${commandName}')
    .setDescription('Replies with Pong!'),
  
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Pong!')
  }
}`
  }

  private static generateDiscordEvent(ctx: GenerationContext, eventName: string): string {
    return `import { Client } from 'discord.js'

export function ${eventName}Event(client: Client) {
  client.once('${eventName}', () => {
    console.log(\`\${client.user?.tag} is ready!\`)
  })
}`
  }

  private static generateDiscordPackageJson(ctx: GenerationContext): string {
    return JSON.stringify({
      name: ctx.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      version: "1.0.0",
      description: `${ctx.projectName} Discord Bot`,
      main: "dist/index.js",
      scripts: {
        build: "tsc",
        start: "node dist/index.js",
        dev: "ts-node src/index.ts"
      }
    }, null, 2)
  }

  private static generateDiscordEnvExample(): string {
    return `DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here`
  }
}

// Initialize extension templates
ExtensionTemplateEngine.initialize()
