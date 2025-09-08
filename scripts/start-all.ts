/*
 * ECE Start All Apps (TypeScript)
 * Clean, prefixed logs and graceful shutdown.
 */

import { spawn } from 'node:child_process';
import * as path from 'node:path';
import * as readline from 'node:readline';

type Proc = {
  name: 'web' | 'mobile' | 'desktop';
  cwd: string;
  cmd: string;
  args: string[];
  env?: NodeJS.ProcessEnv;
};

const root = process.cwd();

const procs: Proc[] = [
  {
    name: 'web',
    cwd: path.join(root, 'apps/ece-web'),
    cmd: 'npm',
    // Pass through port to Next: `npm run dev -- -p 3001`
    args: ['run', 'dev', '--', '-p', '3001'],
  },
  {
    name: 'mobile',
    cwd: path.join(root, 'apps/ece-mobile'),
    cmd: 'npm',
    args: ['start'],
  },
  {
    name: 'desktop',
    cwd: path.join(root, 'apps/desktop'),
    cmd: 'npm',
    args: ['run', 'dev'],
  },
];

const COLORS = {
  reset: '\u001b[0m',
  web: '\u001b[38;5;39m', // blue
  mobile: '\u001b[38;5;205m', // pink
  desktop: '\u001b[38;5;82m', // green
  dim: '\u001b[2m',
} as const;

function prefix(name: Proc['name']) {
  return `${COLORS[name]}[${name.toUpperCase()}]${COLORS.reset}`;
}

function printBanner() {
  const line = '━'.repeat(64);
  console.log(`\n${COLORS.dim}${line}${COLORS.reset}`);
  console.log('🚀 Starting ECE Platform (web + mobile + desktop)');
  console.log(`${COLORS.dim}${line}${COLORS.reset}\n`);
}

type SpawnOpts = import('node:child_process').SpawnOptions;

function attach(proc: Proc) {
  const opts: SpawnOpts = {
    cwd: proc.cwd,
    env: { ...process.env, ...proc.env },
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  };

  const child = spawn(proc.cmd, proc.args, opts);

  const makeRl = (stream: NodeJS.ReadableStream) =>
    readline.createInterface({ input: stream });

  const out = makeRl(child.stdout!);
  const err = makeRl(child.stderr!);

  out.on('line', (line: string) => {
    if (line.trim().length === 0) return;
    console.log(`${prefix(proc.name)} ${line}`);
  });

  err.on('line', (line: string) => {
    if (line.trim().length === 0) return;
    console.error(`${prefix(proc.name)} ${line}`);
  });

  child.on('close', (code) => {
    console.log(`${prefix(proc.name)} exited with code ${code}`);
  });

  return child;
}

async function main() {
  printBanner();
  console.log(`${prefix('web')} http://localhost:3001`);
  console.log(`${prefix('mobile')} Expo dev server on http://localhost:8081`);
  console.log(`${prefix('desktop')} Electron app (dev)\n`);

  const children = procs.map(attach);

  const shutdown = () => {
    console.log('\nShutting down all services...');
    for (const child of children) {
      try {
        if (process.platform === 'win32') {
          // On Windows, SIGINT is not supported the same way
          child.kill('SIGTERM');
        } else {
          child.kill('SIGINT');
        }
      } catch {}
    }
    setTimeout(() => process.exit(0), 500);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
