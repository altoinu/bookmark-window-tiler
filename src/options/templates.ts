import { WindowLayout } from '../types/index.js';

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

export const generateUrlConfigHtml = (title: string, url: string, index: number, layout?: WindowLayout): string => {
  // Use saved config values if they exist, otherwise fall back to defaults
  const enabled = layout ? layout.enabled : true;
  const hParsed = parseLayoutValue(layout?.height, 600);
  const wParsed = parseLayoutValue(layout?.width, 800);
  const xParsed = parseLayoutValue(layout?.x, 0);
  const yParsed = parseLayoutValue(layout?.y, 0);

  return `
    <div class="url-card">
      <input type="checkbox" class="url-checkbox" id="enabled-${index}" ${enabled ? 'checked' : ''}>
      <label class="url-title" for="enabled-${index}">${title}</label>
      <div class="fields-container">
        ${renderField('x', index, xParsed.value, xParsed.unit, 'X')}
        ${renderField('y', index, yParsed.value, yParsed.unit, 'Y')}
        ${renderField('w', index, wParsed.value, wParsed.unit, 'W')}
        ${renderField('h', index, hParsed.value, hParsed.unit, 'H')}
      </div>
      <input type="hidden" id="url-${index}" value="${url}">
    </div>
  `;
};
