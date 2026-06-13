import { VirtualDisplay, WindowLayout } from '../types/index.js';

const parseLayoutValue = (val: string | number | undefined, defaultVal: number) => {
  if (val === undefined) {
    return { unit: 'px', value: defaultVal };
  }
  if (typeof val === 'number') {
    return { unit: 'px', value: val };
  }
  const parsedNum = parseInt(val, 10);
  const unit = val.includes('%') ? '%' : 'px';
  return { unit, value: isNaN(parsedNum) ? defaultVal : parsedNum };
};

const renderField = (prefix: string, index: number, val: number, unit: string, label: string) => `
  <div class="field-grid">
    <span class="field-name">${label}:</span>
    <input type="number" class="number-input" id="${prefix}-${index}" value="${val}">
    <select id="${prefix}-unit-${index}" class="unit-select">
      <option value="px" ${unit === 'px' ? 'selected' : ''}>px</option>
      <option value="%" ${unit === '%' ? 'selected' : ''}>%</option>
    </select>
  </div>
`;

export const generateUrlConfigHtml = (title: string, url: string, index: number, displays: VirtualDisplay[], layout?: WindowLayout): string => {
  const displayId = layout?.displayId || '';
  const enabled = layout ? layout.enabled : true;
  const hParsed = parseLayoutValue(layout?.height, 600);
  const wParsed = parseLayoutValue(layout?.width, 800);
  const xParsed = parseLayoutValue(layout?.x, 0);
  const yParsed = parseLayoutValue(layout?.y, 0);

  const displayOptions = displays
    .map((d) => {
      const label = `${d.name} (${d.width}x${d.height})`;
      return `<option value="${d.id}" ${displayId === d.id ? 'selected' : ''}>${label}</option>`;
    })
    .join('');

  return `
    <div class="url-card">
      <input type="checkbox" class="url-checkbox" id="enabled-${index}" ${enabled ? 'checked' : ''}>
      <label class="url-title" for="enabled-${index}">${title}</label>
      <div class="fields-container">
        
        <div class="field-grid" style="grid-column: 1 / -1; margin-bottom: 8px;">
          <span class="field-name" style="width: auto; margin-right: 8px;">Display:</span>
          <select id="display-${index}" class="display-select" style="flex: 1; padding: 4px; border-radius: 4px; border: 1px solid #ccc;">
            <option value="" ${!displayId ? 'selected' : ''}>-- Default (Primary) --</option>
            ${displayOptions}
          </select>
        </div>

        ${renderField('x', index, xParsed.value, xParsed.unit, 'X')}
        ${renderField('y', index, yParsed.value, yParsed.unit, 'Y')}
        ${renderField('w', index, wParsed.value, wParsed.unit, 'W')}
        ${renderField('h', index, hParsed.value, hParsed.unit, 'H')}
      </div>
      <input type="hidden" id="url-${index}" value="${url}">
    </div>
  `;
};
