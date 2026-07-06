# Deep Tree

Deep Tree is a file-based modular architecture for UI applications, focused on the scalability of large frontend projects. It is adapted for organizing frontend project files. It is not tied to a specific framework — it is applicable to any component-based UI stack.

**Full documentation:** [deep-tree.dev](https://deep-tree.dev)

## Goals

- Establish a unified file structure in the project
- Improve code readability and navigation
- Split large files into understandable parts
- Reduce the project's technical debt
- Increase flexibility and code reuse
- Lower the entry threshold for new developers

## Core Concepts (in brief)

- **Entity** — an atomic building block: a single file or a folder with a common purpose. Every entity is responsible for one thing.
- **Layer** — a folder namespace grouping entities of one type (`components`, `sections`, `pages`, `logic`, `utils`, …).
- **Sharing** — imports go only upward along your own branch; neighboring branches stay isolated.
- **Nesting** — depth is not limited when it is local; move things up only on real reuse.

For full rules, examples, and rationale see **[deep-tree.dev](https://deep-tree.dev)**.

## Packages

- **[@redwestdev/react-deep-tree](./packages/react)** — reference implementation for React.js

## Installation

```bash
npm install @redwestdev/react-deep-tree
# or
pnpm add @redwestdev/react-deep-tree
```

On install, `ARCHITECTURE.md` is copied to your project root — a self-contained architecture reference for AI assistants (Cursor, Copilot, Claude Code, etc.). See the [react package README](./packages/react/README.md) for details.

## Architecture Validation

To validate the Deep Tree file structure in your project, use [`@redwestdev/tree-lint`](https://www.npmjs.com/package/@redwestdev/tree-lint) — a CLI linter for architectural rules. It ships presets for common architectures, including Deep Tree.

```bash
npx @redwestdev/tree-lint init --preset=deep-tree
```

This installs a preset configuration into your project and wires up an npm script to run architecture checks from the CLI. Full documentation on the [npm package page](https://www.npmjs.com/package/@redwestdev/tree-lint).
