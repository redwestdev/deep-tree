# Deep Tree — Vue.js

## Introduction
Deep Tree is a file-based modular architecture for Vue.js applications, focused on the scalability of large frontend projects.

The architecture is based on [SOLID](https://en.wikipedia.org/wiki/SOLID) principles adapted for organizing frontend project files.

> Abstract specification: [core.md](README.md)

## Goals
- Establish a unified file structure in the project
- Improve code readability and navigation
- Split large files into understandable parts
- Reduce the project's technical debt
- Increase flexibility and code reuse
- Lower the entry threshold for new developers




## Introduction to Entities
An entity is a logical software unit.

### Why Are Entities Needed?

An entity is a brick of the architecture. Without atomic units, there is nothing to build from. Every file or folder has a clear meaning, and nothing extra is stored in one unit.

Examples of entity types:
`component`, `style`, `image`, `composable`, `function`, `page`, `section`, `route`,
`helper`, `config`, `type`, `api-client`, `translation`, and so on.

An entity is always responsible for one thing. (the SOLID single responsibility principle).

> Some entities are unique in a single instance. For example: `config` or `theme`.

In the deep tree architecture, entities are ordered as a tree,
where each entity has access to its parents and manages its child entities.

Any entity can be either a _single file_ or a _group of files united by a folder_.

### Composite Entity
A composite entity is a group of files united by a common folder. Inside it there may be layers, file layers, and auxiliary files.

#### Why Is a Composite Entity Needed?

A composite entity and its `index.ts` solve the problem of encapsulation. A single file can be turned into a folder with several files at any moment — and the external import path will not change. From the outside, nobody knows about the internal structure: this is protection from accidental interference with implementation details.

#### Composite Entity Rules
- The folder name is PascalCase.
- A root `index.ts` is required; export outward only through it.
- Do not nest other composite entities of the same level (only layers, file layers, and single entities).
- The structure inside the folder is self-contained.

`index.ts` is only a re-export, no logic:
```ts
// HomePage/index.ts
export { default as HomePage } from './HomePage.vue';
```

### Single Entity
A single (atomic) entity is a file that self-sufficiently stores one semantic object:
code (class, function/composable, configuration), data, image, font, video, and so on.

#### Single Entity Rules
- Inside there is only one independent semantic object.




## Base Entities
Visually, any layout is divided into three levels:
- **Pages (pages / views)**
- **Sections (sections)**
- **Components (components)**

### Pages
Pages are large Vue components, composite entities. Logically independent parts of an application; each performs its own business role and is not repeated.

#### Why Are Pages Needed?

Pages divide an application into large independent pieces. Each page is a separate context with a clear business role. This prevents the application from turning into a monolith where everything is mixed together.

#### Page Rules
- Always a composite entity with a PascalCase name and the `{NAME}Page` suffix (example: `HomePage`).
- A root `index.ts` is required; export outward only through it.
- A view file `${DIR_NAME}.vue` is required.
- Usually without props.
- Stored only in the `pages` layer.

> **Nuance for Nuxt.js**: the `pages/` directory is reserved for file-based routing.
> Rename the layer to `views` or `screens`.

#### Page Examples
- `HomePage` — initial page, root page
- `AboutPage` — tells about a company or product
- `CatalogPage` — product catalog, filtering, search
- `ContactUsPage` — contact methods

Minimal page structure:
```
src/
  pages/
    HomePage/
      index.ts            # single export point
      HomePage.vue        # page view
      sections/
        HeroSct/
          index.ts
          HeroSct.vue
        BenefitsSct/
          index.ts
          BenefitsSct.vue
      components/
        CallToAction/
          index.ts
          CallToAction.vue
```

### Sections
Sections are dependent parts of a parent Vue component, composite entities; they split its logic into understandable blocks.

#### Why Are Sections Needed?

Sections save you from bloated components. Without them, all the logic of a page or large component settles in one file. A section takes part of this logic into its own folder — the parent component remains readable, and each block is handled separately.

> Any other component can always be divided into sections. Page, section, component, and so on may have sections!

#### Section Rules
- Always a composite entity with a PascalCase name and the `{NAME}Sct` suffix (example: `HeroSct`).
- A root `index.ts` is required; export outward only through it.
- A view file `${DIR_NAME}.vue` is required.
- Props are not passed.
- Lives only in the `sections` layer; may contain layers except `pages`.
- Recommendation: do not create a `sections` layer for one section.

A section does not accept props — it gets data from `inject` or a local composable:
```vue
<!-- FeaturesSct/FeaturesSct.vue -->
<script setup lang="ts">
import { useHomeContext } from '../../context';
import FeatureCard from './components/FeatureCard/FeatureCard.vue';

const { features } = useHomeContext();
</script>

<template>
  <section>
    <FeatureCard v-for="f in features" :key="f.id" v-bind="f" />
  </section>
</template>
```

### Components
Components are reusable Vue components (composite entities), applicable in different sections and pages.

#### Why Are Components Needed?

Components are what repeats. A button, card, avatar — the same thing in different places. Unlike a section, a component is not tied to a specific parent: its task is precisely repetition and reuse.

#### Component Rules
- Always a composite entity with a PascalCase name.
- A root `index.ts` is required; export outward only through it.
- A view file `${DIR_NAME}.vue` is required.
- Stored only in the `components` layer.
- May contain layers except `pages`.

Minimal component structure:
```
src/
  components/
    Avatar/
      index.ts
      Avatar.vue
      types.ts
      styles.module.scss
```




## Expanded Project Structure Example

```
src/
  pages/                    # pages layer
    HomePage/               # page entity
      index.ts
      HomePage.vue
      sections/
        HeroSct/
          index.ts
          HeroSct.vue
          components/
            Highlight/
              index.ts
              Highlight.vue
        FeaturesSct/
          index.ts
          FeaturesSct.vue
          components/
            FeatureCard/
              index.ts
              FeatureCard.vue
      components/
        CallToAction/
          index.ts
          CallToAction.vue
  components/               # global components layer
    Button/
      index.ts
      Button.vue
      styles.module.scss
    Avatar/
      index.ts
      Avatar.vue
      types.ts
  composables/              # composables layer (analog of hooks in React)
    useViewport.ts
  utils/
    formatPrice.ts
  styles/
    globals.scss
```




## Layers

A layer is a folder namespace in which entities of one type are logically grouped.

### Why Are Layers Needed?

Layers create boundaries and development context. You enter `composables` — there are composables and rules for working with them. You enter `managers` — there are managers with their own logic. A layer signals what can be expected here and prevents different entity types from mixing in one place.

### Layer Rules
- The layer name is camelCase.
- A layer is not nested directly inside a layer: a new layer appears only after an entity.
- A layer may contain groups.
- Inside there are only entities of its own type.

### Layer Name Examples
- `pages` / `views`
- `sections`
- `components` / `ui`
- `composables`
- `utils`
- `types`
- `api`
- `styles`
- `managers`

> In Vue, `composables` is used instead of `hooks` — this matches the official Vue 3 terminology.




## File Layers

A file layer is a file that temporarily performs the role of a layer.

### File Layer Name Examples
- `types.ts`
- `composables.ts`
- `utils.ts`
- `constants.ts`
- `context.ts`
- `styles.module.scss`

### Rules
- The file name matches the layer type; prefixes are not needed.
- Do not mix different entity types in one file layer.




## Groups

Groups are folders that unite entities of one type by common meaning inside a layer.

### Why Are Groups Needed?

As a project scales, layers grow and turn into a dump. Groups bring order inside a layer — without changing the structure of the tree itself. This is protection from chaos at the level of one layer when there is a large number of entities.

### Group Rules
- The group name is camelCase.
- Layers inside a group are not allowed; groups may be nested in groups.
- Inside there are only entities of the parent layer type.
- A group does not serve as a container for one single entity.




## Entity Sharing (sharing)

A child entity may use layers, file layers, and single entities of all its ancestors up to the `src` root.

### Why Is Sharing Needed?

Sharing is a constant living process in a project, not a one-time decision. It solves the problem of code weight: the higher an entity is in the tree, the more dependencies and responsibility it has; the lower it is, the more local it is. A task appeared, you saw that a component started repeating in different places — you moved it higher to the nearest common ancestor. This is sharing.

### Access Rule
- You may import only **up along your own branch**.
- Importing from a **neighboring branch** is not allowed.
- Ancestor `.vue` view files are not an import source for children.

Use `context.ts` to pass state down the tree:
```ts
// HomePage/context.ts
import { inject, provide } from 'vue';

export interface THomeContext {
  title: string;
  features: TFeature[];
}

const HomeKey = Symbol('HomeContext');

export function provideHomeContext(value: THomeContext) {
  provide(HomeKey, value);
}

export function useHomeContext(): THomeContext {
  const ctx = inject<THomeContext>(HomeKey);
  if (!ctx) throw new Error('useHomeContext: no provider');
  return ctx;
}
```

| What we share | How to define it |
|---------------|------------------|
| Context | `context.ts` — single entity |
| Common styles | `styles.module.scss` — file layer |

### When to Move an Entity Higher
If an entity is needed in two or more branches, move it to the nearest common ancestor layer.




## Nesting Depth

Nesting depth is not limited if it is local, large functionality.
Moving entities higher makes sense only when there is real sharing outside the current branch.

### Why Is Nesting Depth Needed?

Depth solves the problem of focus. The deeper you work, the less surrounding code you touch, and the more precise and local the change is. You went down to the right place, fixed only what needed to be fixed, and moved on. Move entities higher only when they are really needed in several places, not "just in case".




## Manager

A manager is a composite independent entity: an extracted provider with `provide/inject` and logic, focused on one specific task.

### Manager Rules
- Always a composite entity with a PascalCase name and the `{NAME}Mng` suffix (example: `ReportMng`).
- A root `index.ts` is required; export outward only through it.
- A `useController.ts` file is required — a composable with business logic and state.
- A view file `${DIR_NAME}.vue` is required — provider component.
- Lives only in the `managers` layer.
- Often accepts no props except `slot`.

### Manager File Structure
```
src/
  managers/
    ReportMng/
      index.ts
      ReportMng.vue       # provider component
      useController.ts    # composable with logic and state
```

`useController.ts` — all business logic and state:
```ts
// ReportMng/useController.ts
import { ref } from 'vue';

export function useController() {
  const items = ref<TReportItem[]>([]);

  function addItem(item: TReportItem) {
    items.value.push(item);
  }

  return { items, addItem };
}
```

`ReportMng.vue` — provider component:
```vue
<!-- ReportMng/ReportMng.vue -->
<script setup lang="ts">
import { provide } from 'vue';
import { useController } from './useController';

const ReportKey = Symbol('ReportMng');
const controller = useController();
provide(ReportKey, controller);
</script>

<template>
  <slot />
</template>
```

`index.ts` — exports the provider and access hook:
```ts
// ReportMng/index.ts
export { default as ReportMng } from './ReportMng.vue';
export { useReportMng } from './ReportMng.vue';
```

### When to Use a Manager

| Situation | Solution |
|-----------|----------|
| State is needed only in one component | Local `ref` / `reactive` |
| Need to pass data without props drilling, logic is simple | `context.ts` + `inject` at the parent |
| There is business logic, several call sources | Manager |
| UI is needed above the tree (toasts, modals, overlays) | Manager with its own render in `<template>` |
| Need time-travel, advanced devtools | Pinia |

### Recommended Stack
- **@tanstack/vue-query** — server state: loading, cache, synchronization.
- **Manager** — local UI state: theme, player, modals, cart.
- **Pinia** — if devtools and time-travel are needed (a rare scenario, not the default one).




## Utilities (optional)

### `createSafeContext`

Creates an `inject` hook with a safe provider check.

```ts
// utils/createSafeContext.ts
import { inject, provide } from 'vue';

export function createSafeContext<T>(displayName: string) {
  const key = Symbol(displayName);

  function provideCtx(value: T) {
    provide(key, value);
  }

  function useCtx(): T {
    const value = inject<T>(key);
    if (!value) throw new Error(`${displayName}: no provider`);
    return value;
  }

  return [provideCtx, useCtx] as const;
}
```

Without the utility:
```ts
// HomePage/context.ts
const HomeKey = Symbol('HomeContext');
export function provideHomeContext(v: THomeContext) { provide(HomeKey, v); }
export function useHomeContext() {
  const ctx = inject<THomeContext>(HomeKey);
  if (!ctx) throw new Error('useHomeContext: no provider');
  return ctx;
}
```

With the utility:
```ts
// HomePage/context.ts
export const [provideHomeContext, useHomeContext] = createSafeContext<THomeContext>('HomeContext');
```

---

### `createManager`

Creates a provider component and an access hook for it.

```ts
// utils/createManager.ts
import { defineComponent, h } from 'vue';
import { createSafeContext } from './createSafeContext';

export function createManager<T>(
  useController: () => T,
  displayName?: string,
) {
  const [provideCtx, useCtx] = createSafeContext<T>(displayName ?? 'Manager');

  const Provider = defineComponent({
    name: displayName,
    setup(_, { slots }) {
      const value = useController();
      provideCtx(value);
      return () => slots.default?.();
    },
  });

  return [Provider, useCtx] as const;
}
```

With the utility:
```ts
// ReportMng/ReportMng.ts
export const [ReportMng, useReportMng] = createManager(useController, 'ReportMng');
```




## Data Types

Deep Tree recommends strict typing through TypeScript.

When creating a type or interface, the `T` prefix is used — for consistency and readability.
For example: `TProfile`, `TItem`, `TFeature`, `TTeamMember`.

### Rules
- The name starts with the `T` prefix and is written in PascalCase.
- The rule applies both to `type` and to `interface`.

### Examples
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
