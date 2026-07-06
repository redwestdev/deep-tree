# @redwestdev/react-deep-tree

Reference implementation of [Deep Tree](https://deep-tree.dev) for React.js — a file-based modular architecture for scalable frontend projects. Not tied to a specific framework; this package provides React-flavored utilities and an architecture reference for AI assistants.

**Full documentation:** [deep-tree.dev](https://deep-tree.dev)

## Installation

```bash
npm install @redwestdev/react-deep-tree
# or
pnpm add @redwestdev/react-deep-tree
```

After installation, two things happen automatically:

1. `ARCHITECTURE.md` is copied to your project root — a self-contained architecture reference for AI assistants (Cursor, Copilot, Claude Code, etc.).
2. A `deep-tree:init` script is added to your `package.json`.

### If ARCHITECTURE.md was not created

Some package managers disable postinstall scripts by default. Run the init script manually:

```bash
npm run deep-tree:init
# or, if the script was not added to package.json:
npx deep-tree-react
```

### `deep-tree:init` script

Copies `ARCHITECTURE.md` to your project root. Safe to re-run — skips if the file already exists. Run it again after updating the package to refresh the architecture reference.

### Local overrides

`ARCHITECTURE.md` is a managed file — treat it as replaceable on package updates. If you need to override or extend the rules in your project, put your additions into **`ARCHITECTURE.local.md`** next to it. AI assistants should read both; local rules win on conflict.

## Core Concepts (in brief)

- **Entity** — an atomic building block: a single file or a folder with a common purpose. Every entity is responsible for one thing.
- **Layer** — a folder namespace grouping entities of one type (`components`, `sections`, `pages`, `hooks`, `utils`, …).
- **Sharing** — imports go only upward along your own branch; neighboring branches stay isolated.
- **Nesting** — depth is not limited when it is local; move things up only on real reuse.

For full rules, examples, and rationale see **[deep-tree.dev](https://deep-tree.dev)**.

## Utilities

- `createSafeContext` — creates a context and a safe access hook in one line.
- `createManager` — creates a manager provider and access hook, with optional provider-owned UI.

See [deep-tree.dev](https://deep-tree.dev) for usage.

## Architecture Validation

To validate the Deep Tree file structure in your project, use [`@redwestdev/tree-lint`](https://www.npmjs.com/package/@redwestdev/tree-lint) — a CLI linter for architectural rules. It ships presets for common architectures, including Deep Tree.

```bash
npx @redwestdev/tree-lint init --preset=deep-tree
```

Full documentation on the [npm package page](https://www.npmjs.com/package/@redwestdev/tree-lint).

## License

MIT
