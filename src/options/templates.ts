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

export const generateUrlConfigHtml = (title: string, url: string, index: number, layout?: WindowLayout): string => {
  // Use saved config values if they exist, otherwise fall back to defaults
  const enabled = layout ? layout.enabled : true;

  const hParsed = parseLayoutValue(layout?.height, 600);
  const wParsed = parseLayoutValue(layout?.width, 800);
  const xParsed = parseLayoutValue(layout?.x, 0);
  const yParsed = parseLayoutValue(layout?.y, 0);

  return `
    <div class="url-card">
      <div class="url-title">${title}</div>
      <div class="input-row">
        <label class="input-label">
          <input type="checkbox" id="enabled-${index}" ${enabled ? 'checked' : ''}>
          Enabled
        </label>
        <label class="input-label">
          Width: 
          <input type="number" class="number-input" id="w-${index}" value="${wParsed.value}" style="width: 60px;">
          <select id="w-unit-${index}">
            <option value="px" ${wParsed.unit === 'px' ? 'selected' : ''}>px</option>
            <option value="%" ${wParsed.unit === '%' ? 'selected' : ''}>%</option>
          </select>
        </label>
        <label class="input-label">
          Height: 
          <input type="number" class="number-input" id="h-${index}" value="${hParsed.value}" style="width: 60px;">
          <select id="h-unit-${index}">
            <option value="px" ${hParsed.unit === 'px' ? 'selected' : ''}>px</option>
            <option value="%" ${hParsed.unit === '%' ? 'selected' : ''}>%</option>
          </select>
        </label>
        <label class="input-label">
          X: 
          <input type="number" class="number-input" id="x-${index}" value="${xParsed.value}" style="width: 60px;">
          <select id="x-unit-${index}">
            <option value="px" ${xParsed.unit === 'px' ? 'selected' : ''}>px</option>
            <option value="%" ${xParsed.unit === '%' ? 'selected' : ''}>%</option>
          </select>
        </label>
        <label class="input-label">
          Y: 
          <input type="number" class="number-input" id="y-${index}" value="${yParsed.value}" style="width: 60px;">
          <select id="y-unit-${index}">
            <option value="px" ${yParsed.unit === 'px' ? 'selected' : ''}>px</option>
            <option value="%" ${yParsed.unit === '%' ? 'selected' : ''}>%</option>
          </select>
        </label>
        <input type="hidden" id="url-${index}" value="${url}">
      </div>
    </div>
  `;
};
