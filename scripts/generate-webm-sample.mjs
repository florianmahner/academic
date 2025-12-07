#!/usr/bin/env node
/**
 * Generate a single WebM video sample for quality comparison
 * Uses VP9 codec for better quality than WebP animation
 */

import { createCanvas } from 'canvas';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, rmSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { tmpdir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_DIR = join(__dirname, '..', 'public', 'previews');
const FFMPEG = process.env.FFMPEG_PATH || '/usr/local/bin/ffmpeg';
const WIDTH = 600;
const HEIGHT = 340;
const FPS = 30; // Higher FPS for smoother video
const DURATION = 7;
const FRAMES = FPS * DURATION;

const BG_LIGHT = '#fffff8';

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
}

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

function generateBouncingBalls(ctx, frame, totalFrames, bgColor) {
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

  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
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

async function main() {
  // Check ffmpeg
  try {
    execSync(`"${FFMPEG}" -version`, { stdio: 'ignore' });
  } catch {
    console.error(`❌ ffmpeg not found at ${FFMPEG}`);
    process.exit(1);
  }

  console.log('🎬 Generating WebM video sample...');
  console.log(`📐 ${WIDTH}x${HEIGHT} @ ${FPS}fps = ${DURATION}s\n`);

  const tempDir = join(tmpdir(), `webm-frames-${Date.now()}`);
  mkdirSync(tempDir, { recursive: true });

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  console.log('  Rendering frames...');
  for (let f = 0; f < FRAMES; f++) {
    generateBouncingBalls(ctx, f, FRAMES, BG_LIGHT);
    const frameFile = join(tempDir, `frame_${String(f).padStart(4, '0')}.png`);
    writeFileSync(frameFile, canvas.toBuffer('image/png'));

    if (f % 30 === 0) {
      process.stdout.write(`    ${Math.round(f / FRAMES * 100)}%\r`);
    }
  }
  console.log('    100% - Frames done');

  // Generate WebM with VP9 codec (high quality)
  const outputPath = join(OUTPUT_DIR, 'attention-light.webm');
  console.log('  Encoding WebM with VP9...');

  // VP9 encoding with good quality settings
  // CRF 30 is a good balance (lower = better quality, higher file size)
  const ffmpegCmd = `"${FFMPEG}" -y -framerate ${FPS} -i "${tempDir}/frame_%04d.png" -c:v libvpx-vp9 -crf 30 -b:v 0 -pix_fmt yuva420p -auto-alt-ref 0 -loop 0 -an "${outputPath}" 2>&1`;

  try {
    execSync(ffmpegCmd, { stdio: 'pipe' });
  } catch (err) {
    console.error('    Error encoding WebM:', err.message);
    rmSync(tempDir, { recursive: true, force: true });
    process.exit(1);
  }

  rmSync(tempDir, { recursive: true, force: true });

  const stats = statSync(outputPath);
  console.log(`\n✨ Generated: attention-light.webm (${(stats.size / 1024).toFixed(1)} KB)`);
  console.log(`   Compare with: attention-light.gif`);

  // Also show GIF size for comparison
  const gifPath = join(OUTPUT_DIR, 'attention-light.gif');
  if (existsSync(gifPath)) {
    const gifStats = statSync(gifPath);
    console.log(`   GIF size: ${(gifStats.size / 1024).toFixed(1)} KB`);
  }
}

main().catch(console.error);
