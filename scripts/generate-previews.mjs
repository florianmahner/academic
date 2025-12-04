#!/usr/bin/env node
/**
 * Generate fun animated GIFs using Canvas - loading.io style!
 * Creates bouncing balls, rotating shapes, spinning arcs, wave patterns
 *
 * Run: node scripts/generate-previews.mjs [seed]
 * Example: node scripts/generate-previews.mjs 42
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
const FPS = 20;
const DURATION = 7; // seconds - long duration for very smooth, fluid animations
const FRAMES = FPS * DURATION;

// Generate for both light and dark mode
const BG_LIGHT = '#fffff8';  // Warm off-white for light mode
const BG_DARK = '#151515';   // Dark background for dark mode

// Seeded random number generator
const SEED = parseInt(process.argv[2]) || 42;
let seed = SEED;
function seededRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

async function generateBouncingBalls(filename, colors, bgColor) {
  const encoder = new GIFEncoder(WIDTH, HEIGHT);
  encoder.createReadStream().pipe(createWriteStream(join(OUTPUT_DIR, filename)));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000 / FPS);
  encoder.setQuality(10);

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Initialize more balls with seeded random
  const nBalls = 8;
  const balls = [];
  for (let i = 0; i < nBalls; i++) {
    balls.push({
      x: seededRandom() * (WIDTH - 80) + 40,
      y: seededRandom() * (HEIGHT - 80) + 40,
      vx: (seededRandom() - 0.5) * 12,
      vy: (seededRandom() - 0.5) * 12,
      radius: 12 + seededRandom() * 18,
      color: colors[i % colors.length],
      phase: seededRandom() * Math.PI * 2
    });
  }

  for (let frame = 0; frame < FRAMES; frame++) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw connecting lines between nearby balls
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
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

    // Update and draw balls
    balls.forEach((ball, i) => {
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Bounce with damping
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > WIDTH) {
        ball.vx *= -0.98;
        ball.x = Math.max(ball.radius, Math.min(WIDTH - ball.radius, ball.x));
      }
      if (ball.y - ball.radius < 0 || ball.y + ball.radius > HEIGHT) {
        ball.vy *= -0.98;
        ball.y = Math.max(ball.radius, Math.min(HEIGHT - ball.radius, ball.y));
      }

      // Pulsing effect
      const t = frame / FRAMES;
      const pulse = 1 + Math.sin(t * Math.PI * 4 + ball.phase) * 0.2;

      // Draw ball with gradient
      const gradient = ctx.createRadialGradient(
        ball.x, ball.y, 0,
        ball.x, ball.y, ball.radius * pulse
      );
      gradient.addColorStop(0, ball.color);
      gradient.addColorStop(1, ball.color + '80'); // Add transparency

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius * pulse, 0, Math.PI * 2);
      ctx.fill();
    });

    encoder.addFrame(ctx);
  }

  encoder.finish();
  console.log(`✓ Generated ${filename}`);
}

async function generateSpinningArcs(filename, colors, bgColor) {
  const encoder = new GIFEncoder(WIDTH, HEIGHT);
  encoder.createReadStream().pipe(createWriteStream(join(OUTPUT_DIR, filename)));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000 / FPS);
  encoder.setQuality(10);

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  for (let frame = 0; frame < FRAMES; frame++) {
    const t = frame / FRAMES;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const centerX = WIDTH / 2;
    const centerY = HEIGHT / 2;

    // Draw multiple layers of spinning arcs with counter-rotation
    colors.forEach((color, i) => {
      const direction = i % 2 === 0 ? 1 : -1;
      const angle = t * Math.PI * 2 * direction * (1 + i * 0.2) + (i * Math.PI * 2 / colors.length);
      const radius = 120 - i * 16;

      // Main arc
      ctx.strokeStyle = color;
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, angle, angle + Math.PI * 1.6);
      ctx.stroke();

      // Trailing arc (glow)
      ctx.strokeStyle = color + '40';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, angle - 0.3, angle);
      ctx.stroke();

      // Leading dot
      const dotAngle = angle + Math.PI * 1.6;
      const dotX = centerX + radius * Math.cos(dotAngle);
      const dotY = centerY + radius * Math.sin(dotAngle);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Glow around dot
      ctx.fillStyle = color + '60';
      ctx.beginPath();
      ctx.arc(dotX, dotY, 12, 0, Math.PI * 2);
      ctx.fill();
    });

    encoder.addFrame(ctx);
  }

  encoder.finish();
  console.log(`✓ Generated ${filename}`);
}

async function generateWaveDots(filename, colors, bgColor) {
  const encoder = new GIFEncoder(WIDTH, HEIGHT);
  encoder.createReadStream().pipe(createWriteStream(join(OUTPUT_DIR, filename)));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000 / FPS);
  encoder.setQuality(10);

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  for (let frame = 0; frame < FRAMES; frame++) {
    const t = frame / FRAMES;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Moving dots in multiple wave layers
    const nDots = 15;
    for (let i = 0; i < nDots; i++) {
      const offset = (t + i / nDots) % 1;
      const x = offset * WIDTH;

      // Multiple wave layers
      const y1 = HEIGHT / 2 + Math.sin(offset * 6 * Math.PI) * 40;
      const y2 = HEIGHT / 2 + Math.cos(offset * 4 * Math.PI + Math.PI / 2) * 60;
      const y = (y1 + y2) / 2;

      // Size variation
      const size = 12 + Math.sin(offset * Math.PI * 8) * 6;

      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Add glow effect
      ctx.fillStyle = colors[i % colors.length] + '40';
      ctx.beginPath();
      ctx.arc(x, y, size + 4, 0, Math.PI * 2);
      ctx.fill();
    }

    encoder.addFrame(ctx);
  }

  encoder.finish();
  console.log(`✓ Generated ${filename}`);
}

async function generatePulsingCircles(filename, colors, bgColor) {
  const encoder = new GIFEncoder(WIDTH, HEIGHT);
  encoder.createReadStream().pipe(createWriteStream(join(OUTPUT_DIR, filename)));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000 / FPS);
  encoder.setQuality(10);

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  for (let frame = 0; frame < FRAMES; frame++) {
    const t = frame / FRAMES;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const centerX = WIDTH / 2;
    const centerY = HEIGHT / 2;

    // Multiple pulsing circle waves
    for (let i = 0; i < 6; i++) {
      const phase = (t + i / 6) % 1;
      const radius = phase * 180;
      const alpha = (1 - phase) * 0.8;

      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 8;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Add orbiting particles
    const nParticles = 12;
    for (let i = 0; i < nParticles; i++) {
      const angle = (t * Math.PI * 2) + (i * Math.PI * 2 / nParticles);
      const orbitRadius = 100 + Math.sin(t * Math.PI * 4 + i) * 30;
      const x = centerX + Math.cos(angle) * orbitRadius;
      const y = centerY + Math.sin(angle) * orbitRadius;

      ctx.globalAlpha = 1;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    encoder.addFrame(ctx);
  }

  encoder.finish();
  console.log(`✓ Generated ${filename}`);
}

async function generateWaveBars(filename, colors, bgColor) {
  const encoder = new GIFEncoder(WIDTH, HEIGHT);
  encoder.createReadStream().pipe(createWriteStream(join(OUTPUT_DIR, filename)));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000 / FPS);
  encoder.setQuality(10);

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  for (let frame = 0; frame < FRAMES; frame++) {
    const t = frame / FRAMES;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Animated equalizer bars
    const nBars = 16;
    const barWidth = 20;
    const spacing = WIDTH / (nBars + 1);

    for (let i = 0; i < nBars; i++) {
      const phase = (t + i / nBars) % 1;

      // Multiple frequency components for complex wave
      const wave1 = Math.sin(phase * Math.PI * 2);
      const wave2 = Math.sin(phase * Math.PI * 4 + Math.PI / 3);
      const combined = (wave1 + wave2) / 2;

      const barHeight = HEIGHT * 0.5 * (0.3 + Math.abs(combined) * 0.7);

      const x = (i + 1) * spacing;
      const y = (HEIGHT - barHeight) / 2;

      // Rounded rectangle
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.roundRect(x - barWidth / 2, y, barWidth, barHeight, 4);
      ctx.fill();

      // Top cap glow
      ctx.fillStyle = colors[i % colors.length] + '60';
      ctx.beginPath();
      ctx.arc(x, y, barWidth / 2, Math.PI, 0);
      ctx.fill();
    }

    encoder.addFrame(ctx);
  }

  encoder.finish();
  console.log(`✓ Generated ${filename}`);
}

async function generateRotatingSquares(filename, colors, bgColor) {
  const encoder = new GIFEncoder(WIDTH, HEIGHT);
  encoder.createReadStream().pipe(createWriteStream(join(OUTPUT_DIR, filename)));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000 / FPS);
  encoder.setQuality(10);

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  for (let frame = 0; frame < FRAMES; frame++) {
    const t = frame / FRAMES;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const centerX = WIDTH / 2;
    const centerY = HEIGHT / 2;

    // Nested rotating squares with different speeds AND moving particles
    colors.forEach((color, i) => {
      const size = 90 - i * 14;
      const speed = i % 2 === 0 ? 1 + i * 0.2 : -(1 + i * 0.2); // Alternate directions
      const angle = t * Math.PI * 2 * speed + (i * Math.PI / 6);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      // Draw square with gradient
      const gradient = ctx.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + 'AA');

      ctx.fillStyle = gradient;
      ctx.fillRect(-size / 2, -size / 2, size, size);

      // Add corner dots
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([dx, dy]) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(dx * size / 2, dy * size / 2, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    });

    // Add orbiting trail particles
    const nTrail = 8;
    for (let i = 0; i < nTrail; i++) {
      const trailAngle = (t - i * 0.05) * Math.PI * 4;
      const radius = 140;
      const x = centerX + Math.cos(trailAngle) * radius;
      const y = centerY + Math.sin(trailAngle) * radius;

      ctx.globalAlpha = 1 - i / nTrail;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    encoder.addFrame(ctx);
  }

  encoder.finish();
  console.log(`✓ Generated ${filename}`);
}

/**
 * Generate a fallback GIF for a paper based on its ID
 * Creates unique animation deterministically from paper ID
 */
