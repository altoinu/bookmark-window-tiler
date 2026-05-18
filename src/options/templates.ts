export const generateUrlConfigHtml = (
  title: string,
  url: string,
  index: number,
  layout?: {
    enabled: boolean;
    height: number;
    width: number;
    x: number;
    y: number;
  },
): string => {
  // Use saved config values if they exist, otherwise fall back to defaults
  const enabled = layout ? layout.enabled : true;
  const height = layout ? layout.height : 600;
  const width = layout ? layout.width : 800;
  const x = layout ? layout.x : 0;
  const y = layout ? layout.y : 0;

  return `
    <div class="url-card">
      <div class="url-title">${title}</div>
      <div class="input-row">
        <label class="input-label">
          <input type="checkbox" id="enabled-${index}" ${enabled ? 'checked' : ''}>
          Enabled
        </label>
        <label class="input-label">
          Width: <input type="number" class="number-input" id="w-${index}" value="${width}">
        </label>
        <label class="input-label">
          Height: <input type="number" class="number-input" id="h-${index}" value="${height}">
        </label>
        <label class="input-label">
          X: <input type="number" class="number-input" id="x-${index}" value="${x}">
        </label>
        <label class="input-label">
          Y: <input type="number" class="number-input" id="y-${index}" value="${y}">
        </label>
        <input type="hidden" id="url-${index}" value="${url}">
      </div>
    </div>
  `;
};
