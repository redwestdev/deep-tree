# Deep Tree — React.js

## Installation

```bash
npm install @redwestdev/react-deep-tree
# or
pnpm add @redwestdev/react-deep-tree
```

After installation, two things happen automatically:

1. `ARCHITECTURE.md` is copied to your project root — a self-contained reference of this architecture for AI assistants (Cursor, Copilot, Claude Code, etc.)
2. A `deep-tree:init` script is added to your `package.json`

### If ARCHITECTURE.md was not created

Some package managers disable postinstall scripts by default. Run the init script manually:

```bash
npm run deep-tree:init
# or, if the script wasn't added to package.json:
npx deep-tree-react
```

### `deep-tree:init` script

Copies `ARCHITECTURE.md` to your project root. Safe to re-run — skips if the file already exists. Run it again after updating the package to refresh the architecture reference.

---

## Introduction

Deep Tree is a modular file architecture for React.js applications, focused on scalability of large frontend projects.

> Abstract specification: [Deep Tree Core](../core/README.md)

This document describes React-specific rules and examples on top of the core.
All base concepts (entities, layers, groups, sharing) are described in core.




## React-specific Entity Details

### Composite entity — index.ts

```ts
// HomePage/index.ts
export { HomePage } from './HomePage';
```

### View file — `.tsx`

The main component file uses the `.tsx` extension.

```
HomePage/
  index.ts
  HomePage.tsx        ← view
```




## Core Entities

### Pages

React pages are components without props that receive data through context.

```
src/
  pages/
    HomePage/
      index.ts
      HomePage.tsx
      sections/
        HeroSct/
          index.ts
          HeroSct.tsx
        BenefitsSct/
          index.ts
          BenefitsSct.tsx
      components/
        CallToAction/
          index.ts
          CallToAction.tsx
```

### Sections

A section does not accept props — it gets data from context or a local hook:

```tsx
// FeaturesSct/FeaturesSct.tsx
import { useHomeContext } from '../../context';
import { FeatureCard } from './components/FeatureCard';

export function FeaturesSct() {
  const { features } = useHomeContext();

  return (
    <section>
      {features.map(f => <FeatureCard key={f.id} {...f} />)}
    </section>
  );
}
```

### Components

```
src/
  components/
    Avatar/
      index.ts
      Avatar.tsx
      types.ts
      styles.module.scss
```




## Project Structure Example

```
src/
  pages/
    HomePage/
      index.ts
      HomePage.tsx
      context.ts
      sections/
        HeroSct/
          index.ts
          HeroSct.tsx
          components/
            Highlight/
              index.ts
              Highlight.tsx
        FeaturesSct/
          index.ts
          FeaturesSct.tsx
          components/
            FeatureCard/
              index.ts
              FeatureCard.tsx
      components/
        CallToAction/
          index.ts
          CallToAction.tsx
  components/
    Button/
      index.ts
      Button.tsx
      styles.module.scss
    Avatar/
      index.ts
      Avatar.tsx
      types.ts
  hooks/
    useViewport.ts
  utils/
    formatPrice.ts
  styles/
    globals.scss
```

> In React the logic layer is named `hooks` (vs `composables` in Vue).




## Layers — React-specific

### `hooks` layer

Hooks are stored in the `hooks` layer:

```
hooks/
  useViewport.ts
  useDebounce.ts
```

### File layers

```
hooks.ts            ← temporary hooks layer (instead of a folder)
types.ts
utils.ts
constants.ts
context.ts
styles.module.scss
```




## Sharing — Context in React

To pass state down the tree use `context.ts`:

```ts
// HomePage/context.ts
import { createContext, useContext } from 'react';

type THomeContext = {
  title: string;
  features: TFeature[];
};

export const HomeContext = createContext<THomeContext | null>(null);

export function useHomeContext() {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error('useHomeContext: no provider');
  return ctx;
}
```




## Manager

A manager is implemented via React Context.

### Structure

```
src/
  managers/
    ReportMng/
      index.ts
      ReportMng.tsx     ← provider component
      useController.ts  ← hook with business logic and state
```

`useController.ts` — all business logic and state:

```ts
// ReportMng/useController.ts
import { useState } from 'react';

export function useController() {
  const [items, setItems] = useState<TReportItem[]>([]);

  function addItem(item: TReportItem) {
    setItems(prev => [...prev, item]);
  }

  return { items, addItem };
}
```

`ReportMng.tsx` — provider, passes controller result into context:

```tsx
// ReportMng/ReportMng.tsx
import { createContext, useContext, ReactNode } from 'react';
import { useController } from './useController';

type TReportMng = ReturnType<typeof useController>;
const ReportContext = createContext<TReportMng | null>(null);

export function useReportMng() {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error('useReportMng: no provider');
  return ctx;
}

export function ReportMng({ children }: { children: ReactNode }) {
  const controller = useController();
  return (
    <ReportContext.Provider value={controller}>
      {children}
    </ReportContext.Provider>
  );
}
```

### Recommended stack
- **react-query** — server state: fetching, caching, synchronization.
- **Manager** — local UI state: theme, player, modals, cart.
- **Redux / Zustand** — when advanced devtools and time-travel are needed (rare scenario).




## Utilities (optional)

### `createSafeContext`

Creates a context and a safe access hook in one line.

```ts
// HomePage/context.ts
import { createSafeContext } from '@redwestdev/react-deep-tree';

export const [HomeContext, useHomeContext] = createSafeContext<THomeContext>('HomeContext');
```

### `createManager`

Creates a manager provider and access hook — all boilerplate disappears.

Simple manager:

```tsx
// ReportMng/ReportMng.tsx
import { createManager } from '@redwestdev/react-deep-tree';

export const [ReportMng, useReportMng] = createManager(useController, undefined, 'ReportMng');
```

Manager with its own UI:

```tsx
import { createManager } from '@redwestdev/react-deep-tree';

export const [ReportMng, useReportMng] = createManager(
  useController,
  (ctrl) => ctrl.isOpen && <ReportModal />,
  'ReportMng'
);
```




## Data Types

```ts
interface TTeamMember {
  id: string;
  name: string;
}

type TProfile = {
  userId: string;
  avatar: string;
};
```

> Full typing rules: [Deep Tree Core](../core/README.md#data-types)