export async function generateFallbackPreview(paperId, mode = 'light') {
  // Hash paper ID to get consistent random values
  let hash = 0;
  for (let i = 0; i < paperId.length; i++) {
    hash = ((hash << 5) - hash) + paperId.charCodeAt(i);
    hash = hash & hash;
  }

  // Select animation type based on hash
  const animTypes = [
    generateBouncingBalls,
    generatePulsingCircles,
    generateSpinningArcs,
    generateWaveDots,
    generateRotatingSquares,
    generateWaveBars
  ];
  const animType = animTypes[Math.abs(hash) % animTypes.length];

  // Select color palette based on hash
  const palettes = [
    ['#667eea', '#764ba2', '#f093fb'],
    ['#ff6b6b', '#fda085', '#f6d365'],
    ['#a8edea', '#fed6e3', '#8ec5fc'],
    ['#fa709a', '#fee140', '#fbc2eb'],
    ['#30cfd0', '#330867', '#a8edea'],
    ['#56ab2f', '#a8e063', '#4facfe'],
    ['#ff9a56', '#ff6a88', '#fbc2eb'],
    ['#4facfe', '#00f2fe', '#43e97b']
  ];
  const palette = palettes[Math.abs(hash >> 4) % palettes.length];

  // Generate with unique seed
  seed = Math.abs(hash);
  const bgColor = mode === 'dark' ? BG_DARK : BG_LIGHT;
  const filename = `${paperId}-${mode}.gif`;

  await animType(filename, palette, bgColor);
  return filename;
}

