import { WorkspaceProfile } from '../types/index.js';
import { generateUrlConfigHtml } from './templates.js';

// Extend the native bookmark type to include our custom depth property
export interface FolderNode extends browser.bookmarks.BookmarkTreeNode {
  depth: number;
}

// Global cached states for runtime operation
let allFolders: FolderNode[] = [];
let currentFolderId: string = '';
let currentProfileId: string = 'new';
let currentProfilesList: WorkspaceProfile[] = [];
let isUpdatingDropdown: boolean = false;

const deleteProfile = async (): Promise<void> => {
  if (currentProfileId === 'new' || !currentProfileId) return;

  const activeProfile = currentProfilesList.find((p) => p.id === currentProfileId);
  const profileName = activeProfile ? activeProfile.name : 'this profile';

  if (!confirm(`Are you sure you want to delete the profile "${profileName}"?`)) {
    return;
  }

  try {
    // Evict target profile layout key from local storage pipeline
    const storageKey = `workspace_${currentProfileId}`;
    await browser.storage.local.remove(storageKey);

    // Revert structural configuration state back to new blueprint mode
    currentProfileId = 'new';

    // Synchronize selector views and clean remaining grid layouts
    await syncProfilesDropdown();
    await renderLayoutGrid();

    console.log(`Successfully evicted storage profile: ${storageKey}`);
  } catch (error) {
    console.error('Error executing profile deletion sequence:', error);
    alert('Failed to delete the profile configuration.');
  }
};

// Recursively parse the bookmark tree to extract only folders and track depth
const extractFolders = (nodes: browser.bookmarks.BookmarkTreeNode[], depth: number = 0): FolderNode[] => {
  let folders: FolderNode[] = [];

  for (const node of nodes) {
    // Folders do not have URLs. We also ensure it has a title to avoid invisible system root nodes.
    if (!node.url && node.title) {
      // Push a new object combining the native node properties with our calculated depth
      folders.push({ ...node, depth });
    }

    // If this node has children, recurse into it, increasing the depth counter by 1
    if (node.children) {
      folders = folders.concat(extractFolders(node.children, depth + 1));
    }
  }

  return folders;
};

// Render the folder select dropdown based on the chosen sort mode
const renderDropdown = (sortMode: 'alphabetical' | 'original'): void => {
  const selectEl = document.getElementById('folder-select') as HTMLSelectElement;
  selectEl.innerHTML = '<option value="">-- Select a Bookmark Folder --</option>';

  const displayFolders = [...allFolders];

  if (sortMode === 'alphabetical') {
    displayFolders.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }

  displayFolders.forEach((folder) => {
    const option = document.createElement('option');
    option.value = folder.id;

    // Add indentation: 4 non-breaking spaces per depth level if in original mode
    // If in alphabetical mode, we strip indentation so the list sits flush against the left
    const indentation = sortMode === 'original' ? '\u00A0\u00A0\u00A0\u00A0'.repeat(folder.depth) : '';
    option.textContent = `${indentation}${folder.title}`;

    // Maintain selection if the user toggled the sort mode
    if (folder.id === currentFolderId) {
      option.selected = true;
    }

    selectEl.appendChild(option);
  });
};

