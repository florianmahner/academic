#!/usr/bin/env node
/**
 * Generate animated WebP previews using Canvas + ffmpeg
 * Same animations as GIF version but with much smaller file sizes
 *
 * Requires: ffmpeg (brew install ffmpeg)
 * Run: node scripts/generate-webp-previews.mjs
 */

import { createCanvas } from 'canvas';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, rmSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { tmpdir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- CONFIGURATION ---
const OUTPUT_DIR = join(__dirname, '..', 'public', 'previews');
const FFMPEG = process.env.FFMPEG_PATH || '/usr/local/bin/ffmpeg';
const WIDTH = 600;
const HEIGHT = 340;
const FPS = 20;
const DURATION = 7; // seconds
const FRAMES = FPS * DURATION;

// Background colors
const BG_LIGHT = '#fffff8';
const BG_DARK = '#151515';

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// --- SEEDED RANDOM (SFC32) ---
class SeededRandom {
  constructor(seedStr) {
    let h1 = 1779033703, h2 = 3144134277, h3 = 1013904223, h4 = 2746296044;
    for (let i = 0; i < seedStr.length; i++) {
      h1 ^= seedStr.charCodeAt(i); h2 ^= h1; h3 ^= h2; h4 ^= h3;
    }
    this._state = { h1, h2, h3, h4 };
  }

  rand() {
    let { h1, h2, h3, h4 } = this._state;
    h1 |= 0; h2 |= 0; h3 |= 0; h4 |= 0;
    let t = (h1 + h2 | 0) + h4 | 0;
    h4 = h4 + 1 | 0;
    h1 = h2 ^ h2 >>> 9;
    h2 = h3 + (h3 << 3) | 0;
    h3 = h3 << 21 | h3 >>> 11;
    h3 = h3 + t | 0;
    this._state = { h1, h2, h3, h4 };
    return (t >>> 0) / 4294967296;
  }

  range(min, max) { return this.rand() * (max - min) + min; }
  pick(arr) { return arr[Math.floor(this.rand() * arr.length)]; }
}

// --- COLOR PALETTES ---
const PALETTES = {
  attention: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
  helix: ['#667eea', '#764ba2', '#f093fb', '#5B86E5'],
  spacetime: ['#a8edea', '#fed6e3', '#ffecd2', '#fcb69f'],
  signal: ['#56CCF2', '#2F80ED', '#6C63FF', '#B721FF'],
  machine: ['#F2994A', '#F2C94C', '#EB5757', '#BB6BD9'],
  pixels: ['#00F5A0', '#00D9F5', '#6C63FF', '#F50057'],
  waves: ['#fa709a', '#fee140', '#30cfd0', '#5B86E5'],
  network: ['#4facfe', '#00f2fe', '#43e97b', '#38f9d7']
};

// --- ANIMATION GENERATORS ---

function generateBouncingBalls(ctx, frame, totalFrames, colors, bgColor, rng) {
  const t = frame / totalFrames;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const nBalls = 8;
  const balls = [];
  const tempRng = new SeededRandom('balls' + colors[0]);

  for (let i = 0; i < nBalls; i++) {
    const baseX = tempRng.range(60, WIDTH - 60);
    const baseY = tempRng.range(60, HEIGHT - 60);
    const radius = tempRng.range(15, 35);
    const speed = tempRng.range(1, 3);
    const phase = tempRng.range(0, Math.PI * 2);
    const x = baseX + Math.sin(t * Math.PI * 2 * speed + phase) * 50;
    const y = baseY + Math.cos(t * Math.PI * 2 * speed * 0.7 + phase) * 30;
    balls.push({ x, y, radius, color: colors[i % colors.length], phase });
  }

  ctx.strokeStyle = bgColor === BG_DARK ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const dx = balls[i].x - balls[j].x;
      const dy = balls[i].y - balls[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(balls[i].x, balls[i].y);
        ctx.lineTo(balls[j].x, balls[j].y);
        ctx.stroke();
      }
    }
  }

  balls.forEach(ball => {
    const pulse = 1 + Math.sin(t * Math.PI * 4 + ball.phase) * 0.15;
    const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius * pulse);
    gradient.addColorStop(0, ball.color);
    gradient.addColorStop(1, ball.color + '60');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius * pulse, 0, Math.PI * 2);
    ctx.fill();
  });
}