async function main() {
  const animations = [
    // 7 unique animations (PageRank removed for placeholder demo)
    ['transformers', ['#667eea', '#764ba2', '#f093fb'], generateBouncingBalls],
    ['dna', ['#ff6b6b', '#fda085', '#f6d365'], generatePulsingCircles],
    ['relativity', ['#a8edea', '#fed6e3', '#8ec5fc'], generateSpinningArcs],
    ['shannon', ['#fa709a', '#fee140', '#fbc2eb'], generateWaveDots],
    ['turing', ['#30cfd0', '#330867', '#a8edea'], generateRotatingSquares],
    ['vision', ['#56ab2f', '#a8e063', '#4facfe'], generateWaveBars],
    ['prospect', ['#4facfe', '#00f2fe', '#43e97b'], generatePulsingCircles],
  ];

  const totalGifs = animations.length * 2; // Light + Dark for each
  console.log(`🎨 Generating ${totalGifs} preview GIFs (light + dark versions)...`);
  console.log(`📍 Seed: ${SEED} (use same seed to regenerate identical animations)`);
  console.log(`📂 Output: ${OUTPUT_DIR}\n`);

  for (const [baseName, colors, generator] of animations) {
    // Reset seed for each animation to get consistent results
    seed = SEED + baseName.charCodeAt(0);

    // Generate light version
    await generator(`${baseName}-light.gif`, colors, BG_LIGHT);

    // Reset seed again for identical animation
    seed = SEED + baseName.charCodeAt(0);

    // Generate dark version
    await generator(`${baseName}-dark.gif`, colors, BG_DARK);
  }

  // Generate fallback for PageRank as demo
  console.log('\n📦 Generating fallback preview for page1999pagerank...');
  await generateFallbackPreview('page1999pagerank', 'light');
  await generateFallbackPreview('page1999pagerank', 'dark');

  console.log(`\n✨ Done! All GIFs ready (${animations.length} manual + 1 auto-generated)`);
  console.log(`\nTo regenerate: node scripts/generate-previews.mjs ${SEED}`);
}

main().catch(console.error);
