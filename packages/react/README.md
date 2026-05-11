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
# or, if the script was not added to package.json:
npx deep-tree-react
```

### `deep-tree:init` script

Copies `ARCHITECTURE.md` to your project root. Safe to re-run — skips if the file already exists. Run it again after updating the package to refresh the architecture reference.

---

## Introduction

Deep Tree is a file-based modular architecture for React.js applications, focused on the scalability of large frontend projects.

The architecture is based on the principles of [SOLID](https://en.wikipedia.org/wiki/SOLID), adapted for organizing files in frontend projects.

## Goals

- Establish a unified file structure in a project
- Improve code readability and navigation
- Split large files into understandable parts
- Reduce the project's technical debt
- Increase flexibility and code reuse
- Lower the entry threshold for new developers

## Introduction to Entities

An entity is a logical software unit.

### Why Are Entities Needed?

An entity is the building block of the architecture. Without atomic units, there is nothing to build from. Every file or folder has a clear meaning, and nothing extra is stored in one unit.

For example, there may be the following kinds of entities:
component, style, image, hook, function, page, section, route,
helper, config, type, api-client, translation, and so on.

An entity is always responsible for one thing. (the SOLID single responsibility principle).

> Some entities may be unique and exist in a single instance. For example: config or mui-theme.

In the deep tree architecture, the system arranges **entities** as a tree,
where each entity has access to its parents and manages its child entities.

Any entity can be either a _single file_ or a _group of files united by a folder_.




### Composite Entity

A composite entity is a group of files united by a common folder. Inside it there may be layers (see layers), file layers (see file layers), and any auxiliary files/folders required for operation.

#### Why Is a Composite Entity Needed?

A composite entity and its `index.ts` solve the problem of encapsulation. A single file can be turned into a folder with several files at any moment — and the external import path will not change. From the outside, nobody knows about the internal structure: this is protection from accidental interference with implementation details.

#### Composite Entity Rules

- The folder name is PascalCase.
- A root `index.ts` is required; export outward only through it.
- Do not nest other composite entities of the same level (only layers/file layers and single entities).
- The structure inside the folder is self-contained.

`index.ts` is only a re-export, no logic:

```ts
// HomePage/index.ts
export { HomePage } from './HomePage';
```






### Single Entity

A single (atomic) entity is a file
that self-sufficiently stores one semantic object:
code (class, function/hook, configuration), data, text description, image, font, video, and so on.

#### Single Entity Rules

- Inside there is only one independent semantic object (class, function, configuration, one data set, one image, and so on).






## Base Entities

Visually, any layout can be divided into three conditional component levels:

- **Pages (pages / views)**
- **Sections (sections)**
- **Components (components)**

### Pages

Pages are large React components, composite entities. These are logically independent parts of an application; each performs its own business role and is not repeated.

#### Why Are Pages Needed?

Pages divide an application into large independent pieces. Each page is a separate context with a clear business role. This prevents the application from turning into a monolith where everything is mixed together.

#### Page Rules

- Always a composite entity with a PascalCase name and the `{NAME}Page` suffix (example: HomePage).
- A root `index.ts` is required; export outward only through it.
- A view file `${DIR_NAME}.tsx` is required (DIR_NAME = the page folder name).
- Usually without props.
- Stored only in the `pages` layer.

#### Exceptions to Page Rules

- A top-level data scope may come into a page (for example, locale, translation dictionary,
feature-flag config, integration keys), if it concerns the entire screen.

#### Page Examples

- HomePage — initial page, root page,
- AboutPage — tells about a company or product, introduces the team, events, and so on
- CatalogPage — product views, filtering, search, sorting
- ContactUsPage — contact methods

Minimal page structure:

```
src/
  pages/
    HomePage/
      index.ts            # single export point
      HomePage.tsx        # page view
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

Sections are dependent parts of a parent **React component**, composite entities; they split its logic into understandable blocks.

#### Why Are Sections Needed?

Sections save you from bloated components. Without them, all the logic of a page or large component settles in one file. A section takes part of this logic into its own folder — the parent component remains readable, and each block is handled separately.

> Any other component can always be divided into sections. Page, section, component may have sections!

