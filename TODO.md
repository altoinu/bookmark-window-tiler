# Bookmark Window Tiler - Project Roadmap & Status

## 🎛️ Profile & Storage Enhancements

- [ ] **JSON Import/Export Matrix:** Add backup/restore actions to the Options Workbench allowing layouts to be backed up or shared as raw configuration objects.
- [ ] **Profile Cloning:** Implement a "Duplicate Profile" button to quickly scaffold new coordinate layouts from existing base presets.
- [x] **Profile Deletion Engine:** Wired up a defensive asynchronous storage eviction mechanism (`browser.storage.local.remove`) to safely prune unwanted layouts and dynamically refresh workbench viewports.
- [ ] **Schema Migrations:** Set up a lightweight versioning wrapper for the WebExtensions local storage pipeline to handle future schema alterations gracefully.

## 🖥️ Multi-Monitor & Coordinate Intelligence

- [ ] **Display Topology Awareness:** Integrate runtime screen environment checks (`window.screen` or extension display APIs) to validate input bounds against the user's active monitor setup.
- [ ] **Layout Snapping Previews:** Create a visual layout wireframe overlay in the options panel to show users where their windows will launch before saving.
- [x] **Relative/Percentage Grid Splitting:** Supported percentage-based fractional grid mappings (e.g., `50%`, `33%`) resolved dynamically at runtime against operating system display bounds (`availWidth`/`availHeight`).

## 🚀 Execution & Automation Layer

- [ ] **Global Hotkey Bindings:** Configure custom background triggers via the `commands` API in `manifest.json` to deploy a profile instantaneously via keyboard shortcuts.
- [ ] **Silent Error Mitigation:** Gracefully intercept execution blockers like system-protected frames (`about:*`, `view-source:*`) or dead URLs during the tab-extraction process.
- [ ] **Workspace State Overwrite:** Add an alternative execution mode to completely close all unrelated open windows/tabs when a targeted profile initializes.

## 🎨 UI/UX Polish & Tooling

- [ ] **Dark Mode Syncing:** Apply a declarative CSS variable scheme that automatically respects the host operating system's light/dark profile theme.
- [ ] **Drag-and-Drop Tree Sorting:** Enhance the Options drop-down with drag handles to allow manual reordering of folder hierarchies alongside the alphabetical toggle.
- [x] **Multi-Language Prettier Pipeline:** Expanded the developer workflow formatting matrix within `package.json` to natively intercept, clean, and standardize `.html` and `.css` files alongside core source files.
- [ ] **Real-Time Active Tracking:** Highlight the currently active profile button in the popup viewport if all current browser windows match saved coordinates perfectly.
- [x] **Vector Asset Branding:** Integrated a high-fidelity, scalable SVG workspace icon natively across the extension manifest background context, option window headers, and toolbar dropdown popovers.
