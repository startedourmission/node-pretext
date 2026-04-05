const { measure, width, centerX, wrap, measureBatch, measureMultiline } = require('../src/index');

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.log(`  FAIL: ${name}`);
  }
}

// Basic measurement
const m = measure('Hello', '14px Helvetica');
assert('width > 0', m.width > 0);
assert('width < 100', m.width < 100);
assert('has ascent', m.ascent >= 0);
assert('has descent', m.descent >= 0);
assert('height > 0', m.height > 0);

// Width convenience
const w = width('Hello', '14px Helvetica');
assert('width() matches measure().width', w === m.width);

// Longer text = wider
const w1 = width('Hi', '14px Helvetica');
const w2 = width('Hello World', '14px Helvetica');
assert('longer text is wider', w2 > w1);

// Bigger font = wider
const w3 = width('Hello', '14px Helvetica');
const w4 = width('Hello', '28px Helvetica');
assert('bigger font is wider', w4 > w3);

// centerX
const cx = centerX('Hello', '14px Helvetica', 200);
assert('centerX returns left edge', Math.abs(cx + w3/2 - 200) < 0.01);

// Batch
const batch = measureBatch([
  { text: 'A', font: '14px Helvetica' },
  { text: 'BB', font: '14px Helvetica' },
]);
assert('batch returns 2 results', batch.length === 2);
assert('batch[1] wider than batch[0]', batch[1].width > batch[0].width);

// Wrap
const wrapped = wrap('The quick brown fox jumps over the lazy dog', '14px Helvetica', 100);
assert('wrap produces multiple lines', wrapped.lines.length > 1);
assert('each line fits', wrapped.lineWidths.every(w => w <= 105)); // small tolerance
assert('totalHeight > 0', wrapped.totalHeight > 0);

// Multiline measurement
const ml = measureMultiline('Hello\nWorld', '14px Helvetica');
assert('multiline lineCount = 2', ml.lineCount === 2);
assert('multiline maxWidth > 0', ml.maxWidth > 0);
assert('multiline totalHeight > single line', ml.totalHeight > measure('Hello', '14px Helvetica').height);
assert('multiline lines array length = 2', ml.lines.length === 2);
assert('multiline line[0] has width', ml.lines[0].width > 0);

const ml3 = measureMultiline('A\nBB\nCCC', '14px Helvetica');
assert('3-line lineCount = 3', ml3.lineCount === 3);
assert('3-line totalHeight > 2-line', ml3.totalHeight > ml.totalHeight);
assert('3-line maxWidth = widest line', ml3.maxWidth === ml3.lines[2].width);

// Cache hit (same call should be faster, but we just verify it works)
const w5 = width('Hello', '14px Helvetica');
assert('cached result same', w5 === w3);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