#### Section Rules

- Always a composite entity with a PascalCase name and the `{NAME}Sct` suffix (example: HeroSct).
- A root `index.ts` is required; export outward only through it.
- A view file `${DIR_NAME}.tsx` is required (DIR_NAME = the section folder name).
- Props are not passed.
- Lives only in the `sections` layer; may contain layers except `pages`.
- Recommendation: Do not create a `sections` layer for one section — leave the logic in the parent or move repeated parts into `components` until at least two sections appear.

#### Exception to Section Rules

- In rare cases, a prop may get into a section, but if you want to reuse the section as a whole, it is a signal to move repeated parts into components.

#### Section Examples

For example, HomePage is too large if you try to create the whole page at once — the code will be too large.
Naturally, large code means low flexibility, difficult implementation, and poor readability.

As we remember, any page is divided into logical sections, so it is logical to divide it into sections.
Conditional examples:

- HeroSct
- BenefitsSct
- FeaturesSct
- ContactUsSct

Each section is an integral part of the HomePage logic, and each section is independent from another section.
In this example, each section has the suffix Section at the end, or the shortened Sct.

Minimal section structure:

```
src/
  pages/
    HomePage/
      sections/
        FeaturesSct/
          index.ts          # section export
          FeaturesSct.tsx   # section view
          components/
            FeatureCard/
              index.ts
              FeatureCard.tsx
          hooks.ts          # file layer for local section logic
```

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

Components are reusable React components (composite entities) that can be used in different sections and pages.

#### Why Are Components Needed?

Components are what repeats. A button, card, avatar — the same thing in different places. Unlike a section, a component is not tied to a specific parent: its task is precisely repetition and reuse.

> Components are stored in the **components** layer.
> To split the logic of a **component**, sections may be used.

#### Component Rules

- Always a composite entity with a PascalCase name.
- A root `index.ts` is required; export outward only through it.
- A view file `${DIR_NAME}.tsx` is required (DIR_NAME = the component folder name).
- Stored only in the `components` layer.
- May contain layers except `pages`.

Minimal component structure:

```
src/
  components/
    Avatar/
      index.ts          # component export
      Avatar.tsx        # view
      types.ts          # file layer with types, if needed
      styles.module.scss
```



Recommended naming scheme (soft rule): the main file matches the entity name (SomeComponent.tsx),
auxiliary files without a prefix are placed next to it
(types.ts, styles.module.scss, index.ts),
and tests/stories repeat the entity name (SomeComponent.test.ts,
SomeComponent.stories.ts).
Keep this scheme consistent inside a layer, so search and navigation remain predictable.


## Expanded Project Structure Example

Below is an example structure for one page with sections and reusable components. Use it as a reference when creating new entities.

```
src/                      # root
  pages/                  # pages layer
    HomePage/             # page entity
      index.ts            # root of the page entity
      HomePage.tsx        # implementation of the page entity
      sections/           # sections layer
        HeroSct/          # section entity
          index.ts
          HeroSct.tsx
          components/     # layer
            Highlight/
              index.ts
              Highlight.tsx
        FeaturesSct/      # section entity
          index.ts
          FeaturesSct.tsx
          components/     # layer
            FeatureCard/  # component entity
              index.ts
              FeatureCard.tsx
      components/         # components layer
        CallToAction/
          index.ts
          CallToAction.tsx
  components/             # components layer
    Button/               # component entity
      index.ts
      Button.tsx
      styles.module.scss  # styles file layer
    Avatar/               # component entity
      index.ts
      Avatar.tsx
      types.ts            # types file layer
  hooks/                  # layer
    useViewport.ts        # hook entity
  utils/                  # layer
    formatPrice.ts        # utility entity / function entity
  styles/                 # styles layer
    globals.scss          # style entity
```














## Layers

A layer is a separate folder namespace in which entities are logically grouped.
The folder name is the layer name: for example components, hooks, sections, pages, and so on.
If a new entity type appears, you must create its own layer folder for it.

### Why Are Layers Needed?

Layers create boundaries and a development context. You enter `hooks` — there are hooks and rules for working with them. You enter `managers` — there are managers with their own logic. A layer signals what can be expected here and prevents different entity types from mixing in one place.


