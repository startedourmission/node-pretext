/**
 * node-pretext
 *
 * Server-side text measurement for Node.js.
 * Uses node-canvas to provide accurate font-aware metrics
 * without a browser or DOM.
 */

const { createCanvas } = require('canvas');

const canvas = createCanvas(1, 1);
const ctx = canvas.getContext('2d');

// Cache: font -> text -> metrics
const cache = new Map();

/**
 * Measure a single text string.
 *
 * @param {string} text - The text to measure
 * @param {string} font - CSS font shorthand, e.g. "14px Helvetica", "bold 20px Arial"
 * @returns {{ width: number, ascent: number, descent: number, height: number }}
 */
function measure(text, font = '14px Helvetica') {
  let fontCache = cache.get(font);
  if (!fontCache) {
    fontCache = new Map();
    cache.set(font, fontCache);
  }

  const cached = fontCache.get(text);
  if (cached) return cached;

  ctx.font = font;
  const m = ctx.measureText(text);

  const result = {
    width: m.width,
    ascent: m.actualBoundingBoxAscent || 0,
    descent: m.actualBoundingBoxDescent || 0,
    height: (m.actualBoundingBoxAscent || 0) + (m.actualBoundingBoxDescent || 0),
  };

  fontCache.set(text, result);
  return result;
}

/**
 * Measure width only (convenience).
 *
 * @param {string} text
 * @param {string} font
 * @returns {number}
 */
function width(text, font = '14px Helvetica') {
  return measure(text, font).width;
}

/**
 * Batch measure multiple text/font pairs.
 *
 * @param {{ text: string, font?: string }[]} items
 * @returns {{ text: string, font: string, width: number, ascent: number, descent: number, height: number }[]}
 */
function measureBatch(items) {
  return items.map(({ text, font = '14px Helvetica' }) => ({
    text,
    font,
    ...measure(text, font),
  }));
}

/**
 * Calculate centered x position for text.
 *
 * @param {string} text
 * @param {string} font
 * @param {number} centerX - The x coordinate to center on
 * @returns {number} - The left x coordinate
 */
function centerX(text, font, cx) {
  return cx - width(text, font) / 2;
}

/**
 * Calculate centered y position for text.
 *
 * @param {string} font
 * @param {number} centerY - The y coordinate to center on
 * @returns {number} - The top y coordinate
 */
function centerY(font, cy) {
  const fontSize = parseFloat(font);
  const lineHeight = fontSize * 1.25;
  return cy - lineHeight / 2;
}

/**
 * Word-wrap text to fit within a max width.
 *
 * @param {string} text
 * @param {string} font
 * @param {number} maxWidth
 * @returns {{ lines: string[], lineWidths: number[], totalHeight: number }}
 */
function wrap(text, font, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  const lineWidths = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const testWidth = width(testLine, font);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      lineWidths.push(width(currentLine, font));
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
    lineWidths.push(width(currentLine, font));
  }

  const fontSize = parseFloat(font);
  const lineHeight = fontSize * 1.25;

  return {
    lines,
    lineWidths,
    totalHeight: lines.length * lineHeight,
  };
}

/**
 * Clear the measurement cache.
 */
function clearCache() {
  cache.clear();
}

module.exports = {
  measure,
  width,
  measureBatch,
  centerX,
  centerY,
  wrap,
  clearCache,
};
