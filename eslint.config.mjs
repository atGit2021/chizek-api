import globals from 'globals';
import pluginJs from '@eslint/js';
import typescriptParser from '@typescript-eslint/parser';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginJest from 'eslint-plugin-jest';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      parser: typescriptParser,
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescript,
      prettier: eslintPluginPrettier,
      jest: eslintPluginJest,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...eslintPluginTypescript.configs.recommended.rules,
      'prettier/prettier': ['error'],
    },
  },
  {
    rules: {
      'capitalized-comments': ['error', 'always'],
    },
  },
  {
    ignores: ['dist/**/*', 'jest.config.ts', 'eslint.config.mjs'],
  },
];