// Builds the grid inputs matching either saved configurations or fallback defaults
const renderLayoutGrid = async (): Promise<void> => {
  const container = document.getElementById('url-config-container');
  const deleteBtn = document.getElementById('delete-btn') as HTMLButtonElement;
  const profileNameInput = document.getElementById('profile-name') as HTMLInputElement;
  const saveBtn = document.getElementById('save-btn');

  if (!container || !deleteBtn || !profileNameInput || !saveBtn) return;

  try {
    const children = await browser.bookmarks.getChildren(currentFolderId);
    const links = children.filter((child) => child.url);

    if (links.length === 0) {
      container.innerHTML = '<p>No URLs found in this folder.</p>';
      deleteBtn.style.display = 'none';
      saveBtn.style.display = 'none';
      return;
    }

    // Find if we are loading an active saved profile configuration
    const activeProfile = currentProfilesList.find((p) => p.id === currentProfileId);

    if (activeProfile) {
      profileNameInput.value = activeProfile.name;
      deleteBtn.style.display = 'inline-block';
    } else {
      // Default name to folder title if initializing a new profile configuration
      const folderData = allFolders.find((f) => f.id === currentFolderId);
      profileNameInput.value = folderData?.title ? `${folderData.title} Layout` : '';
      deleteBtn.style.display = 'none';
    }

    let html = '<h3 style="margin-top: 0;">Configure Layouts</h3>';
    html += '<div class="grid-container">';

    links.forEach((link, index) => {
      if (link.url) {
        const title = link.title || link.url;
        // Extract saved configuration layout if it exists for this URL
        const savedLayout = activeProfile?.urlConfigs[link.url];
        html += generateUrlConfigHtml(title, link.url, index, savedLayout);
      }
    });

    html += '</div>';

    container.innerHTML = html;
    saveBtn.style.display = 'inline-block';
  } catch (error) {
    console.error('Error rendering grid layout:', error);
    container.innerHTML = '<p style="color: red;">Error processing folder components.</p>';
  }
};

// Discovers and updates configuration profiles assigned to the selected folder
const syncProfilesDropdown = async (): Promise<void> => {
  const profileMgmtContainer = document.getElementById('profile-mgmt-container');
  const profileSelectEl = document.getElementById('profile-select') as HTMLSelectElement;

  if (!profileMgmtContainer || !profileSelectEl) return;

  // Activate lock flag to ignore browser-driven event dispatches during DOM reconstruction
  isUpdatingDropdown = true;

  // Clear existing choices but preserve the primary generator option
  profileSelectEl.innerHTML = '<option value="new">-- Create New Profile --</option>';

  if (!currentFolderId) {
    profileMgmtContainer.style.display = 'none';
    isUpdatingDropdown = false;
    return;
  }

  // Fetch all storage configurations to extract target folder assignments
  const storage = await browser.storage.local.get(null);
  currentProfilesList = Object.keys(storage)
    .filter((key) => key.startsWith('workspace_'))
    .map((key) => storage[key] as WorkspaceProfile)
    .filter((profile) => profile.bookmarkFolderId === currentFolderId);

  // Append profile options if any entries correlate
  currentProfilesList.forEach((profile) => {
    const option = document.createElement('option');
    option.value = profile.id;
    option.textContent = profile.name;
    if (profile.id === currentProfileId) {
      option.selected = true;
    }
    profileSelectEl.appendChild(option);
  });

  profileMgmtContainer.style.display = 'block';

  // Release the event handler lock once layout rendering settles
  isUpdatingDropdown = false;
};

const handleFolderSelection = async (event: Event): Promise<void> => {
  if (isUpdatingDropdown || !event.isTrusted) return; // Guard against programmatic option resets during re-renders
  const selectEl = event.target as HTMLSelectElement;
  currentFolderId = selectEl.value;
  currentProfileId = 'new'; // Reset to default when swapping workspace targets

  const container = document.getElementById('url-config-container');
  const deleteBtn = document.getElementById('delete-btn') as HTMLButtonElement;
  const saveBtn = document.getElementById('save-btn');

  if (!container || !deleteBtn || !saveBtn) return;

  if (!currentFolderId) {
    container.innerHTML = '';
    deleteBtn.style.display = 'none';
    saveBtn.style.display = 'none';
    await syncProfilesDropdown();
    return;
  }

  await syncProfilesDropdown();
  await renderLayoutGrid();
};

const handleProfileSelection = async (event: Event): Promise<void> => {
  if (isUpdatingDropdown || !event.isTrusted) return; // Guard against programmatic option resets during re-renders
  const selectEl = event.target as HTMLSelectElement;
  currentProfileId = selectEl.value;
  await renderLayoutGrid();
};

const handleSortChange = (event: Event): void => {
  const radio = event.target as HTMLInputElement;
  renderDropdown(radio.value as 'alphabetical' | 'original');
};

