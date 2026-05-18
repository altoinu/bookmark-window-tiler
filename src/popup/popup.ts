import { WorkspaceProfile } from '../types/index.js';

const resolveDimension = (value: string | number, maxAvailable: number): number => {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && value.endsWith('%')) {
    const percentage = parseFloat(value) / 100;
    return Math.round(maxAvailable * percentage);
  }
  return parseInt(value, 10) || 0;
};

const launchProfile = async (profile: WorkspaceProfile): Promise<void> => {
  const urls = Object.keys(profile.urlConfigs);

  // Fetch all currently open tabs across all windows
  const allTabs = await browser.tabs.query({});

  // Helper function to remove trailing slashes, empty queries (?), or hashes (#)
  const cleanUrl = (u: string): string => u.replace(/[/?#]+$/, '');

  // We use Promise.all to dispatch every command to the browser simultaneously.
  // If we used a standard for-loop with await, the first window that spawns
  // would steal focus, instantly killing the popup script before the loop finishes!
  const operations = urls.map(async (url) => {
    const layout = profile.urlConfigs[url];

    // Only launch if the user left the checkbox enabled
    if (layout && layout.enabled) {
      try {
        // Resolve dynamic percentage options or absolute pixel integers against current screen layout
        const calculatedHeight = resolveDimension(layout.height, window.screen.availHeight);
        const calculatedWidth = resolveDimension(layout.width, window.screen.availWidth);
        const calculatedX = resolveDimension(layout.x, window.screen.availWidth);
        const calculatedY = resolveDimension(layout.y, window.screen.availHeight);

        // Look for a cleaned-up match in our open tabs
        const existingTab = allTabs.find((tab) => tab.url && cleanUrl(tab.url) === cleanUrl(url));

        if (existingTab && existingTab.windowId && existingTab.id) {
          // Check how many tabs are currently in this specific window
          const tabsInSharedWindow = allTabs.filter((t) => t.windowId === existingTab.windowId);

          if (tabsInSharedWindow.length > 1) {
            console.log(`Extracting shared tab ${url} into its own layout window.`);
            // Extract the existing tab into a new window with the precise layout
            await browser.windows.create({
              height: calculatedHeight,
              left: calculatedX,
              tabId: existingTab.id,
              top: calculatedY,
              width: calculatedWidth,
            });
          } else {
            console.log(`Tab already open and standalone for ${url}, snapping to layout.`);
            // 1. Activate the tab within its window
            await browser.tabs.update(existingTab.id, { active: true });

            // 2. Bring the window to the front and apply the configured dimensions
            await browser.windows.update(existingTab.windowId, {
              focused: true,
              height: calculatedHeight,
              left: calculatedX,
              top: calculatedY,
              width: calculatedWidth,
            });
          }
        } else {
          // Tab doesn't exist, spawn a fresh window
          await browser.windows.create({
            height: calculatedHeight,
            left: calculatedX,
            top: calculatedY,
            url: url,
            width: calculatedWidth,
          });
        }
      } catch (error) {
        console.error(`Failed to launch or update window for ${url}:`, error);
      }
    }
  });

  // Execute all window/tab commands before the popup closes
  await Promise.all(operations);

  // Close the popup menu automatically
  window.close();
};

const initializePopup = async (): Promise<void> => {
  const container = document.getElementById('profiles-container');
  if (!container) return;

  try {
    // Fetch all storage
    const storage = await browser.storage.local.get(null);

    // Filter to find our specific workspace objects
    const profiles: WorkspaceProfile[] = Object.keys(storage)
      .filter((key) => key.startsWith('workspace_'))
      .map((key) => storage[key] as WorkspaceProfile);

    if (profiles.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          No profiles found.<br><br>
          Right-click this icon and select "Options" or "Preferences" to create one.
        </div>
      `;
      return;
    }

    container.innerHTML = '';

    // Alphabetize the buttons by folder name
    profiles.sort((a, b) => a.name.localeCompare(b.name));

    profiles.forEach((profile) => {
      const btn = document.createElement('button');
      btn.className = 'profile-btn';
      btn.textContent = `🚀 ${profile.name}`;

      btn.addEventListener('click', () => launchProfile(profile));
      container.appendChild(btn);
    });
  } catch (error) {
    console.error('Error loading profiles:', error);
    container.innerHTML = '<div class="empty-state" style="color: red;">Error loading profiles.</div>';
  }
};

document.addEventListener('DOMContentLoaded', initializePopup);
