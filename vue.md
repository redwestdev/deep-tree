# Deep Tree — Vue.js

## Введение
Deep Tree — файловая модульная архитектура Vue.js приложений, ориентированная на масштабируемость больших фронтенд-проектов.

Архитектура основана на принципах [SOLID](https://en.wikipedia.org/wiki/SOLID), адаптированных для организации файлов фронтенд-проектов.

> Абстрактная спецификация: [core.md](README.md)

## Цели
- Установить единую структуру файлов в проекте
- Улучшить читаемость и навигацию по коду
- Разбивать большие файлы на понятные части
- Снизить технический долг проекта
- Повысить гибкость и переиспользование кода
- Снизить порог входа для новых разработчиков




## Введение в сущности
Сущность — это программная логическая единица.

Примеры видов сущностей:
`component`, `style`, `image`, `composable`, `function`, `page`, `section`, `route`,
`helper`, `config`, `type`, `api-client`, `translation` и тд.

Сущность всегда отвечает за что-то одно. (принцип единой ответственности SOLID).

> Некоторые сущности уникальны в одном экземпляре. Например: `config` или `theme`.

В архитектуре глубокого дерева сущности упорядочиваются в виде дерева,
где каждая сущность имеет доступ к родительским и управляет своими дочерними сущностями.

Любая сущность может быть как _отдельным файлом_, так и _группой файлов, объединённых папкой_.

### Составная сущность
Составная сущность — группа файлов, объединённых общей папкой. Внутри могут быть слои, файловые слои и вспомогательные файлы.

#### Правила составной сущности
- Имя папки — PascalCase.
- Обязателен корневой `index.ts`; экспорт наружу — только через него.
- Не вкладывать другие составные сущности того же уровня (только слои, файловые слои и одиночные сущности).
- Структура внутри папки самодостаточна.

`index.ts` — только реэкспорт, никакой логики:
```ts
// HomePage/index.ts
export { default as HomePage } from './HomePage.vue';
```

### Одиночная сущность
Одиночной (атомарной) сущностью считается файл, который самодостаточно хранит один смысловой объект:
код (класс, функцию/composable, конфигурацию), данные, изображение, шрифт, видео и т.п.

#### Правила одиночной сущности
- Внутри только один самостоятельный смысловой объект.




## Базовые сущности
Визуально любой макет делится на три уровня:
- **Страницы (pages / views)**
- **Секции (sections)**
- **Компоненты (components)**

### Страницы
Страницы — крупные Vue-компоненты, составные сущности. Логически независимые части приложения; каждая выполняет свою бизнес-роль и не повторяется.

#### Правила страниц
- Всегда составная сущность с именем в PascalCase и суффиксом `{NAME}Page` (пример: `HomePage`).
- Обязателен корневой `index.ts`; экспорт наружу — только через него.
- Обязателен файл представления `${DIR_NAME}.vue`.
- Обычно без props.
- Хранятся только в слое `pages`.

> **Нюанс для Nuxt.js**: директория `pages/` зарезервирована для файлового роутинга.
> Переименуйте слой в `views` или `screens`.

#### Примеры страниц
- `HomePage` — начальная страница, корневая
- `AboutPage` — рассказывает о компании или продукте
- `CatalogPage` — каталог продуктов, фильтрация, поиск
- `ContactUsPage` — способы связи

Минимальная структура страницы:
```
src/
  pages/
    HomePage/
      index.ts            # единая точка экспорта
      HomePage.vue        # представление страницы
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

### Секции
Секции — зависимые части родительского Vue-компонента, составные сущности; дробят его логику на понятные блоки.

#### Правила секции
- Всегда составная сущность с именем в PascalCase и суффиксом `{NAME}Sct` (пример: `HeroSct`).
- Обязателен корневой `index.ts`; экспорт наружу — только через него.
- Обязателен файл представления `${DIR_NAME}.vue`.
- Props не передаём.
- Живёт только в слое `sections`; может содержать слои, кроме `pages`.
- Рекомендация: не создавайте слой `sections` ради одной секции.

Секция не принимает props — данные берёт из `inject` или локального composable:
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

### Компоненты
Компоненты — переиспользуемые Vue-компоненты (составные сущности), применимые в разных секциях и страницах.

#### Правила компонентов
- Всегда составная сущность с именем в PascalCase.
- Обязателен корневой `index.ts`; экспорт наружу — только через него.
- Обязателен файл представления `${DIR_NAME}.vue`.
- Хранятся только в слое `components`.
- Могут содержать слои, кроме `pages`.

Минимальная структура компонента:
```
src/
  components/
    Avatar/
      index.ts
      Avatar.vue
      types.ts
      styles.module.scss
```




## Пример развёрнутой структуры проекта

```
src/
  pages/                    # слой страниц
    HomePage/               # сущность-страница
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
  components/               # глобальный слой компонентов
    Button/
      index.ts
      Button.vue
      styles.module.scss
    Avatar/
      index.ts
      Avatar.vue
      types.ts
  composables/              # слой composables (аналог hooks в React)
    useViewport.ts
  utils/
    formatPrice.ts
  styles/
    globals.scss
```




## Слои

Слой — это папка-пространство имён, в которой логически группируются сущности одного типа.

### Правила слоёв
- Имя слоя — camelCase.
- Слой не вкладывается напрямую в слой: новый слой появляется только после сущности.
- Слой может содержать группы.
- Внутри только сущности своего типа.

### Примеры имён слоёв
- `pages` / `views`
- `sections`
- `components` / `ui`
- `composables`
- `utils`
- `types`
- `api`
- `styles`
- `managers`

> В Vue используется `composables` вместо `hooks` — соответствует официальной терминологии Vue 3.




## Файловые слои

Файловый слой — файл, временно выполняющий роль слоя.

### Примеры имён файловых слоёв
- `types.ts`
- `composables.ts`
- `utils.ts`
- `constants.ts`
- `context.ts`
- `styles.module.scss`

### Правила
- Имя файла совпадает с типом слоя; префиксы не нужны.
- Не смешивать разные типы сущностей в одном файловом слое.




## Группы

Группы — папки, объединяющие сущности одного типа по общему смыслу внутри слоя.

### Правила групп
- Имя группы — camelCase.
- Слои внутри группы не допускаются; группы могут вкладываться в группы.
- Внутри только сущности типа слоя-родителя.
- Группа не служит контейнером для одной-единственной сущности.




## Шеринг сущностей (sharing)

Дочерняя сущность может использовать слои, файловые слои и одиночные сущности всех своих предков вплоть до корня `src`.

### Правило доступа
- Импортировать можно только **вверх по своей ветке**.
- Импорт из **соседней ветки** не допускается.
- Файлы представления `.vue` предка — не источник импорта для детей.

Для проброса состояния вниз по дереву используйте `context.ts`:
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
  if (!ctx) throw new Error('useHomeContext: нет провайдера');
  return ctx;
}
```

| Что шарим | Как оформить |
|-----------|--------------|
| Контекст | `context.ts` — одиночная сущность |
| Общие стили | `styles.module.scss` — файловый слой |

### Когда поднимать сущность выше
Если сущность нужна в двух и более ветках — переносите её в ближайший общий слой-предок.




## Глубина вложенности

Глубина вложений не ограничивается, если это локальный крупный функционал.
Поднимать сущности выше имеет смысл только при реальном шаринге за пределами текущей ветки.




## Менеджер

Менеджер — составная независимая сущность: вынесенный провайдер с `provide/inject` и логикой, сфокусированный на одной конкретной задаче.

### Правила менеджера
- Всегда составная сущность с именем в PascalCase и суффиксом `{NAME}Mng` (пример: `ReportMng`).
- Обязателен корневой `index.ts`; экспорт наружу — только через него.
- Обязателен файл `useController.ts` — composable с бизнес-логикой и стейтом.
- Обязателен файл представления `${DIR_NAME}.vue` — компонент-провайдер.
- Живёт только в слое `managers`.
- Зачастую не принимает никаких props кроме `slot`.

### Файловая структура менеджера
```
src/
  managers/
    ReportMng/
      index.ts
      ReportMng.vue       # компонент-провайдер
      useController.ts    # composable с логикой и стейтом
```

`useController.ts` — вся бизнес-логика и стейт:
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

`ReportMng.vue` — компонент-провайдер:
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

`index.ts` — экспортирует провайдер и хук доступа:
```ts
// ReportMng/index.ts
export { default as ReportMng } from './ReportMng.vue';
export { useReportMng } from './ReportMng.vue';
```

### Когда использовать менеджер

| Ситуация | Решение |
|----------|---------|
| Стейт нужен только в одном компоненте | Локальный `ref` / `reactive` |
| Нужно пробросить данные без props drilling, логика простая | `context.ts` + `inject` у родителя |
| Есть бизнес-логика, несколько источников вызова | Менеджер |
| Нужен UI над деревом (тосты, модалки, оверлеи) | Менеджер с собственным рендером в `<template>` |
| Нужен time-travel, продвинутые devtools | Pinia |

### Рекомендуемый стек
- **@tanstack/vue-query** — серверный стейт: загрузка, кэш, синхронизация.
- **Менеджер** — локальный UI-стейт: тема, плеер, модалки, корзина.
- **Pinia** — если нужны devtools и time-travel (редкий, а не дефолтный сценарий).




## Утилиты (опционально)

### `createSafeContext`

Создаёт `inject`-хук с безопасной проверкой провайдера.

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
    if (!value) throw new Error(`${displayName}: нет провайдера`);
    return value;
  }

  return [provideCtx, useCtx] as const;
}
```

Без утилиты:
```ts
// HomePage/context.ts
const HomeKey = Symbol('HomeContext');
export function provideHomeContext(v: THomeContext) { provide(HomeKey, v); }
export function useHomeContext() {
  const ctx = inject<THomeContext>(HomeKey);
  if (!ctx) throw new Error('useHomeContext: нет провайдера');
  return ctx;
}
```

С утилитой:
```ts
// HomePage/context.ts
export const [provideHomeContext, useHomeContext] = createSafeContext<THomeContext>('HomeContext');
```

---

### `createManager`

Создаёт компонент-провайдер и хук доступа к нему.

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

С утилитой:
```ts
// ReportMng/ReportMng.ts
export const [ReportMng, useReportMng] = createManager(useController, 'ReportMng');
```




## Типы данных

Deep Tree рекомендует строгую типизацию через TypeScript.

При создании типа или интерфейса используется префикс `T` — для единообразия и читаемости.
Например: `TProfile`, `TItem`, `TFeature`, `TTeamMember`.

### Правила
- Имя начинается с префикса `T` и пишется в PascalCase.
- Правило применяется как к `type`, так и к `interface`.

### Примеры
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
