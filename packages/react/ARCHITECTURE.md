# Deep Tree — Architecture Reference

> **⚠️ Managed file — do not edit.**
> This file is copied by [`@redwestdev/react-deep-tree`](https://www.npmjs.com/package/@redwestdev/react-deep-tree) and may be overwritten on package updates.
> Project-specific overrides and exceptions go into **`ARCHITECTURE.local.md`** next to this file. AI assistants must read both; on conflict, local rules win.
>
> Full docs and rationale: **https://deep-tree.dev**

---

## Marker legend

- **MUST** — mandatory. Violation is an error.
- **FORBID** — prohibited. Violation is an error.
- **MAY** — optional. Presence or absence is fine; only the shape (when present) is constrained.
- **SIGNAL** — not an error; flag for review. Ask the user; if intentional, record as an exception in `ARCHITECTURE.local.md`.

---

## Handling exceptions and unusual patterns

When code triggers a **SIGNAL**, or an unusual pattern appears that these rules do not explicitly cover, the AI assistant must:

1. **Ask the user** — describe the pattern and which rule it deviates from (if any).
2. **If the user confirms the deviation is intentional**, record it in `ARCHITECTURE.local.md` as a project-specific rule or exception, with a short reason (one line — what is allowed and why).
3. On every subsequent check, read `ARCHITECTURE.local.md` first. Entries there are authoritative and override the base rules on conflict — the same deviation must not be questioned twice.

Do not silently autofix, ignore, or accept deviations. Either flag them, or write them down. `ARCHITECTURE.local.md` is the project's accumulated memory of "why we do it this way here."

If `ARCHITECTURE.local.md` does not exist yet and the user confirms a deviation, create it with a short header and the new entry.

---

## Core concept

Deep Tree arranges **entities** as a tree. Each entity has access to its ancestors and manages its children.

An entity is either:
- a **single (atomic) entity** — one file holding one semantic object, or
- a **composite entity** — a folder that groups files under a common purpose.

---

## Composite Entity

Folder grouping files under one purpose. Contains layers, file layers, single entities, and auxiliary files.

**MUST:**
- Folder name is PascalCase.
- Root `index.ts` exists and contains re-exports only.
- Between any two composite entities there is always a **layer** or **group**. Two composite entities cannot be direct siblings, and a composite cannot sit directly inside another composite.

**FORBID:**
- Any logic in `index.ts` beyond re-exports.

**Allowed / not allowed:**

```
✅ Button/                     Button is composite
     Button.tsx
     components/               ← layer between two composites
       Icon/                   Icon is composite
         Icon.tsx

❌ Button/                     composite
     Button.tsx
     Icon/                     ← composite directly inside composite, no layer
       Icon.tsx

❌ sections/
     HeroSct/                  composite
       HeroSct.tsx
       FeaturesSct/            ← two composites as siblings without a layer
         FeaturesSct.tsx
```

`index.ts` is only a re-export:

```ts
// HomePage/index.ts
export { HomePage } from './HomePage';
```

---

## Single Entity

A single file holding one independent semantic object: class, function/hook, configuration, one data set, one image, and so on.

**MUST:**
- Exactly one independent semantic object per file.

---

## Page

Composite entity representing a top-level screen. Not repeated across the app.

**MUST:**
- Composite entity, folder name PascalCase, suffix `{NAME}Page` (example: `HomePage`).
- Root `index.ts` (re-export only).
- View file `{DIR_NAME}.tsx` (DIR_NAME = folder name).
- Located only in the `pages` layer.

**FORBID:**
- Nesting a `pages` layer inside.

**SIGNAL:**
- Props present → ask if intentional. Screen-wide data (locale, translation dictionary, feature-flag config, integration keys) is a legitimate exception; record it in `ARCHITECTURE.local.md`.

---

## Section

Composite entity that splits parent logic into a dedicated block. Sections can exist inside pages, sections, and components.

**MUST:**
- Composite entity, folder name PascalCase, suffix `{NAME}Sct` (example: `HeroSct`).
- Root `index.ts` (re-export only).
- View file `{DIR_NAME}.tsx`.
- Located only in the `sections` layer.
- Imported and rendered only by the direct parent entity's `.tsx` file.

**FORBID:**
- Any props, including `children`. A section is a self-contained block that renders its own subtree, not a wrapper.
- Being imported by anything other than the direct parent's `.tsx` view. That means: descendant entities in the section's own subtree, sibling sections, ancestor components, and external entities must not import this section.
- Nesting a `pages` layer inside.

**SIGNAL:**
- Any prop present → ask if reusable. If yes, extract the repeated part into `components/`. If intentional, record in `ARCHITECTURE.local.md`.
- Section is reused elsewhere → move it into `components/`.

---

## Component

Reusable React composite entity, used across sections and pages.

**MUST:**
- Composite entity, folder name PascalCase.
- Root `index.ts` (re-export only).
- View file `{DIR_NAME}.tsx`.
- Located only in the `components` layer.

**FORBID:**
- Nesting a `pages` layer inside.

---

## Layer

Folder namespace grouping entities of one type. Folder name = layer name (`components`, `hooks`, `sections`, `pages`, …). A new entity type requires a new layer.

**MUST:**
- Layer name is camelCase.
- Contains only entities of its own type (hooks in `hooks`, components in `components`, styles in `styles`) or groups of those entities.
- A new layer appears only **inside an entity** — never directly inside another layer (a component may have its own `sections`, a section may have its own `components`, and so on).

**FORBID:**
- A layer as a direct child of another layer (no entity or group between them).
- Mixing entity types inside a single layer.

**MAY:**
- `index.ts` is optional; if present, re-exports only.

**Common layer names:** `pages`, `sections`, `components`, `ui`, `hooks`, `utils`, `types`, `api`, `styles`, `managers`.

**Allowed / not allowed:**
- `components(layer) → Button(entity)` — ok
- `components(layer) → useGenPass(entity)` — not ok (hook belongs to `hooks` layer)
- `hooks(layer) → other(group) → useSomeHook(entity)` — ok
- `components(layer) → Button(entity) → hooks(layer) → useOnMouseMoveHandler(entity)` — ok

---

## File Layer

A single file that plays the role of a layer while its contents fit in one file and no sub-entities or groups are needed.

**MUST:**
- File name matches the layer type, no prefixes: `types.ts`, `hooks.ts`, `utils.ts`, `helpers.ts`, `constants.ts`, `styles.module.scss`.
- Contains exports of one entity type only (all hooks, or all utils, or all types — not mixed).
- When expanding to a folder layer, keep the layer name and split the contents into separate entities.

**FORBID:**
- Mixing entity types in one file (hooks and utils in the same file, for example).

**SIGNAL:**
- A second entity of the same type appears, or the file becomes inconvenient for navigation/tests → expand into a folder layer.
- A nested structure (groups) is needed → expand into a folder layer.

---

## Group

Entities united by common meaning inside one layer or another group. Groups exist to unload layers.

**MUST:**
- Group name is camelCase.
- Contains only entities of the parent layer type (a group inside `components` contains only components).
- Groups can nest in groups.

**FORBID:**
- Layer directly inside a group.
- Group serving as a container for a single entity.
- Group name matching any layer name.

**MAY:**
- `index.ts` is optional; if present, re-exports only.

**Allowed / not allowed:**
- `components(layer) → buttons(group) → Button(entity)` — ok
- `components(layer) → buttons(group) → outlined(group) → Button(entity)` — ok
- `others(group) → components(layer) → Button(entity)` — not ok (layer inside group)
- `components(layer) → buttons(group) → useSomeHook(entity)` — not ok (wrong entity type in group)
- `components(layer) → buttons(group) → Button(entity) → hooks(layer) → someHooks(group) → useSomeHook(entity)` — ok

---

## Sharing (Access rule)

A child entity may use the layers, file layers, and single entities of all its ancestors up to the `src` root. An entity exists only in the branch where it is actually used and does not spread to neighboring branches.

**MUST:**
- Import only **upward along your own branch** — from parent layers, file layers, and single entities.
- To pass something down the tree, place it as a single entity or file layer next to the view.

**FORBID:**
- Import from a neighboring branch.
- Import from an ancestor's view file (`.tsx`). Ancestor views are not an import source for children.

**How to share:**

| What we share | How to define it |
|---------------|------------------|
| Data / callbacks down the tree | **Context** — inline in the entity's `.tsx` (see Context) |
| Data / callbacks with named access hook | **Manager** in the `managers` layer (see Manager) |
| Common styles | `styles.module.scss` — file layer next to `.tsx` |

**Move an entity higher** when it is needed in two or more branches — to the nearest common ancestor layer.

**Example:**

```
src/
  components/              ← available to everyone
    Button/
  pages/
    HomePage/
      components/          ← available to HomePage and all its descendants
        CallToAction/
      sections/
        HeroSct/           ← sees: src/components, HomePage/components
          components/      ← available only inside HeroSct
            Highlight/     ← sees: src/components, HomePage/components, HeroSct/components
        FeaturesSct/       ← sees: src/components, HomePage/components
                           ← DOES NOT see: HeroSct/components (neighboring branch)
```

---

## Nesting Depth

**MUST:**
- No depth limit if the nesting is local (large, focused functionality).
- Move an entity higher only when it is actually used in two or more branches — to the nearest common ancestor layer.

---

## Controller

Business-logic aggregator hook for a composite entity. Holds the entity's state (`useState`), effects (`useEffect`), computed values (`useMemo`), and handlers (`useCallback`) in one place. The same controller is consumed by both **Manager** and any entity acting as a **Context** provider — only the wrapper around it changes.

**MUST:**
- File name: `useController.ts`, placed at the root of the entity next to the view file.
- Exports a single hook named `useController`.
- Aggregates the entity's business logic in one place — state, effects, computed values, handlers.
- Returns a single object; its shape becomes the value of the surrounding Manager / Context.
- Keeps the entity's `.tsx` file thin — the view only calls `useController`, wires up the provider, and renders markup.

**FORBID:**
- Placing `useController` in a `hooks/` layer or anywhere outside its owning entity. It is not a shared hook.
- Splitting `useController` into multiple exported hooks. If the aggregator grows too large, that is a signal to split the entity itself, not the controller.

**Example:**

```ts
// ReportsSct/useController.ts
import { useCallback, useMemo, useState } from 'react';
import type { Report } from '@/types';

export function useController() {
  const [items, setItems] = useState<Report[]>([]);
  const [query, setQuery] = useState('');

  const visible = useMemo(
    () => items.filter(r => r.title.includes(query)),
    [items, query]
  );

  const add = useCallback((r: Report) => {
    setItems(prev => [...prev, r]);
  }, []);

  return { items: visible, query, setQuery, add };
}
```

The returned object becomes the provider's value. The same controller wires into either a Context or a Manager — the wrapper differs, the controller does not.

---

## Manager

Composite independent entity: an extracted provider with context and logic, focused on one task. Provides a **named access hook** — that named hook is the visible distinction between a Manager and a plain Context.

**MUST:**
- Composite entity, folder name PascalCase, suffix `{NAME}Mng` (example: `ReportMng`).
- Root `index.ts` (re-export only).
- Controller file `useController.ts` (see Controller).
- View file `{DIR_NAME}.tsx` — the provider wrapper.
- Exports a named access hook (example: `useReportMng`).
- Located only in the `managers` layer.

**FORBID:**
- Props other than `children`.

**File structure:**

```
src/
  managers/
    ReportMng/
      index.ts          # single export point
      ReportMng.tsx     # provider wrapper
      useController.ts  # business logic and state
```

**When to use Manager vs Context:**

| Situation | Choice |
|-----------|--------|
| Share data / callbacks inside one entity (e.g., `HomePage`) | Context |
| Remove props drilling between sections of one page | Context |
| Local business logic living with the entity | Context |
| Player accessible from header, footer, and any page | Manager |
| Theme switchable from anywhere in the application | Manager |
| Report modal called from different places | Manager |
| Logic scoped to a private zone or admin panel | Manager (localized to region) |

**Components inside a Manager:**

| Situation | Solution |
|-----------|----------|
| UI rendered by the provider, one call site | Local context or state — Manager is excessive |
| UI rendered by the provider, several call sites | Component inside the Manager — the provider renders it itself |
| Component is needed by external consumers | Move it to the `components` layer |

### `createManager` utility

Package exports `createManager` — a helper that removes provider boilerplate. Optional; you may write the provider manually.

```ts
import { createManager } from '@redwestdev/react-deep-tree';

// ReportMng/ReportMng.tsx
export const [ReportMng, useReportMng] = createManager(useController, undefined, 'ReportMng');
```

With provider-owned UI (modals, toasts, overlays):

```tsx
export const [ReportMng, useReportMng] = createManager(
  useController,
  (ctrl) => ctrl.isOpen && <ReportModal />,
  'ReportMng'
);
```

---

## Context

Lightweight alternative to Manager. Declared inline inside the entity's view file. **No named access hook** — consumers call `useContext(Ctx)` directly with the exported context object. Keeps the named-hook namespace clean and preserves a visible distinction from Manager.

**MUST:**
- Declared inline in the entity's `.tsx` file (not in a separate `context.ts`).
- Default value is an empty object cast to the controller's return type: `createContext({} as ReturnType<typeof useController>)`.
- Exported from the entity's `index.ts` alongside the component.
- Consumers use `useContext(Ctx)` directly.

**FORBID:**
- A named access hook (`useXxxCtx`) that wraps `useContext`. That belongs to Manager.
- A separate `context.ts` single entity for a one-line context.

**File structure (Section acting as a context provider):**

```
src/
  pages/
    HomePage/
      sections/
        MainSct/
          index.ts          # re-exports MainSct and MainSctCtx
          MainSct.tsx       # component + inline context
          useController.ts  # local logic
          sections/
            ChildSct/       # rendered by MainSct, consumes MainSctCtx
              index.ts
              ChildSct.tsx
```

**Provider (inline context lives next to the component; the section renders its own subtree, no `children` prop):**

```tsx
// MainSct/MainSct.tsx
import { createContext } from 'react';
import { useController } from './useController';
import { ChildSct } from './sections/ChildSct';

export const MainSctCtx = createContext({} as ReturnType<typeof useController>);

export function MainSct() {
  const controller = useController();
  return (
    <MainSctCtx.Provider value={controller}>
      <ChildSct />
    </MainSctCtx.Provider>
  );
}
```

**Entity `index.ts` re-exports both component and context:**

```ts
// MainSct/index.ts
export { MainSct, MainSctCtx } from './MainSct';
```

**Consumer:**

```tsx
// MainSct/sections/ChildSct/ChildSct.tsx
import { useContext } from 'react';
import { MainSctCtx } from '../..';

export function ChildSct() {
  const { items } = useContext(MainSctCtx);
  return <div>{items.length}</div>;
}
```

---

## Naming Scheme

**MUST:**
- Main file matches the entity name: `SomeComponent.tsx`.
- Auxiliary files without a prefix sit next to it: `types.ts`, `styles.module.scss`, `index.ts`.
- Tests and stories repeat the entity name: `SomeComponent.test.ts`, `SomeComponent.stories.ts`.
- Scheme is consistent inside a layer.

---

**Full documentation, examples, and rationale:** **https://deep-tree.dev**
