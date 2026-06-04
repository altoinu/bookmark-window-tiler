const linststagedConfig = {
  // Target your source files for native ESLinting and Prettier formatting
  '*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}': ['npm run lint:fix', 'prettier --write'],

  // Non-code files (like markdown or css) only need Prettier formatting
  '*.{md,html,css}': ['prettier --write'],
};

export default linststagedConfig;
