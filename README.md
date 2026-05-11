# Deep Tree Core

## Introduction

Deep Tree is a file-based modular architecture for UI applications, focused on the scalability of large frontend projects.

The architecture is based on [SOLID](https://en.wikipedia.org/wiki/SOLID) principles adapted for organizing frontend project files. It is not tied to a specific framework — it is applicable to any component-based UI stack.

> Reference implementation: [README.md](react.md) (React.js)

## Goals

- Establish a unified file structure in the project
- Improve code readability and navigation
- Split large files into understandable parts
- Reduce the project's technical debt
- Increase flexibility and code reuse
- Lower the entry threshold for new developers




## Entities

An entity is a logical software unit.

### Why Are Entities Needed?

An entity is a brick of the architecture. Without atomic units, there is nothing to build from. Every file or folder has a clear meaning, and nothing extra is stored in one unit.

Examples of entity types:
`component`, `style`, `image`, `logic`, `function`, `page`, `section`, `route`, `helper`, `config`, `type`, `api-client`, `translation`, and so on.

An entity is always responsible for one thing. (the SOLID single responsibility principle).

> Some entities are unique in a single instance. For example: `config`, `theme`.

In the deep tree architecture, entities are ordered as a tree,
where each entity has access to its parents and manages its child entities.

Any entity can be either a _single file_ or a _group of files united by a folder_.

### Composite Entity

A composite entity is a group of files united by a common folder. Inside it there may be layers, file layers, and any auxiliary files required for operation.

#### Why Is a Composite Entity Needed?

A composite entity and its `index` file solve the problem of encapsulation. A single file can be turned into a folder with several files at any moment — and the external import path will not change. From the outside, nobody knows about the internal structure: this is protection from accidental interference with implementation details.

#### Composite Entity Rules
- The folder name is PascalCase.
- A root `index` file is required; export outward only through it.
- Do not nest other composite entities of the same level (only layers, file layers, and single entities).
- The structure inside the folder is self-contained.

The `index` file is only a re-export, no logic:
```
HomePage/
  index.{js|ts}        # only: export { HomePage } from './HomePage'
  HomePage.{ext}       # view
```

### Single Entity

A single (atomic) entity is a file that self-sufficiently stores one semantic object:
code (class, function, configuration), data, image, font, video, and so on.

#### Single Entity Rules
- Inside there is only one independent semantic object.




## Base Entities

Visually, any layout is divided into three levels:
- **Pages (pages / views)**
- **Sections (sections)**
- **Components (components)**

### Pages

Pages are large composite entities, logically independent parts of an application. Each performs its own business role and is not repeated.

#### Why Are Pages Needed?

Pages divide an application into large independent pieces. Each page is a separate context with a clear business role. This prevents the application from turning into a monolith where everything is mixed together.

#### Page Rules
- Always a composite entity with a PascalCase name and the `{NAME}Page` suffix (example: `HomePage`).
- A root `index` file is required; export outward only through it.
- A view file named after the folder is required (`HomePage.{ext}`).
- Usually without input parameters (props / attrs).
- Stored only in the `pages` layer.

> **Nuance for frameworks with file-based routing** (Next.js, Nuxt, SvelteKit, Astro):
> the `pages` layer may conflict with the framework's system folder.
> In that case, rename the layer to `views` or `screens`.

#### Exceptions
- A top-level data scope may come into a page (locale, feature flags, integration keys), if it concerns the entire screen.

### Sections

Sections are dependent parts of a parent component, composite entities; they split its logic into understandable blocks.

#### Why Are Sections Needed?

Sections save you from bloated components. Without them, all the logic of a page or large component settles in one file. A section takes part of this logic into its own folder — the parent component remains readable, and each block is handled separately.

> Any other component can always be divided into sections. Page, view, screens, section, component, and so on may have sections!

#### Section Rules
- Always a composite entity with a PascalCase name and the `{NAME}Sct` suffix (example: `HeroSct`).
- A root `index` file is required; export outward only through it.
- A view file named after the folder is required.
- Input parameters are not passed — data is taken from context or local logic.
- Lives only in the `sections` layer; may contain layers except `pages`.
- Recommendation: do not create a `sections` layer for one section.

#### Exceptions
- In rare cases, a parameter may get into a section, but this is a signal to move repeated parts into components.

### Components

Components are reusable composite entities, applicable in different sections and pages.

#### Why Are Components Needed?

Components are what repeats. A button, card, avatar — the same thing in different places. Unlike a section, a component is not tied to a specific parent: its task is precisely repetition and reuse.

#### Component Rules
- Always a composite entity with a PascalCase name.
- A root `index` file is required; export outward only through it.
- A view file named after the folder is required.
- Stored only in the `components` layer.
- May contain layers except `pages`.

### File Naming Recommendation

The main file matches the entity name (`SomeComponent.{ext}`),
auxiliary files are placed next to it without a prefix (`types`, `styles`, `index`),
tests and stories repeat the entity name (`SomeComponent.test`, `SomeComponent.stories`).




## Project Structure Example

```
src/
  pages/                    # pages layer
    HomePage/               # page entity
      index.{js|ts}
      HomePage.{ext}
      styles.{css|scss}     # common styles for children
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
  logic/                    # logic layer
    viewport.{js|ts}
  utils/                    # utilities layer
    formatPrice.{js|ts}
  styles/                   # styles layer
    globals.{css|scss}
```




## Layers

A layer is a folder namespace in which entities of one type are logically grouped.
The folder name is the layer name: `components`, `logic`, `sections`, `pages`, and so on.

### Why Are Layers Needed?

Layers create boundaries and development context. You enter `hooks` — there are hooks and rules for working with them. You enter `managers` — there are managers with their own logic. A layer signals what can be expected here and prevents different entity types from mixing in one place.

### Layer Rules
- The layer name is camelCase.
- A layer is not nested directly inside a layer: a new layer appears only after an entity.
- A layer may contain groups.
- Inside there are only entities of its own type.
- An `index` file may be present, but is not required.

### Layer Name Examples
- `pages` / `views` / `screens`
- `sections`
- `components` / `ui`
- `logic`
- `utils`
- `types`
- `api`
- `styles`




## File Layers

A file layer is a file that temporarily performs the role of a layer when there is little code and no nested entities.
Over time, it expands into a full folder layer.

### When It Is Allowed
- All layer logic fits in one file.
- There are no nested entities or groups.

### When to Expand
- A second entity of the same type appears.
- The file becomes inconvenient for navigation or testing.

### File Layer Name Examples
- `types.{js|ts}`
- `logic.{js|ts}`
- `utils.{js|ts}`
- `constants.{js|ts}`
- `styles.{css|scss|module.scss}`

### Rules
- The file name matches the layer type; prefixes are not needed.
- Do not mix different entity types in one file layer.
- When expanding, keep the layer name.




## Groups

Groups are folders that unite entities of one type by common meaning inside a layer.
The task of a group is to unload layers when there are many entities.

### Why Are Groups Needed?

As a project scales, layers grow and turn into a dump. Groups bring order inside a layer — without changing the structure of the tree itself. This is protection from chaos at the level of one layer when there is a large number of entities.

### Group Rules
- The group name is camelCase.
- Layers inside a group are not allowed; groups may be nested in groups.
- Inside there are only entities of the parent layer type.
- A group does not serve as a container for one single entity.
- The group name does not match layer names.

### Examples
```
components(layer) → buttons(group) → Button(entity)          ✓
components(layer) → buttons(group) → outlined(group) → Button ✓
components(layer) → buttons(group) → useHook(entity)          ✗
```




## Entity Sharing (sharing)

A child entity may use layers, file layers, and single entities of all its ancestors up to the `src` root.

### Why Is Sharing Needed?

Sharing is a constant living process in a project, not a one-time decision. It solves the problem of code weight: the higher an entity is in the tree, the more dependencies and responsibility it has; the lower it is, the more local it is. A task appeared, you saw that a component started repeating in different places — you moved it higher to the nearest common ancestor. This is sharing.

### Access Rule
- You may import only **up along your own branch**.
- Importing from a **neighboring branch** is not allowed.
- Ancestor **view** files are not an import source for children.

If you need to pass something down the tree, move it into a separate single entity or file layer next to the view:

| What we share | How to define it |
|---------------|------------------|
| Shared state / logic | single entity file next to the view |
| Common styles | `styles.{css|scss}` — file layer |

### When to Move an Entity Higher
If an entity is needed in two or more branches, move it to the nearest common ancestor layer.




## Nesting Depth

Nesting depth is not limited if it is local, large functionality.

### Why Is Nesting Depth Needed?

Depth solves the problem of focus. The deeper you work, the less surrounding code you touch, and the more precise and local the change is. You went down to the right place, fixed only what needed to be fixed, and moved on. Move entities higher only when they are really needed in several places, not "just in case".
Guideline: go as deep as needed for readability inside the context.
Moving entities higher makes sense only when there is real sharing outside the current branch.





## Data Types

Deep Tree recommends a strict approach to typing where the framework/language supports it.

When creating a type or interface, the `T` prefix is used — for consistency and readability.
For example: `TProfile`, `TItem`, `TFeature`, `TTeamMember`.

### Rules
- The name starts with the `T` prefix and is written in PascalCase.
- The rule applies both to `type` and to `interface`.
