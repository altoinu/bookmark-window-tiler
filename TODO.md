# Bookmark Window Tiler - Project Roadmap & Status

## 🎛️ Profile & Storage Enhancements

- [ ] **JSON Import/Export Matrix:** Add backup/restore actions to the Options Workbench allowing layouts to be backed up or shared as raw configuration objects.
- [ ] **Profile Cloning:** Implement a "Duplicate Profile" button to quickly scaffold new coordinate layouts from existing base presets.
- [x] **Profile Deletion Engine:** Wired up a defensive asynchronous storage eviction mechanism (`browser.storage.local.remove`) to safely prune unwanted layouts and dynamically refresh workbench viewports.
- [ ] **Schema Migrations:** Set up a lightweight versioning wrapper for the WebExtensions local storage pipeline to handle future schema alterations gracefully.

## 🖥️ Multi-Monitor & Coordinate Intelligence

- [x] **Display Topology Awareness:** Implemented a Virtual Monitor Calibration engine allowing users to define physical display offsets and route specific bookmark windows to secondary screens, circumventing Firefox's lack of native hardware topology APIs.
- [ ] **Layout Snapping Previews:** Create a visual layout wireframe overlay in the options panel to show users where their windows will launch before saving.
- [x] **Relative/Percentage Grid Splitting:** Supported percentage-based fractional grid mappings (e.g., `50%`, `33%`) resolved dynamically at runtime against operating system display bounds (`availWidth`/`availHeight`).

## 🚀 Execution & Automation Layer

- [ ] **Global Hotkey Bindings:** Configure custom background triggers via the `commands` API in `manifest.json` to deploy a profile instantaneously via keyboard shortcuts.
- [ ] **Silent Error Mitigation:** Gracefully intercept execution blockers like system-protected frames (`about:*`, `view-source:*`) or dead URLs during the tab-extraction process.
- [ ] **Workspace State Overwrite:** Add an alternative execution mode to completely close all unrelated open windows/tabs when a targeted profile initializes.

## 📦 Deployment & Lifecycle Management (New Section)

- [ ] **Firefox Add-ons Publishing:** Complete the developer verification, review, and signing process for listing the extension on the official Mozilla Add-ons (AMO) store.
- [x] **Permanent Installation Methodology:** Researched and implemented an "On your own" Unlisted distribution model, complete with automated `.zip` packaging and a self-hosted `updates.json` GitHub ledger for seamless local upgrades.

## 🎨 UI/UX Polish & Tooling

- [ ] **Dark Mode Syncing:** Apply a declarative CSS variable scheme that automatically respects the host operating system's light/dark profile theme.
- [ ] **Drag-and-Drop Tree Sorting:** Enhance the Options drop-down with drag handles to allow manual reordering of folder hierarchies alongside the alphabetical toggle.
- [x] **Multi-Language Prettier Pipeline:** Expanded the developer workflow formatting matrix within `package.json` to natively intercept, clean, and standardize `.html` and `.css` files alongside core source files.
- [ ] **Real-Time Active Tracking:** Highlight the currently active profile button in the popup viewport if all current browser windows match saved coordinates perfectly.
- [x] **Vector Asset Branding:** Integrated a high-fidelity, scalable SVG workspace icon natively across the extension manifest background context, option window headers, and toolbar dropdown popovers.
- [x] **Workbench Layout Refinement:** Fixed and stabilized the CSS grid/flexbox UI layout within the `templates.ts` generator and options stylesheet to ensure consistent alignment and proper interactive toggling.

## 🛠️ Validation, Architecture & Templates

- [x] **GitHub Repository Template Creation:** Turned this customized ground-up WebExtension configuration into a reusable, cross-browser repository blueprint (`webextension-template`) on GitHub, integrated with `webextension-polyfill` for bootstrapping future extensions.
- [ ] **Jest Testing Framework Support:** Integrate Jest along with the necessary TypeScript/ESM configurations to unit test our state management, layout utilities, and coordinate calculation algorithms step-by-step.
- [ ] **React Framework Feasibility Study:** Investigate architectural patterns, build requirements (such as bundler configurations like Vite/Webpack), and UI sync strategies for utilizing React to build complex extension option panels and popups.
