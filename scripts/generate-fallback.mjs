#!/usr/bin/env node
/**
 * Generate unique geometric pattern GIFs for papers without previews
 * Each paper ID generates a completely different pattern
 *
 * Run: node scripts/generate-fallback.mjs <paper-id>
 */

import { createCanvas } from 'canvas';
import GIFEncoder from 'gif-encoder-2';
import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_DIR = join(__dirname, '..', 'public', 'previews');

const WIDTH = 600;
const HEIGHT = 340;

const BG_LIGHT = '#fffff8';
const BG_DARK = '#151515';

// Hash string to number
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Get color palette from hash
function getPalette(hash) {
  const palettes = [
    ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    ['#A8E6CF', '#FFD3B6', '#FFAAA5'],
    ['#667eea', '#764ba2', '#f093fb'],
    ['#fa709a', '#fee140', '#30cfd0'],
    ['#ff9a56', '#ff6a88', '#a8edea'],
    ['#56ab2f', '#a8e063', '#fed6e3'],
    ['#f6d365', '#fda085', '#fa709a'],
    ['#4facfe', '#00f2fe', '#43e97b'],
    ['#e0c3fc', '#8ec5fc', '#b490ca'],
    ['#fbc2eb', '#a6c1ee', '#ffecd2']
  ];
  return palettes[hash % palettes.length];
}

// Pattern generators - each creates a STATIC frame (single image GIF)

function createCirclesPattern(ctx, colors, hash) {
  const n = 2 + (hash % 2); // Very sparse - 2-3 circles only
  const seed = hash;

  for (let i = 0; i < n; i++) {
    const radius = 80 + (hash >> i) % 100;
    // Ensure circles stay within bounds with padding
    const padding = 40;
    const x = radius + padding + ((seed + i * 123) % (WIDTH - radius * 2 - padding * 2));
    const y = radius + padding + ((seed + i * 456) % (HEIGHT - radius * 2 - padding * 2));

    ctx.fillStyle = colors[i % colors.length] + 'B0';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createSquaresGrid(ctx, colors, hash) {
  const size = 120 + hash % 60; // Much larger squares
  const gap = 16;
  const cols = Math.floor(WIDTH / size);
  const rows = Math.floor(HEIGHT / size);

  // Center the grid
  const offsetX = (WIDTH - cols * size) / 2;
  const offsetY = (HEIGHT - rows * size) / 2;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if ((i + j + hash) % 2 === 0) { // Show more squares (every other)
        const x = offsetX + j * size;
        const y = offsetY + i * size;

        ctx.fillStyle = colors[(i + j) % colors.length];
        ctx.fillRect(x + gap/2, y + gap/2, size - gap, size - gap);
      }
    }
  }
}

function createDiagonalStripes(ctx, colors, hash) {
  const stripeWidth = 80 + hash % 80; // Much wider stripes
  const gap = 12;
  const angle = (hash % 4) * Math.PI / 4;

  ctx.save();
  ctx.translate(WIDTH / 2, HEIGHT / 2);
  ctx.rotate(angle);

  for (let i = -8; i < 15; i++) {
    ctx.fillStyle = colors[Math.abs(i) % colors.length];
    ctx.fillRect(i * stripeWidth - WIDTH, -HEIGHT, stripeWidth - gap, HEIGHT * 2);
  }

  ctx.restore();
}