function generateSpinningArcs(ctx, frame, totalFrames, colors, bgColor, rng) {
  const t = frame / totalFrames;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const numArcs = 4;

  for (let i = 0; i < numArcs; i++) {
    const radius = 60 + i * 35;
    const startAngle = t * Math.PI * 2 * (i % 2 === 0 ? 1 : -1) + (i * Math.PI / 3);
    const arcLength = Math.PI * 0.6 + Math.sin(t * Math.PI * 2) * 0.3;
    ctx.strokeStyle = colors[i % colors.length];
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + arcLength);
    ctx.stroke();
  }
}

function generateWaveDots(ctx, frame, totalFrames, colors, bgColor, rng) {
  const t = frame / totalFrames;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const cols = 12;
  const rows = 7;
  const spacingX = WIDTH / (cols + 1);
  const spacingY = HEIGHT / (rows + 1);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const baseX = spacingX * (col + 1);
      const baseY = spacingY * (row + 1);
      const wave = Math.sin(t * Math.PI * 2 + col * 0.5 + row * 0.3) * 15;
      const scale = 1 + Math.sin(t * Math.PI * 2 + col * 0.3) * 0.3;
      const colorIdx = (row + col) % colors.length;
      ctx.fillStyle = colors[colorIdx] + 'CC';
      ctx.beginPath();
      ctx.arc(baseX, baseY + wave, 8 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function generatePulsingCircles(ctx, frame, totalFrames, colors, bgColor, rng) {
  const t = frame / totalFrames;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const maxRadius = Math.min(WIDTH, HEIGHT) / 2 - 20;
  const numRings = 5;

  for (let i = numRings - 1; i >= 0; i--) {
    const phase = t * Math.PI * 2 + i * 0.5;
    const pulse = Math.sin(phase) * 0.2 + 1;
    const radius = (maxRadius / numRings) * (i + 1) * pulse;
    ctx.fillStyle = colors[i % colors.length] + 'AA';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function generateWaveBars(ctx, frame, totalFrames, colors, bgColor, rng) {
  const t = frame / totalFrames;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const numBars = 20;
  const barWidth = WIDTH / numBars - 8;
  const maxHeight = HEIGHT * 0.7;

  for (let i = 0; i < numBars; i++) {
    const phase = t * Math.PI * 2 + i * 0.4;
    const height = (Math.sin(phase) * 0.5 + 0.5) * maxHeight + 20;
    const x = (WIDTH / numBars) * i + 4;
    const y = HEIGHT - height;
    const gradient = ctx.createLinearGradient(x, y, x, HEIGHT);
    gradient.addColorStop(0, colors[i % colors.length]);
    gradient.addColorStop(1, colors[(i + 1) % colors.length] + '60');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, height, 4);
    ctx.fill();
  }
}

function generateRotatingSquares(ctx, frame, totalFrames, colors, bgColor, rng) {
  const t = frame / totalFrames;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const numSquares = 5;

  for (let i = 0; i < numSquares; i++) {
    const size = 40 + i * 30;
    const rotation = t * Math.PI * 2 * (i % 2 === 0 ? 1 : -1) + i * 0.2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.fillStyle = colors[i % colors.length] + '99';
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.restore();
  }
}

function generateFloatingShapes(ctx, frame, totalFrames, colors, bgColor, rng) {
  const t = frame / totalFrames;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const tempRng = new SeededRandom('shapes' + colors[0]);
  const numShapes = 10;

  for (let i = 0; i < numShapes; i++) {
    const baseX = tempRng.range(50, WIDTH - 50);
    const baseY = tempRng.range(50, HEIGHT - 50);
    const size = tempRng.range(20, 60);
    const speed = tempRng.range(0.5, 2);
    const phase = tempRng.range(0, Math.PI * 2);
    const isCircle = tempRng.rand() > 0.5;
    const x = baseX + Math.sin(t * Math.PI * 2 * speed + phase) * 30;
    const y = baseY + Math.cos(t * Math.PI * 2 * speed * 0.7 + phase) * 20;
    ctx.fillStyle = colors[i % colors.length] + 'BB';

    if (isCircle) {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
  }
}

function generateNetworkGraph(ctx, frame, totalFrames, colors, bgColor, rng) {
  const t = frame / totalFrames;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const tempRng = new SeededRandom('network' + colors[0]);
  const numNodes = 12;
  const nodes = [];

  for (let i = 0; i < numNodes; i++) {
    const baseX = tempRng.range(60, WIDTH - 60);
    const baseY = tempRng.range(60, HEIGHT - 60);
    const phase = tempRng.range(0, Math.PI * 2);
    const speed = tempRng.range(0.3, 1);
    const x = baseX + Math.sin(t * Math.PI * 2 * speed + phase) * 20;
    const y = baseY + Math.cos(t * Math.PI * 2 * speed + phase) * 15;
    nodes.push({ x, y, color: colors[i % colors.length] });
  }

  ctx.strokeStyle = bgColor === BG_DARK ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  nodes.forEach((node, i) => {
    const pulse = 1 + Math.sin(t * Math.PI * 4 + i) * 0.2;
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 10 * pulse, 0, Math.PI * 2);
    ctx.fill();
  });
}

// --- ANIMATION MAPPINGS ---
const ANIMATIONS = {
  attention: { generator: generateBouncingBalls, colors: PALETTES.attention },
  helix: { generator: generateSpinningArcs, colors: PALETTES.helix },
  spacetime: { generator: generatePulsingCircles, colors: PALETTES.spacetime },
  signal: { generator: generateWaveBars, colors: PALETTES.signal },
  machine: { generator: generateRotatingSquares, colors: PALETTES.machine },
  pixels: { generator: generateWaveDots, colors: PALETTES.pixels },
  waves: { generator: generateFloatingShapes, colors: PALETTES.waves },
  network: { generator: generateNetworkGraph, colors: PALETTES.network }
};

// --- MAIN GENERATOR ---
async function generateAnimatedWebP(name, mode) {
  const { generator, colors } = ANIMATIONS[name];
  const bgColor = mode === 'dark' ? BG_DARK : BG_LIGHT;
  const filename = `${name}-${mode}.webp`;
  const rng = new SeededRandom(name + mode);

  // Create temp directory for frames
  const tempDir = join(tmpdir(), `webp-frames-${name}-${mode}-${Date.now()}`);
  mkdirSync(tempDir, { recursive: true });

  console.log(`  Generating ${filename}...`);

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Render frames to PNG files
  for (let f = 0; f < FRAMES; f++) {
    generator(ctx, f, FRAMES, colors, bgColor, rng);
    const frameFile = join(tempDir, `frame_${String(f).padStart(4, '0')}.png`);
    const buffer = canvas.toBuffer('image/png');
    writeFileSync(frameFile, buffer);
  }

  // Use ffmpeg to create animated WebP
  const outputPath = join(OUTPUT_DIR, filename);
  const ffmpegCmd = `"${FFMPEG}" -y -framerate ${FPS} -i "${tempDir}/frame_%04d.png" -c:v libwebp -lossless 0 -q:v 95 -loop 0 -an "${outputPath}" 2>/dev/null`;

  try {
    execSync(ffmpegCmd);
  } catch (err) {
    console.error(`    Error: ffmpeg failed for ${filename}`);
    rmSync(tempDir, { recursive: true, force: true });
    return;
  }

  // Cleanup temp directory
  rmSync(tempDir, { recursive: true, force: true });

  const stats = statSync(outputPath);
  console.log(`    ✓ ${filename} (${(stats.size / 1024).toFixed(1)} KB)`);
}

// --- RUNNER ---
async function main() {
  // Check ffmpeg is available
  try {
    execSync(`"${FFMPEG}" -version`, { stdio: 'ignore' });
  } catch {
    console.error(`❌ ffmpeg not found at ${FFMPEG}. Install with: brew install ffmpeg`);
    console.error('   Or set FFMPEG_PATH environment variable');
    process.exit(1);
  }

  console.log('🎨 Generating animated WebP previews...');
  console.log(`📂 Output: ${OUTPUT_DIR}`);
  console.log(`🎬 ${FRAMES} frames @ ${FPS}fps = ${DURATION}s animation\n`);

  const startTime = Date.now();

  for (const name of Object.keys(ANIMATIONS)) {
    console.log(`\n${name}:`);
    await generateAnimatedWebP(name, 'light');
    await generateAnimatedWebP(name, 'dark');
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✨ Done! Generated ${Object.keys(ANIMATIONS).length * 2} animated WebP files in ${elapsed}s`);
}

main().catch(console.error);