[//]: # (You have often seen layers in a typical React.js project in src.)
[//]: # (For example: pages, sections, components, hooks, ui, types, api, routes, styles, images, translations, helpers, utils, types.)

[//]: # (### Layer Goal)
[//]: # (Organization and logical grouping of **entities** for ordering)

### Layer Rules:

- The layer name is camelCase.
- A layer is not nested directly inside a layer: a new layer appears only after an entity (a component may have its own `sections`, a section may have its own `components`, and so on).
- A layer may contain groups.
- Inside there are only entities of its own type (hooks in `hooks`, components in `components`, styles in `styles`).
- `index.ts` may be present, but is not required.

### Layer Usage Examples:

- components(layer)->Button(entity). - ok
- components(layer)->useGenPass(entity). - not ok
- hooks(layer)->other(group)->useSomeHook(entity). - ok
- components(layer)->Button(entity)->hooks(layer)->useOnMouseMoveHandler(entity) - ok

### Layer Name Examples:

- pages
- sections
- components
- ui
- hooks
- utils
- types
- api
- styles

## File Layers (single-file layers)

File layers temporarily perform the role of a layer when there is little code and no nested entities or groups.
Over time, it should be expanded into a full folder layer as functionality grows.

### When It Is Allowed

- All layer logic fits in one file and remains readable.
- There are no nested entities/groups; this is a temporary form of a layer.

### When to Expand Into a Regular Layer

- A second entity of the same type appears or the file becomes inconvenient for navigation/tests.
- A need for a nested structure appears (groups). Usually because of the number of entities inside the file layer.

### Examples of Inline Layer Names

- `types.ts`
- `hooks.ts`
- `utils.ts`
- `helpers.ts`
- `constants.ts`
- `styles.module.scss`

### Inline Layer Rules

- The file name matches the layer type; prefixes are not needed.
- Do not mix different entity types in one inline layer (hooks and utils in one file are not allowed).
- When expanding, keep the layer name and split the contents into separate entities.


## Groups

Groups are entities united by a common meaning inside one layer or another group.
A group may be split into subgroups, and those into other groups, and so on infinitely as needed.
The task of a group is to unload layers (see layers).

### Why Are Groups Needed?

As a project scales, layers grow and turn into a dump. Groups bring order inside a layer — without changing the structure of the tree itself. This is protection from chaos at the level of one layer when there is a large number of entities.

### Group Rules

- The group name is camelCase.
- Layers inside a group are not allowed; groups may be nested in groups.
- Inside there are only entities of the parent layer type (in `components` — only components).
- A group does not serve as a container for one single entity.
- The group name does not match layer names.
- `index.ts` may be present, but is not required.

### Group Usage Examples:

- components(layer)->buttons(group)->Button(entity) = ok
- components(layer)->buttons(group)->outlined(group)->Button(component) = ok
- others(group) -> components(layer) -> Button(entity) = NOT ok
- components(layer)->buttons(group)->useSomeHook(entity) = NOT ok
- components(layer)->buttons(group)->Button(entity)->hooks->someHooks(group)->useSomeHook(entity) = ok

### Group Examples:

- **others** (ex: hooks(layer)->**others**(group))
- **header** (ex: components(layer)->**header**(group))
- **report** -> (ex: components(layer)->**report**(group))


## Entity Sharing (sharing)

A child entity may use the layers and file layers of all its ancestors up to the `src` root.
The deeper an entity is, the more available dependencies it has from above.
An entity exists only in the tree branch where it is actually used and does not spread to neighboring branches of the parent.

### Why Is Sharing Needed?

Sharing is a constant living process in a project, not a one-time decision. It solves the problem of code weight: the higher an entity is in the tree, the more dependencies and responsibility it has; the lower it is, the more local it is. A task appeared, you saw that a component started repeating in different places — you moved it higher to the nearest common ancestor. This is sharing.

### Access Rule

You may import only **up along your own branch** — from parent layers, file layers, and single entities.
Importing from a **neighboring branch** is not allowed.

Ancestor **view** files (`.tsx`) are not an import source for children.
If you need to pass something down the tree, move it into a separate single entity or file layer next to the view:

| What we share | How to define it |
|---------------|------------------|
| Context | `context.ts` — a single entity next to `.tsx` |
| Common styles | `styles.module.scss` — a file layer next to `.tsx` |

```
HomePage/
  index.ts
  HomePage.tsx              # view — children do not import it directly
  HomePage.module.scss      # styles of HomePage itself
  context.ts                # single entity — available to all children
  styles.module.scss        # file layer — common styles for children
  sections/
    HeroSct/
      HeroSct.tsx           # ← may import context.ts and styles.module.scss
```

`context.ts` defines context and an access hook for it:

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

### Example

```
src/
  components/              ← available to everyone
    Button/
  pages/
    HomePage/
      components/          ← available to HomePage and all its children
        CallToAction/
      sections/
        HeroSct/           ← sees: src/components, HomePage/components
          components/      ← available only inside HeroSct
            Highlight/     ← sees: src/components, HomePage/components, HeroSct/components
        FeaturesSct/       ← sees: src/components, HomePage/components
                           ← DOES NOT see: HeroSct/components (neighboring branch)
```

### When to Move an Entity Higher

If an entity is needed in two or more branches, move it to the nearest common ancestor layer.

Example: `HeroSct` and `FeaturesSct` both use `FeatureCard` → move it to `HomePage/components`.

## Project Nesting Depth

The depth of **nesting is not limited** if it is local, large functionality (for example, a heavy modal window).
Guideline: go as deep as needed for readability inside this context;
moving entities higher makes sense only when there is real sharing outside the current branch.

### Why Is Nesting Depth Needed?

Depth solves the problem of focus. The deeper you work, the less surrounding code you touch, and the more precise and local the change is. You went down to the right place, fixed only what needed to be fixed, and moved on. Move entities higher only when they are really needed in several places, not "just in case".


## Manager

A manager is a composite independent entity: an extracted provider with context and logic,
focused on one specific task.

In essence, it is a lighter alternative to a global state manager: it does not require dependencies,
does not store everything in one place, and is syntactically free.

### Manager Rules

- Always a composite entity with a PascalCase name and the `{NAME}Mng` suffix (example: ReportMng).
- A root `index.ts` is required; export outward only through it.
- A controller file `useController.ts` is required — passed logic is stored in it.
- A view file `${DIR_NAME}.tsx` is required (DIR_NAME = the manager folder name).
- Lives only in the `managers` layer.
- Often uses no props except `children`.

### Manager File Structure

```
src/
  managers/
    ReportMng/
      index.ts          # single export point
      ReportMng.tsx     # wrapper component / provider
      useController.ts  # hook with business logic and state inside
```

`useController.ts` — all business logic and manager state:

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

`ReportMng.tsx` — provider, passes the controller result into context:

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

### When to Use a Manager

A manager is always a composite entity. If the logic is too simple, it is a hook or `context.ts`, not a manager.

| Situation | Solution |
|-----------|----------|
| State is needed only in one component | Local `useState` / `useReducer` |
| Need to pass data without drilling, logic is simple | `context.ts` + hook at the parent |
| There is business logic, several call sources | Manager |
| UI is needed above the tree (toasts, modals, overlays) | Manager with `renderOwn` |
| Need time-travel, advanced devtools | Redux / Zustand |

Regular `context` solves only the props-drilling problem — it has no structure, rules, or dedicated place in the project. A manager is a composite entity with its own layers and conventions.

A global state manager (Redux/Zustand) makes data available everywhere by default. A manager is physically unavailable where its provider does not exist — this is not an agreement, it is a limitation of React itself.

`AuthPage` cannot accidentally take `useCartMng` — the provider simply is not there.

**Example:** `useTheme` with a simple toggle + persistence is enough as a hook or `context.ts` in `App`.
If synchronization with the system theme, transition animations, and several themes appear, `ThemeMng` is justified.

> One manager variant is always a composite entity. There is no need to think "which type to choose".

### Recommended Stack

A manager works well together with **react-query**:

- **react-query** — server state: loading, cache, synchronization, optimistic updates.
- **Manager** — local UI state: theme, player, modals, cart.

In most cases, this combination is enough. Redux/Zustand remains relevant where advanced devtools and time-travel debugging are needed — but this is a rare scenario, not the default one.

### Components Inside a Manager

A manager, by its nature, is a center of gravity for logic. Over time, hooks, utilities, API clients, and even components may appear inside it. This is not an architecture violation, but it requires a deliberate approach.

**Key question: who calls and who renders.**

If a component is rendered **by the provider itself**, it belongs to the manager:

```tsx
export function ReportMng({ children }: { children: ReactNode }) {
  const controller = useController();
  return (
    <ReportContext.Provider value={controller}>
      {children}
      {controller.isOpen && <ReportModal />}  {/* the manager owns its UI */}
    </ReportContext.Provider>
  );
}
```

This is a standard pattern for toast managers, overlays, and global modals — the UI must be above the consumer tree.

If, however, a component is used **by consumers** of the manager, this is a signal to move it to `components`.

---

**How to make the decision:**

| Situation | Solution |
|-----------|----------|
| UI is rendered by the provider, one call site | Local context or state — manager is excessive |
| UI is rendered by the provider, several call sites | Component inside the manager — the provider renders it itself |
| Component is needed by external consumers | Move it to the `components` layer |

> **Practical example:** a button in the header calls a manager method → a modal appears. If this is the only call site, local context is simpler and cleaner. If there are two or more such places, a manager with `<ReportModal />` inside the provider becomes the correct choice.



## Utilities (optional)

Context and manager patterns contain repeated boilerplate.
Deep Tree offers two utilities to eliminate it.

### `createSafeContext`

Creates a context and a safe access hook for it in one line.

```ts
// utils/createSafeContext.ts
import { createContext, useContext } from 'react';

export function createSafeContext<T>(displayName: string) {
  const Context = createContext<T | null>(null);
  Context.displayName = displayName;

  function useCtx(): T {
    const value = useContext(Context);
    if (!value) throw new Error(`${displayName}: no provider`);
    return value;
  }

  return [Context, useCtx] as const;
}
```

Without the utility:

```ts
// HomePage/context.ts
export const HomeContext = createContext<THomeContext | null>(null);

export function useHomeContext() {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error('useHomeContext: no provider');
  return ctx;
}
```

With the utility:

```ts
// HomePage/context.ts
export const [HomeContext, useHomeContext] = createSafeContext<THomeContext>('HomeContext');
```

---

### `createManager`

Creates a manager provider and an access hook for it — all manager template code disappears.

Accepts an optional `renderOwn` — for cases when the provider must render its own UI (modals, toasts, overlays).

```tsx
// utils/createManager.tsx
import { ReactNode } from 'react';
import { createSafeContext } from './createSafeContext';

export function createManager<T>(
  useController: () => T,
  renderOwn?: (value: T) => ReactNode,
  displayName?: string,
) {
  const [Context, useCtx] = createSafeContext<T>(displayName ?? 'Manager');

  function Provider({ children }: { children: ReactNode }) {
    const value = useController();
    return (
      <Context.Provider value={value}>
        {children}
        {renderOwn?.(value)}
      </Context.Provider>
    );
  }

  return [Provider, useCtx] as const;
}
```

Without the utility:

```tsx
// ReportMng/ReportMng.tsx
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

With the utility — simple manager:

```tsx
// ReportMng/ReportMng.tsx
export const [ReportMng, useReportMng] = createManager(useController, undefined, 'ReportMng');
```

With the utility — manager with its own UI:

```tsx
// ReportMng/ReportMng.tsx
export const [ReportMng, useReportMng] = createManager(
  useController,
  (ctrl) => ctrl.isOpen && <ReportModal />,
  'ReportMng'
);
```



## Data Types

Deep Tree recommends the strictest possible approach to typing.

When creating a type or interface, the `T` prefix is used — for consistency and readability.
For example: TProfile, TItem, TEntity, TTeamMember, and so on.


### Data Type Rules

- The name always starts with the `T` prefix (Type) and is written in PascalCase.
- For `interface`, the same `T` prefix is used.

### Type Name Examples

**TTeamMember**
**TProfile**
