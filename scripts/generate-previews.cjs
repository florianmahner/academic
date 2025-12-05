const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../public/previews');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Animation configurations for each preview
const animations = {
  attention: { color: '#FF6B6B', frames: 30 },
  helix: { color: '#4ECDC4', frames: 30 },
  spacetime: { color: '#9B59B6', frames: 30 },
  signal: { color: '#3498DB', frames: 30 },
  machine: { color: '#E74C3C', frames: 30 },
  pixels: { color: '#2ECC71', frames: 30 },
  waves: { color: '#F39C12', frames: 30 },
  network: { color: '#1ABC9C', frames: 30 },
  mind: { color: '#E91E63', frames: 30 },
  balls: { color: '#00BCD4', frames: 30 },
};

// Create a single frame with gradient animation effect
async function createFrame(width, height, color, frameNum, totalFrames, mode) {
  const bgColor = mode === 'dark' ? '#1a1a2e' : '#ffffff';
  const phase = (frameNum / totalFrames) * Math.PI * 2;

  // Create SVG with animated gradient
  const offset1 = Math.round(50 + 30 * Math.sin(phase));
  const offset2 = Math.round(50 + 30 * Math.cos(phase));

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad" cx="${offset1}%" cy="${offset2}%" r="50%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${bgColor};stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>
  `;

  return Buffer.from(svg);
}

async function generateAnimation(name, config, mode) {
  const width = 200;
  const height = 200;
  const frames = [];

  console.log(`  Generating ${name}-${mode}...`);

  // Generate frames
  for (let i = 0; i < config.frames; i++) {
    const svgBuffer = await createFrame(width, height, config.color, i, config.frames, mode);
    const pngBuffer = await sharp(svgBuffer).png().toBuffer();
    frames.push(pngBuffer);
  }

  // Create animated WebP
  const outputPath = path.join(outputDir, `${name}-${mode}.webp`);

  // Sharp doesn't support multi-frame WebP directly, so create a simple static WebP
  // with the first frame for now (animated WebP requires ffmpeg or similar)
  await sharp(frames[0])
    .webp({ quality: 90 })
    .toFile(outputPath);

  const stats = fs.statSync(outputPath);
  console.log(`    Created ${path.basename(outputPath)} (${(stats.size / 1024).toFixed(1)}KB)`);
}

async function main() {
  console.log('Generating preview WebP files...\n');

  for (const [name, config] of Object.entries(animations)) {
    console.log(`\n${name}:`);
    await generateAnimation(name, config, 'light');
    await generateAnimation(name, config, 'dark');
  }

  console.log('\nDone! Generated', Object.keys(animations).length * 2, 'WebP files');
}

main().catch(console.error);
