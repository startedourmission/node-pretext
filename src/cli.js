#!/usr/bin/env node

/**
 * node-pretext CLI
 *
 * Usage:
 *   node-pretext "14px Helvetica" "Hello World"        → prints width
 *   node-pretext --json "14px Helvetica" "Hello World"  → prints full metrics as JSON
 *   echo '[{"font":"14px Helvetica","text":"Hi"}]' | node-pretext --batch
 */

const { measure, measureBatch } = require('./index');

const args = process.argv.slice(2);

if (args[0] === '--batch') {
  let input = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => input += chunk);
  process.stdin.on('end', () => {
    try {
      const items = JSON.parse(input);
      const results = measureBatch(items);
      console.log(JSON.stringify(results, null, 2));
    } catch (e) {
      console.error('Invalid JSON input:', e.message);
      process.exit(1);
    }
  });
} else if (args.length >= 2) {
  const json = args[0] === '--json';
  const font = json ? args[1] : args[0];
  const text = json ? args[2] : args[1];

  if (!text) {
    console.error('Usage: node-pretext [--json] "font" "text"');
    process.exit(1);
  }

  const result = measure(text, font);
  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(result.width);
  }
} else {
  console.log('node-pretext - Server-side text measurement\n');
  console.log('Usage:');
  console.log('  node-pretext "14px Helvetica" "Hello"         width only');
  console.log('  node-pretext --json "14px Helvetica" "Hello"  full metrics');
  console.log('  echo \'[...]\' | node-pretext --batch           batch mode');
}
