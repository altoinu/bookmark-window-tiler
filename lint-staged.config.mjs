const linststagedConfig = {
  '*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}': ['npm run lint:fix', 'prettier --write'],
};

export default linststagedConfig;
