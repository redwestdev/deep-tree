#!/usr/bin/env node
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Skip when running inside the package's own repo (development mode)
if (!__dirname.includes('node_modules')) process.exit(0);

const src = join(__dirname, '..', 'ARCHITECTURE.md');
const projectRoot = process.env.INIT_CWD ?? process.cwd();
const dest = join(projectRoot, 'ARCHITECTURE.md');
const pkgPath = join(projectRoot, 'package.json');

function copyArchitectureFile() {
  copyFileSync(src, dest);
  console.info('Deep Tree: ARCHITECTURE.md copied to project root.');
  console.info(
    '  → Add it to your AI assistant context (Cursor, Copilot, Claude Code, etc.)'
  );
}

async function run() {
  let shouldCopy = false;

  // Copy or update ARCHITECTURE.md
  if (!existsSync(dest)) {
    shouldCopy = true;
  } else {
    if (!process.stdin.isTTY) {
      console.info('Deep Tree: ARCHITECTURE.md already exists, skipping.');
    } else {
      const rl = createInterface({ input, output });
      console.warn('Deep Tree: ARCHITECTURE.md already exists.');
      const answer = await rl.question(
        '\nDo you want to overwrite it? (y/N): '
      );
      rl.close();

      if (answer.toLowerCase().trim().startsWith('y')) {
        console.info('Deep Tree: Overwriting ARCHITECTURE.md...');
        shouldCopy = true;
      } else {
        console.info('Deep Tree: Skipping architecture file refresh.');
      }
    }
  }

  if (shouldCopy) copyArchitectureFile();

  // Inject init script into user's package.json
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    if (!pkg.scripts?.['deep-tree:init']) {
      pkg.scripts = pkg.scripts ?? {};
      pkg.scripts['deep-tree:init'] = 'deep-tree-react';
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
      console.info(
        'Deep Tree: added "deep-tree:init" to package.json scripts.'
      );
    }
  }
}

run().catch((err) => {
  console.error('Deep Tree: Init failed', err);
  process.exit(1);
});
