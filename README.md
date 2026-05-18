# Bookmark Window Tiler

A robust, developer-centric Firefox extension built with modern TypeScript and native ES Modules. It allows you to bind specific bookmark folders to precise, pixel-perfect monitor coordinate layouts. Whether managing stock tickers, cross-referencing monitoring tools, or launching workspace splits, it handles layout states seamlessly.

## Features

- **Multi-Profile Management:** Save multiple independent window layout configurations for the exact same bookmark folder (e.g., "Morning Trading", "Late Night Dev").
- **Dynamic Grid Mapping:** Configures individual dimensions (`X`, `Y`, `Width`, `Height`) and toggle states per individual URL.
- **Hierarchical Tree Traversal:** Retains native bookmark folder nesting architectures with custom depth-based indentation, plus a toggle for clean alphabetical sorting.
- **Smart Window Extraction:** If a URL is already open inside a shared window with other random tabs, the extension automatically extracts that specific tab into its own independent frame and snaps it to your layout boundaries.
- **State Serialization:** Persists multi-profile coordinate trees safely using the WebExtensions local storage pipeline.

## Project Structure

```text
bookmark-window-tiler/
├── dist/                   # Compiled execution engine (Firefox target)
├── src/
│   ├── manifest.json       # Extension capabilities & permission declarations
│   ├── options/
│   │   ├── options.css     # Settings panel styling layout
│   │   ├── options.html    # Configuration workbench view
│   │   ├── options.ts      # Profile management & storage engine
│   │   └── templates.ts    # Declarative component layout strings
│   └── popup/
│       ├── popup.html      # Popover execution viewport
│       └── popup.ts        # Tab extraction & window spawning matrix
├── eslint.config.mts       # Bifurcated code intelligence rules
├── package.json            # Task automation controls & dev tool declarations
└── tsconfig.json           # ECMAScript target compiler configurations
```

## Installation (Local Workspace Development)

1. Clone this repository into your development directory:
   ```bash
   git clone [https://github.com/altoinu/bookmark-window-tiler.git](https://github.com/altoinu/bookmark-window-tiler.git)
   cd bookmark-window-tiler
   ```
2. Initialize development dependencies and configure operational git hooks:
   ```bash
   npm install
   ```
3. Compile the TypeScript sources into production assets:
   ```bash
   npm run build
   ```
4. Open Firefox and navigate to `about:debugging`.
5. Select **This Firefox** on the left menu rail.
6. Click **Load Temporary Add-on...** and select the `manifest.json` file located inside the compiled **`dist/`** directory.

## Usage Guide

1. **Access Options:** Right-click the extension toolbar icon and choose **Manage Extension**, then transition to the **Preferences** tab.
2. **Assign Folder Targets:** Select your workspace bookmark folder from the hierarchical drop-down menu.
3. **Configure Dimensions:** Choose `-- Create New Profile --`, provide a unique layout title, change the individual pixel grids to match your desktop workspace targets, and hit **Save Profile**.
4. **Deploy Workspaces:** Open the toolbar popover menu and tap your profile. Open windows will instantly conform, and closed windows will safely initialize.

## Development & Debugging Workflow

The workspace is fully optimized for integrated breakpoint debugging and live console logging directly inside VS Code (or Cursor), bypassing the need to manually load or inspect resources through standard browser interfaces.

### Automated VS Code Debugging (Recommended)

1. **Start the Compiler Watcher:** In an open terminal tab, spin up the active TypeScript file-watcher to ensure source maps stay live:
   ```bash
   npm run watch
   ```
2. **Launch the Debugger:** Go to the **Run and Debug** sidebar panel in VS Code (`Cmd + Shift + D`), select **Launch Extension Workspace** from the configuration dropdown menu, and press **`F5`** (or click the green Play button).
3. **Automated Lifecycle:** VS Code will automatically open an isolated, clean Firefox instance, dynamically mount the temporary extension directly out of your compiled `dist/` directory, and establish the debugging socket pipeline.
4. **Persistent Popup Debugging:** Because extension popups automatically close when focus is lost, click the **"Disable Popup Auto-Hide"** toggle icon injected by the debugger at the top of your Firefox viewport window (or press `Alt + Shift + J`). This locks the popup open so you can interact with your editor without unloading the interface thread.
5. **Trace Code & Logs:** Place breakpoints directly inside your source `src/**/*.ts` files. Execution will freeze seamlessly inside your editor window, and all runtime `console.log` lines will stream live straight to your VS Code **Debug Console** tab (`Cmd + Shift + Y`).

### Manual Extension Inspection

If you prefer testing functionality outside of the automated VS Code launcher environment:
1. Compile the workspace manually by executing `npm run build`.
2. Follow steps 4–6 in the standard **Installation** guide above to mount the temporary asset inside `about:debugging`.
3. Click the **Inspect** button adjacent to the extension descriptor within `about:debugging` to reveal the standalone Firefox Add-on Toolbox window to trace local storage entries and debug script executions.

## Scripts Command Index

- `npm run build` - Transpiles the extension package and stages production assets inside `dist/`.
- `npm run watch` - Runs the TypeScript compiler in active file-watcher mode.
- `npm run lint` - Executes automated ESLint syntax validation across source files and toolings.
- `npm run format:all` - Runs Prettier format processing rules uniformly across the repository workspace.