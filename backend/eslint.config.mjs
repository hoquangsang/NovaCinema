// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      quotes: ['error', 'single', { avoidEscape: true }],
      '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],

      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node core modules
            'external', // npm / @ libraries
            'internal', // alias / src modules
            ['parent', 'sibling', 'index'], // relative imports
          ],
          pathGroups: [
            //
            {
              pattern: 'src/modules/**/**',
              group: 'internal',
              position: 'before',
            },
            //
            {
              pattern: 'src/{common,util*,shared*,helper*}/**',
              group: 'internal',
              position: 'after',
            },
            //
            {
              pattern: '@**',
              group: 'external',
              position: 'before',
            },
            //
            {
              pattern: 'src/modules/**/constants',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/modules/**/types',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/modules/**/schemas',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/modules/**/repositories',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/modules/**/services',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/modules/**/controllers',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin', 'external'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
];
