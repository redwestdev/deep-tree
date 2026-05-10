# Deep Tree

## Framework implementations

| | |
|--|--|
| [React.js](packages/react/README.md) | React-specific rules, hooks, manager pattern, utilities |
| [Vue.js](packages/vue/README.md) | Vue-specific rules, composables, manager pattern, utilities |

---

## Introduction

Deep Tree is a modular file architecture for UI applications, focused on scalability of large frontend projects.

The architecture is based on [SOLID](https://en.wikipedia.org/wiki/SOLID) principles adapted for organizing frontend project files. It is not tied to any specific framework — applicable to any component-based UI stack.

## Goals

- Establish a unified file structure across the project
- Improve code readability and navigation
- Break large files into understandable parts
- Reduce technical debt
- Increase flexibility and code reuse
- Lower the entry barrier for new developers




## Entities

An entity is a software logical unit.

### Why entities?

An entity is the building block of the architecture. Without atomic units there is nothing to build from. Every file or folder has a clear meaning, and nothing extra is stored in a single unit.

Example entity types:
`component`, `style`, `image`, `logic`, `function`, `page`, `section`, `route`, `helper`, `config`, `type`, `api-client`, `translation`, etc.

An entity is always responsible for exactly one thing (Single Responsibility Principle from SOLID).

> Some entities are unique in a single instance. For example: `config`, `theme`.

In the Deep Tree architecture, entities are organized as a tree,
where each entity has access to its ancestors and manages its own child entities.

Any entity can be either a _single file_ or a _group of files combined in a folder_.

### Composite entity

A composite entity is a group of files combined in a shared folder. It may contain layers, file layers, and any supporting files needed for operation.

#### Why composite entities?

A composite entity and its `index` file solve the encapsulation problem. A single file can be turned into a folder with multiple files at any time — and the external import path stays the same. No one outside knows about the internal structure: this protects against accidental interference with implementation details.

#### Composite entity rules
- Folder name — PascalCase.
- A root `index` file is required; exports to the outside only through it.
- Do not nest other composite entities of the same level (only layers, file layers, and single entities).
- The internal structure is self-contained.

`index` file — re-export only, no logic:
```
HomePage/
  index.{js|ts}        # only: export { HomePage } from './HomePage'
  HomePage.{ext}       # view
```

### Single entity

A single (atomic) entity is a file that independently stores one semantic object:
code (class, function, configuration), data, image, font, video, etc.

#### Single entity rules
- Contains only one independent semantic object.




## Core Entities

Visually, any layout can be divided into three levels:
- **Pages (pages / views)**
- **Sections (sections)**
- **Components (components)**

### Pages

Pages are large composite entities — logically independent parts of the application. Each fulfills its own business role and is not repeated.

#### Why pages?

Pages divide the application into large independent chunks. Each page is a separate context with a clear business role. This prevents the application from becoming a monolith where everything is mixed together.

#### Page rules
- Always a composite entity with a PascalCase name and the `{NAME}Page` suffix (e.g., `HomePage`).
- A root `index` file is required; exports to the outside only through it.
- A view file named after the folder is required (`HomePage.{ext}`).
- Usually no input parameters (props / attrs).
- Stored only in the `pages` layer.

> **Note for file-based routing frameworks** (Next.js, Nuxt, SvelteKit, Astro):
> the `pages` layer may conflict with the framework's system folder.
> In that case, rename the layer to `views` or `screens`.

#### Exceptions
- A page may receive top-level scope data (locale, feature flags, integration keys) if it affects the entire screen.

### Sections

Sections are dependent parts of a parent component — composite entities that break its logic into understandable blocks.

#### Why sections?

Sections save components from bloat. Without them, all the logic of a page or large component piles up in one file. A section takes part of that logic into its own folder — the parent component stays readable, and each block is handled separately.

> Any component can always be split into sections. Pages, views, screens, sections, components, etc. can all have sections!

#### Section rules
- Always a composite entity with a PascalCase name and the `{NAME}Sct` suffix (e.g., `HeroSct`).
- A root `index` file is required; exports to the outside only through it.
- A view file named after the folder is required.
- No input parameters — data comes from context or local logic.
- Lives only in the `sections` layer; may contain layers except `pages`.
- Recommendation: do not create a `sections` layer for a single section.

#### Exceptions
- In rare cases a section may receive a parameter, but this signals that the reusable parts should be moved to components.

### Components

Components are reusable composite entities, applicable across different sections and pages.

#### Why components?

Components are what repeats. A button, a card, an avatar — the same thing in different places. Unlike a section, a component is not tied to a specific parent: its purpose is exactly repetition and reuse.

#### Component rules
- Always a composite entity with a PascalCase name.
- A root `index` file is required; exports to the outside only through it.
- A view file named after the folder is required.
- Stored only in the `components` layer.
- May contain layers except `pages`.

### File naming recommendation

The main file matches the entity name (`SomeComponent.{ext}`),
supporting files are placed alongside without a prefix (`types`, `styles`, `index`),
tests and stories repeat the entity name (`SomeComponent.test`, `SomeComponent.stories`).




## Project Structure Example

```
src/
  pages/                    # pages layer
    HomePage/               # page entity
      index.{js|ts}
      HomePage.{ext}
      context.{js|ts}       # single entity — accessible to children
      styles.{css|scss}     # shared styles for children
      sections/             # sections layer
        HeroSct/
          index.{js|ts}
          HeroSct.{ext}
        FeaturesSct/
          index.{js|ts}
          FeaturesSct.{ext}
          components/
            FeatureCard/
              index.{js|ts}
              FeatureCard.{ext}
      components/           # page components layer
        CallToAction/
          index.{js|ts}
          CallToAction.{ext}
  components/               # global components layer
    Button/
      index.{js|ts}
      Button.{ext}
    Avatar/
      index.{js|ts}
      Avatar.{ext}
  logic/                    # logic layer (hooks / composables / signals)
    useViewport.{js|ts}
  utils/                    # utilities layer
    formatPrice.{js|ts}
  styles/                   # styles layer
    globals.{css|scss}
```




## Layers

A layer is a folder-namespace in which entities of one type are logically grouped.
The folder name is the layer name: `components`, `logic`, `sections`, `pages`, etc.

### Why layers?

Layers create boundaries and development context. Go into `hooks` — hooks and their rules are there. Go into `managers` — managers with their own logic. A layer signals what to expect and prevents different entity types from mixing in one place.

### Layer rules
- Layer name — camelCase.
- A layer is not nested directly in another layer: a new layer appears only after an entity.
- A layer may contain groups.
- Contains only entities of its own type.
- An `index` file may be present but is not required.

### Example layer names
- `pages` / `views` / `screens`
- `sections`
- `components` / `ui`
- `logic` / `hooks` / `composables`
- `utils`
- `types`
- `api`
- `styles`
- `managers`

> Logic layer names (`hooks`, `composables`, `logic`) are chosen according to the framework's terminology.




## File Layers

A file layer is a file that temporarily acts as a layer when there is little code and no nested entities.
Over time it expands into a full folder layer.

### When it's acceptable
- All layer logic fits in a single file.
- No nested entities or groups.

### When to expand
- A second entity of the same type appears.
- The file becomes inconvenient for navigation or testing.

### Example file layer names
- `types.{js|ts}`
- `hooks.{js|ts}` / `composables.{js|ts}`
- `utils.{js|ts}`
- `constants.{js|ts}`
- `context.{js|ts}`
- `styles.{css|scss|module.scss}`

### Rules
- The file name matches the layer type; no prefixes needed.
- Do not mix different entity types in one file layer.
- When expanding, preserve the layer name.




## Groups

Groups are folders that combine entities of one type by common meaning within a layer.
The purpose of a group is to unload layers when the number of entities grows.

### Why groups?

As the project scales, layers grow and turn into a mess. Groups bring order within a layer — without changing the tree structure itself. This is protection against chaos at the layer level when there are many entities.

### Group rules
- Group name — camelCase.
- Layers inside a group are not allowed; groups may be nested within groups.
- Contains only entities of the parent layer type.
- A group does not serve as a container for a single entity.
- Group name must not match any layer name.

### Examples
```
components(layer) → buttons(group) → Button(entity)          ✓
components(layer) → buttons(group) → outlined(group) → Button ✓
components(layer) → buttons(group) → useHook(entity)          ✗
```




## Entity Sharing

A child entity may use layers, file layers, and single entities from all of its ancestors up to the `src` root.

### Why sharing?

Sharing is a constant living process in a project, not a one-time decision. It solves the problem of code weight: the higher an entity is in the tree, the more dependencies and responsibility it has; the lower — the more local it is. When a component starts repeating in different places, move it up to the nearest common ancestor. That is sharing.

### Access rule
- Imports are only allowed **up your own branch**.
- Imports from a **sibling branch** are not allowed.
- **View files** of an ancestor are not an import source for children.

To pass something down the tree — extract it into a separate single entity or file layer next to the view:

| What to share | How to organize |
|---------------|-----------------|
| Context / state | `context.{js|ts}` — single entity |
| Shared styles | `styles.{css|scss}` — file layer |

### When to move an entity up
If an entity is needed in two or more branches — move it to the nearest common ancestor layer.




## Nesting Depth

Nesting depth is not limited if it is local, large-scale functionality.

### Why nesting depth?

Depth solves the focus problem. The deeper you work — the less surrounding code you affect, the more precise and local the change. Go down to the right place, fix only what needs fixing, and move on. Move entities up only when they are genuinely needed in multiple places, not "just in case".
Guideline: go as deep as needed for readability within the context.
Moving entities up only makes sense when there is real sharing outside the current branch.




## Manager

A manager is an independent composite entity: an extracted state and logic provider, focused on one specific task.

Implemented via the framework's context / provide-inject mechanism.

### Manager rules
- Always a composite entity with a PascalCase name and the `{NAME}Mng` suffix (e.g., `ReportMng`).
- A root `index` file is required; exports to the outside only through it.
- A logic file is required — stores business logic and state (name depends on the framework: `useController`, `controller`, `store`, etc.).
- A provider file named after the folder is required.
- Lives only in the `managers` layer.
- Usually accepts no parameters other than child elements (`children` / `slots`).

### File structure
```
managers/
  ReportMng/
    index.{js|ts}         # re-export
    ReportMng.{ext}       # provider — wraps the tree, passes logic into context
    useController.{js|ts} # logic and state (adapt the name to the framework)
```

### When to use a manager

| Situation | Solution |
|-----------|----------|
| State needed in only one component | Local state |
| Need to pass data without drilling, simple logic | `context.{js|ts}` + accessor at parent |
| Business logic, multiple call sites | Manager |
| Need UI above the tree (toasts, modals, overlays) | Manager with own render |
| Need time-travel, advanced devtools | Global state manager |

> One form of manager — always a composite entity.
> If too simple for a composite — it's local state or `context.{js|ts}`, not a manager.

### Components inside a manager

If a component is rendered **by the provider itself** — it belongs to the manager.
If a component is used **by external consumers** — move it to `components`.

| Situation | Solution |
|-----------|----------|
| UI rendered by provider, one call site | Local context — manager is overkill |
| UI rendered by provider, multiple call sites | Component inside the manager |
| Component needed by external consumers | Move to `components` layer |




## Data Types

Deep Tree recommends a strict approach to typing where the framework/language supports it.

When creating a type or interface, use the `T` prefix — for consistency and readability.
Examples: `TProfile`, `TItem`, `TFeature`, `TTeamMember`.

### Rules
- Name starts with the `T` prefix and is written in PascalCase.
- The rule applies to both `type` and `interface`.