function createConcentricCircles(ctx, colors, hash) {
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const maxRadius = Math.min(WIDTH, HEIGHT) / 2 - 30;
  const step = 70 + hash % 50; // Much larger steps - very sparse

  for (let r = maxRadius; r > 0; r -= step) {
    const idx = Math.floor(r / step) % colors.length;
    ctx.fillStyle = colors[idx];
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createDotGrid(ctx, colors, hash) {
  const spacing = 90 + hash % 50; // Much more spacing
  const dotSize = 18 + hash % 16; // Slightly larger dots

  const cols = Math.floor(WIDTH / spacing);
  const rows = Math.floor(HEIGHT / spacing);
  const offsetX = (WIDTH - (cols - 1) * spacing) / 2;
  const offsetY = (HEIGHT - (rows - 1) * spacing) / 2;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = offsetX + j * spacing;
      const y = offsetY + i * spacing;

      const colorIdx = (i + j + hash) % colors.length;
      ctx.fillStyle = colors[colorIdx];
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function createWavePattern(ctx, colors, hash) {
  const amplitude = 40 + hash % 40;
  const frequency = 0.01 + (hash % 10) * 0.005;
  const layers = 3;

  for (let layer = 0; layer < layers; layer++) {
    ctx.fillStyle = colors[layer % colors.length] + 'CC';
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT);

    for (let x = 0; x <= WIDTH; x++) {
      const y = HEIGHT / 2 + Math.sin(x * frequency + layer * Math.PI / 2) * amplitude;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(WIDTH, HEIGHT);
    ctx.closePath();
    ctx.fill();
  }
}

function createTrianglesMosaic(ctx, colors, hash) {
  const size = 140 + hash % 80; // Much larger triangles
  const gap = 14;

  const cols = Math.floor(WIDTH / size);
  const rows = Math.floor(HEIGHT / size);
  const offsetX = (WIDTH - cols * size) / 2;
  const offsetY = (HEIGHT - rows * size) / 2;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = offsetX + j * size;
      const y = offsetY + i * size;
      const colorIdx = (i + j + hash) % colors.length;
      ctx.fillStyle = colors[colorIdx];

      // Draw triangle within bounds with gap
      ctx.beginPath();
      ctx.moveTo(x + gap, y + gap);
      ctx.lineTo(x + size - gap, y + gap);
      ctx.lineTo(x + size / 2, y + size - gap);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function createRadialBurst(ctx, colors, hash) {
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const rays = 6 + hash % 4; // Fewer rays - 6-9 instead of 8-15
  const maxLength = Math.min(WIDTH, HEIGHT) / 2 - 40;

  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2;
    const length = maxLength - (hash >> i) % 60;

    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, length, angle - 0.25, angle + 0.25); // Wider rays
    ctx.closePath();
    ctx.fill();
  }
}

function createCheckerboard(ctx, colors, hash) {
  const size = 120 + hash % 80; // Even larger squares
  const gap = 8;

  const cols = Math.floor(WIDTH / size);
  const rows = Math.floor(HEIGHT / size);
  const offsetX = (WIDTH - cols * size) / 2;
  const offsetY = (HEIGHT - rows * size) / 2;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if ((i + j + hash) % 2 === 0) {
        const x = offsetX + j * size;
        const y = offsetY + i * size;
        const colorIdx = (i + j) % colors.length;

        ctx.fillStyle = colors[colorIdx];
        ctx.fillRect(x + gap, y + gap, size - gap * 2, size - gap * 2);
      }
    }
  }
}

function createHexagonPattern(ctx, colors, hash) {
  const size = 80 + hash % 60; // Much larger hexagons
  const h = size * Math.sqrt(3) / 2;
  const gap = 10;

  const cols = Math.floor(WIDTH / (size * 1.5));
  const rows = Math.floor(HEIGHT / h);
  const offsetX = (WIDTH - (cols * size * 1.5)) / 2 + size;
  const offsetY = (HEIGHT - (rows * h)) / 2 + size;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = offsetX + col * size * 1.5;
      const y = offsetY + row * h + (col % 2) * h / 2;

      const colorIdx = (row + col + hash) % colors.length;
      ctx.fillStyle = colors[colorIdx];

      // Draw hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + (size - gap) * Math.cos(angle);
        const hy = y + (size - gap) * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
}

// Pattern library
const PATTERNS = [
  createCirclesPattern,
  createSquaresGrid,
  createDiagonalStripes,
  createConcentricCircles,
  createDotGrid,
  createWavePattern,
  createTrianglesMosaic,
  createRadialBurst,
  createCheckerboard,
  createHexagonPattern
];

/**
 * Generate a fallback preview GIF for a paper
 */
export async function generateFallbackGIF(paperId, mode = 'light') {
  const hash = hashString(paperId);
  const colors = getPalette(hash);
  const pattern = PATTERNS[hash % PATTERNS.length];
  const bgColor = mode === 'dark' ? BG_DARK : BG_LIGHT;

  const filename = `${paperId}-${mode}.gif`;
  const encoder = new GIFEncoder(WIDTH, HEIGHT);
  encoder.createReadStream().pipe(createWriteStream(join(OUTPUT_DIR, filename)));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(0);
  encoder.setQuality(10);

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Draw pattern
  pattern(ctx, colors, hash);

  encoder.addFrame(ctx);
  encoder.finish();

  console.log(`✓ Generated fallback: ${filename} (pattern: ${pattern.name})`);
  return filename;
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const paperId = process.argv[2];
  if (!paperId) {
    console.error('Usage: node generate-fallback.mjs <paper-id>');
    process.exit(1);
  }

  console.log(`Generating fallback previews for: ${paperId}\n`);
  await generateFallbackGIF(paperId, 'light');
  await generateFallbackGIF(paperId, 'dark');
  console.log('\n✨ Done!');
}
