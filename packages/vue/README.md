# Deep Tree — Vue.js

## Introduction

Deep Tree is a modular file architecture for Vue.js applications, focused on scalability of large frontend projects.

> Abstract specification: [Deep Tree Core](../core/README.md)

This document describes Vue-specific rules and examples on top of the core.
All base concepts (entities, layers, groups, sharing) are described in core.




## Vue-specific Entity Details

### Composite entity — index.ts

```ts
// HomePage/index.ts
export { default as HomePage } from './HomePage.vue';
```

### View file — `.vue`

```
HomePage/
  index.ts
  HomePage.vue        ← view
```




## Core Entities

### Pages

```
src/
  pages/
    HomePage/
      index.ts
      HomePage.vue
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

> **Note for Nuxt.js**: the `pages/` directory is reserved for file-based routing.
> Rename the layer to `views` or `screens`.

### Sections

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

```
src/
  components/
    Avatar/
      index.ts
      Avatar.vue
      types.ts
      styles.module.scss
```




## Project Structure Example

```
src/
  pages/
    HomePage/
      index.ts
      HomePage.vue
      context.ts
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
  components/
    Button/
      index.ts
      Button.vue
      styles.module.scss
    Avatar/
      index.ts
      Avatar.vue
      types.ts
  composables/          ← composables layer (equivalent of hooks in React)
    useViewport.ts
  utils/
    formatPrice.ts
  styles/
    globals.scss
```

> In Vue the logic layer is named `composables` (vs `hooks` in React).




## Layers — Vue-specific

### `composables` layer

```
composables/
  useViewport.ts
  useDebounce.ts
```

### File layers

```
composables.ts    ← temporary composables layer (instead of a folder)
types.ts
utils.ts
constants.ts
context.ts
styles.module.scss
```

### Example layer names
- `pages` / `views`
- `sections`
- `components` / `ui`
- `composables`
- `utils`
- `types`
- `api`
- `styles`
- `managers`




## Sharing — Context in Vue

To pass state down the tree use `context.ts` via `provide/inject`:

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




## Manager

A manager is implemented via `provide/inject`.

### Structure

```
src/
  managers/
    ReportMng/
      index.ts
      ReportMng.vue       ← provider component
      useController.ts    ← composable with business logic and state
```

`useController.ts`:

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

`ReportMng.vue`:

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

### Recommended stack
- **@tanstack/vue-query** — server state: fetching, caching, synchronization.
- **Manager** — local UI state: theme, player, modals, cart.
- **Pinia** — when devtools and time-travel are needed (rare scenario).




## Utilities (optional)

### `createSafeContext`

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

Usage:

```ts
// HomePage/context.ts
export const [provideHomeContext, useHomeContext] = createSafeContext<THomeContext>('HomeContext');
```

### `createManager`

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

Usage:

```ts
// ReportMng/ReportMng.ts
export const [ReportMng, useReportMng] = createManager(useController, 'ReportMng');
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
