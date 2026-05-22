import pluginJs from '@eslint/js';
import pluginJson from '@eslint/json';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { dirname } from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = defineConfig([
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**', 'package-lock.json'],
  },

  { files: ['**/*.json'], plugins: { json: pluginJson }, language: 'json/json', extends: ['json/recommended'] },
  { files: ['**/*.jsonc'], plugins: { json: pluginJson }, language: 'json/jsonc', extends: ['json/recommended'] },
  { files: ['**/*.json5'], plugins: { json: pluginJson }, language: 'json/json5', extends: ['json/recommended'] },

  // Specific override to parse tsconfig.json with JSONC language engine to preserve internal comments
  {
    files: ['tsconfig.json'],
    language: 'json/jsonc',
  },

  // Restrict core JS recommended rules to only target JS/TS files
  {
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    ...pluginJs.configs.recommended,
  },

  ...tseslint.configs.recommended,
  // --- Block for ROOT level config files (Syntax only, no strict type-checking) ---
  {
    files: ['*.{js,cjs,mjs,ts,cts,mts}'], // Only targets TS files sitting in the root folder
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  // --- Block for SRC level application files (Strict type-checking) ---
  {
    // for ts files
    // files: ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"],
    // files: ["**/*.?(c|m)[jt]s?(x)"],
    files: ['src/**/*.{ts,cts,mts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    // for js files
    // files: ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"],
    // files: ["**/*.?(c|m)[jt]s?(x)"],
    files: ['**/*.{js,cjs,mjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  // Prettier (must be the last config)
  eslintConfigPrettier,
]);

export default eslintConfig;
