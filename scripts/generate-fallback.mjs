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
  const n = 5 + (hash % 4);
  const seed = hash;

  for (let i = 0; i < n; i++) {
    const x = ((seed + i * 123) % WIDTH);
    const y = ((seed + i * 456) % HEIGHT);
    const radius = 40 + (hash >> i) % 60;

    ctx.fillStyle = colors[i % colors.length] + '80';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createSquaresGrid(ctx, colors, hash) {
  const size = 60 + hash % 40;
  const cols = Math.floor(WIDTH / size) + 1;
  const rows = Math.floor(HEIGHT / size) + 1;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if ((i + j + hash) % 3 === 0) {
        ctx.fillStyle = colors[(i + j) % colors.length];
        ctx.fillRect(j * size, i * size, size - 4, size - 4);
      }
    }
  }
}

function createDiagonalStripes(ctx, colors, hash) {
  const stripeWidth = 40 + hash % 60;
  const angle = (hash % 4) * Math.PI / 4;

  ctx.save();
  ctx.translate(WIDTH / 2, HEIGHT / 2);
  ctx.rotate(angle);

  for (let i = -10; i < 20; i++) {
    ctx.fillStyle = colors[Math.abs(i) % colors.length];
    ctx.fillRect(i * stripeWidth - WIDTH, -HEIGHT, stripeWidth - 4, HEIGHT * 2);
  }

  ctx.restore();
}

function createConcentricCircles(ctx, colors, hash) {
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const maxRadius = Math.sqrt(WIDTH * WIDTH + HEIGHT * HEIGHT) / 2;
  const step = 30 + hash % 40;

  for (let r = maxRadius; r > 0; r -= step) {
    const idx = Math.floor(r / step) % colors.length;
    ctx.fillStyle = colors[idx];
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createDotGrid(ctx, colors, hash) {
  const spacing = 40 + hash % 30;
  const dotSize = 12 + hash % 12;

  for (let y = spacing / 2; y < HEIGHT; y += spacing) {
    for (let x = spacing / 2; x < WIDTH; x += spacing) {
      const colorIdx = Math.floor((x + y + hash) / spacing) % colors.length;
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
  const size = 80 + hash % 60;

  for (let y = 0; y < HEIGHT + size; y += size) {
    for (let x = 0; x < WIDTH + size; x += size) {
      const colorIdx = (Math.floor(x / size) + Math.floor(y / size) + hash) % colors.length;
      ctx.fillStyle = colors[colorIdx];

      // Draw triangle
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size / 2, y + size);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function createRadialBurst(ctx, colors, hash) {
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const rays = 8 + hash % 8;

  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2;
    const length = 150 + (hash >> i) % 100;

    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, length, angle - 0.2, angle + 0.2);
    ctx.closePath();
    ctx.fill();
  }
}

function createCheckerboard(ctx, colors, hash) {
  const size = 50 + hash % 50;

  for (let y = 0; y < HEIGHT; y += size) {
    for (let x = 0; x < WIDTH; x += size) {
      if (((x / size) + (y / size) + hash) % 2 === 0) {
        const colorIdx = (Math.floor(x / size) + Math.floor(y / size)) % colors.length;
        ctx.fillStyle = colors[colorIdx];
        ctx.fillRect(x, y, size, size);
      }
    }
  }
}

function createHexagonPattern(ctx, colors, hash) {
  const size = 50 + hash % 40;
  const h = size * Math.sqrt(3) / 2;

  for (let row = 0; row < HEIGHT / h + 2; row++) {
    for (let col = 0; col < WIDTH / size + 2; col++) {
      const x = col * size * 1.5;
      const y = row * h + (col % 2) * h / 2;

      const colorIdx = (row + col + hash) % colors.length;
      ctx.fillStyle = colors[colorIdx];

      // Draw hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);
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
