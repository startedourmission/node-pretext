# node-pretext

Server-side text measurement for Node.js. Accurate font-aware width/height calculation without a browser.

The missing piece for programmatic layout generation — SVG, PDF, Canvas, Excalidraw, card images, OG images, slides, and anything else where you need to know how wide text is before placing it.

## Why

Browsers have `measureText()`. Servers don't. If you're generating layouts programmatically (diagrams, images, PDFs), you need to know text dimensions to align elements. Without accurate measurement, text overflows boxes, labels misalign, and centering is guesswork.

`node-pretext` uses [node-canvas](https://github.com/Automattic/node-canvas) to access the OS font engine directly, giving you the same `measureText()` accuracy in Node.js.

Inspired by [@chenglou/pretext](https://github.com/chenglou/pretext), which solves the same problem in the browser by avoiding DOM reflow.

## Install

```bash
npm install node-pretext
```

## Usage

```js
const { measure, width, centerX, wrap } = require('node-pretext');

// Basic width
width('Hello World', '14px Helvetica');  // 77.8

// Full metrics
measure('Hello', '20px Arial');
// { width: 47.1, ascent: 15, descent: 4, height: 19 }

// Center text at x=200
centerX('Title', '28px Helvetica', 200);  // returns left x

// Word wrap to fit 300px
wrap('Long text here...', '14px Helvetica', 300);
// { lines: [...], lineWidths: [...], totalHeight: 35 }
```

## CLI

```bash
# Width only
npx node-pretext "14px Helvetica" "Hello World"

# Full metrics
npx node-pretext --json "20px Arial" "Hello"

# Batch (stdin)
echo '[{"font":"14px Helvetica","text":"Hello"}]' | npx node-pretext --batch
```

## API

### `measure(text, font?) → { width, ascent, descent, height }`

Full text metrics. Font defaults to `"14px Helvetica"`.

### `width(text, font?) → number`

Width only. Convenience shorthand.

### `measureBatch(items) → metrics[]`

Measure multiple text/font pairs in one call. Input: `[{ text, font? }]`.

### `centerX(text, font, cx) → number`

Returns the left x coordinate to center text at `cx`.

### `centerY(font, cy) → number`

Returns the top y coordinate to center text at `cy`.

### `wrap(text, font, maxWidth) → { lines, lineWidths, totalHeight }`

Word-wrap text to fit within `maxWidth` pixels.

### `clearCache()`

Clear the internal measurement cache.

## Use Cases

- **Diagram generation** — Excalidraw, Mermaid, D3
- **OG/social images** — Blog thumbnails, Twitter cards
- **Card news** — Automated image content
- **PDF reports** — Table cell sizing, label placement
- **SVG generation** — Server-rendered charts and badges
- **Slide decks** — Programmatic presentation generation

## License

MIT
