import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import js from '@eslint/js';
import globals from 'globals';
import { fixupPluginRules } from '@eslint/compat';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'src/dev/**',
      '**/scripts/**',
      '**/bin/**',
      'pnpm-lock.yaml',
      '**/*.md',
    ],
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],

    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        process: true,
      },
    },
    plugins: {
      react: fixupPluginRules(reactPlugin),
      import: fixupPluginRules(importPlugin),
      prettier: prettierPlugin,
      'react-hooks': fixupPluginRules(reactHooksPlugin),
      'unused-imports': fixupPluginRules(unusedImportsPlugin),
    },
    rules: {
      'prettier/prettier': ['error', { jsxSingleQuote: true }],
      'no-console': [
        'error',
        {
          allow: ['info', 'warn', 'error'],
        },
      ],
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            {
              pattern: '**/*.+(css|sass|less|scss|pcss|styl)',
              patternOptions: { dot: true, nocomment: true },
              group: 'unknown',
              position: 'after',
            },
            {
              pattern: '{.,..}/**/*.+(css|sass|less|scss|pcss|styl)',
              patternOptions: { dot: true, nocomment: true },
              group: 'unknown',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/newline-after-import': ['error', { count: 1 }],
      'semi': 'off',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      'jsx-quotes': ['error', 'prefer-single'],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
    },
    settings: {
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      'no-undef': 'off',
      'import/named': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'react/no-unescaped-entities': 'off',
      'no-console': 'off',
      semi: ['warn', 'always'],
      '@typescript-eslint/no-empty-interface': 'off',
      'prettier/prettier': [
        'error',
        { singleQuote: true, parser: 'typescript' },
      ],
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
    settings: {
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.ts', '.tsx'],
        },
      },
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
    },
  },
);
