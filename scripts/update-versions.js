/**
 * update-versions.js
 *
 * Purpose: Automates version synchronization across the extension's metadata files.
 *
 * Workflow:
 * 1. Reads the new version string from package.json after an `npm version` bump.
 * 2. Updates the `version` field in `src/manifest.json`.
 * 3. Updates the `updates.json` ledger with the new release version and correctly
 *    formatted GitHub release download URL.
 * 4. Ensures files are saved with proper indentation and terminal-friendly formatting.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Load configurations
const packageJsonPath = path.join(rootDir, 'package.json');
const manifestPath = path.join(rootDir, 'src', 'manifest.json');
const updatesPath = path.join(rootDir, 'updates.json');

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const updates = JSON.parse(fs.readFileSync(updatesPath, 'utf8'));

const newVersion = pkg.version;
const addonId = manifest.browser_specific_settings.gecko.id;

// Dynamically extract repo details from "git+https://github.com/user/repo.git"
const repoUrl = pkg.repository.url;
const repoPath = repoUrl.replace('git+', '').replace('.git', '');

console.log(`Synchronizing project files to version ${newVersion}...`);

// 1. Update manifest.json
manifest.version = newVersion;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('✅ Updated src/manifest.json');

// 2. Update updates.json
if (updates.addons && updates.addons[addonId] && updates.addons[addonId].updates) {
  const newUpdateEntry = {
    update_link: `${repoPath}/releases/download/v${newVersion}/${pkg.name}-${newVersion}.xpi`,
    version: newVersion,
  };

  const existingIndex = updates.addons[addonId].updates.findIndex((u) => u.version === newVersion);
  if (existingIndex !== -1) {
    updates.addons[addonId].updates[existingIndex] = newUpdateEntry;
  } else {
    updates.addons[addonId].updates.unshift(newUpdateEntry);
  }

  fs.writeFileSync(updatesPath, JSON.stringify(updates, null, 2) + '\n');
  console.log('✅ Updated updates.json');
} else {
  console.warn('⚠️ updates.json structure mismatch or addonId not found!');
}
