#!/usr/bin/env node
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, '..', 'README.md');
const projectRoot = process.env.INIT_CWD ?? process.cwd();

// Copy ARCHITECTURE.md
const dest = join(projectRoot, 'ARCHITECTURE.md');
if (existsSync(dest)) {
  console.log('Deep Tree: ARCHITECTURE.md already exists, skipping.');
} else {
  copyFileSync(src, dest);
  console.log('Deep Tree: ARCHITECTURE.md copied to project root.');
  console.log('  → Add it to your AI assistant context (Cursor, Copilot, Claude Code, etc.)');
}

// Inject init script into user's package.json
const pkgPath = join(projectRoot, 'package.json');
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (!pkg.scripts?.['deep-tree:init']) {
    pkg.scripts = pkg.scripts ?? {};
    pkg.scripts['deep-tree:init'] = 'deep-tree-react';
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log('Deep Tree: added "deep-tree:init" to package.json scripts.');
  }
}