const saveProfile = async (): Promise<void> => {
  if (!currentFolderId) return;

  const profileNameInput = document.getElementById('profile-name') as HTMLInputElement;
  const chosenName = profileNameInput?.value.trim();

  if (!chosenName) {
    alert('Please provide a profile name before saving.');
    return;
  }

  // Check if a profile with the same name already exists for this folder to safely override it
  const matchingProfileByName = currentProfilesList.find((p) => p.name.toLowerCase() === chosenName.toLowerCase());

  // Preserve operational ID if overwriting an existing config, catch matching profile names, or establish a unique timestamp hash
  const finalProfileId = currentProfileId !== 'new' ? currentProfileId : matchingProfileByName ? matchingProfileByName.id : `profile_${Date.now()}`;

  const profile: WorkspaceProfile = {
    bookmarkFolderId: currentFolderId,
    id: finalProfileId,
    name: chosenName,
    urlConfigs: {},
  };

  const urlInputs = document.querySelectorAll('input[type="hidden"][id^="url-"]');

  urlInputs.forEach((hiddenInput) => {
    const url = (hiddenInput as HTMLInputElement).value;
    const index = hiddenInput.id.split('-')[1];

    const enabledEl = document.getElementById(`enabled-${index}`) as HTMLInputElement;
    const hEl = document.getElementById(`h-${index}`) as HTMLInputElement;
    const hUnitEl = document.getElementById(`h-unit-${index}`) as HTMLSelectElement;
    const wEl = document.getElementById(`w-${index}`) as HTMLInputElement;
    const wUnitEl = document.getElementById(`w-unit-${index}`) as HTMLSelectElement;
    const xEl = document.getElementById(`x-${index}`) as HTMLInputElement;
    const xUnitEl = document.getElementById(`x-unit-${index}`) as HTMLSelectElement;
    const yEl = document.getElementById(`y-${index}`) as HTMLInputElement;
    const yUnitEl = document.getElementById(`y-unit-${index}`) as HTMLSelectElement;

    if (url && enabledEl && hEl && hUnitEl && wEl && wUnitEl && xEl && xUnitEl && yEl && yUnitEl) {
      const hVal = parseInt(hEl.value, 10) || 600;
      const wVal = parseInt(wEl.value, 10) || 800;
      const xVal = parseInt(xEl.value, 10) || 0;
      const yVal = parseInt(yEl.value, 10) || 0;

      profile.urlConfigs[url] = {
        enabled: enabledEl.checked,
        height: hUnitEl.value === '%' ? `${hVal}%` : hVal,
        width: wUnitEl.value === '%' ? `${wVal}%` : wVal,
        x: xUnitEl.value === '%' ? `${xVal}%` : xVal,
        y: yUnitEl.value === '%' ? `${yVal}%` : yVal,
      };
    }
  });

  try {
    // Unique identifier key ensuring multi-profile safety
    const storageKey = `workspace_${finalProfileId}`;
    await browser.storage.local.set({ [storageKey]: profile });

    // Set the saved profile as active so the view doesn't jump or reset
    currentProfileId = finalProfileId;

    // Refresh configurations list and lock dropdown to active option
    await syncProfilesDropdown();
    await renderLayoutGrid();

    const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    saveBtn.style.backgroundColor = '#4caf50';
    saveBtn.style.color = 'white';

    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.style.backgroundColor = '';
      saveBtn.style.color = '';
    }, 2000);

    console.log('Saved profile to storage:', profile);
  } catch (error) {
    console.error('Error saving profile layout:', error);
    alert('Failed to save profile configuration.');
  }
};

const initializeOptions = async (): Promise<void> => {
  try {
    const tree = await browser.bookmarks.getTree();
    allFolders = extractFolders(tree);
    renderDropdown('original');

    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', deleteProfile);
    }

    const profileSelectEl = document.getElementById('profile-select') as HTMLSelectElement;
    profileSelectEl.addEventListener('change', handleProfileSelection);

    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', saveProfile);
    }

    const selectEl = document.getElementById('folder-select') as HTMLSelectElement;
    selectEl.addEventListener('change', handleFolderSelection);

    const sortRadios = document.querySelectorAll('input[name="sort-order"]');
    sortRadios.forEach((radio) => radio.addEventListener('change', handleSortChange));
  } catch (error) {
    console.error('Failed to load bookmarks configuration:', error);
  }
};

document.addEventListener('DOMContentLoaded', initializeOptions);
