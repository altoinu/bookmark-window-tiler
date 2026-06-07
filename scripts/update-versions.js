import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Establish root directory context
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Extract the newly bumped version from package.json
const packageJsonPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const newVersion = pkg.version;

console.log(`Synchronizing project files to version ${newVersion}...`);

// 1. Update the extension manifest
const manifestPath = path.join(rootDir, 'src', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.version = newVersion;

  // Write with 2 spaces to maintain formatting
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log('✅ Updated src/manifest.json');
} else {
  console.warn('⚠️ src/manifest.json not found!');
}

// 2. Update the self-distribution ledger
const updatesPath = path.join(rootDir, 'updates.json');
if (fs.existsSync(updatesPath)) {
  const updates = JSON.parse(fs.readFileSync(updatesPath, 'utf8'));
  const addonId = 'bookmark-window-tiler@altovel.com';

  if (updates.addons && updates.addons[addonId] && updates.addons[addonId].updates) {
    const newUpdateEntry = {
      update_link: `https://github.com/altoinu/bookmark-window-tiler/releases/download/v${newVersion}/bookmark-window-tiler-${newVersion}.xpi`,
      version: newVersion,
    };

    // Prepend the new release to the updates array (or update if rerunning the same version)
    const existingIndex = updates.addons[addonId].updates.findIndex((u) => u.version === newVersion);
    if (existingIndex !== -1) {
      updates.addons[addonId].updates[existingIndex] = newUpdateEntry;
    } else {
      updates.addons[addonId].updates.unshift(newUpdateEntry);
    }

    fs.writeFileSync(updatesPath, JSON.stringify(updates, null, 2) + '\n');
    console.log('✅ Updated updates.json');
  }
} else {
  console.warn('⚠️ updates.json not found!');
}
