const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const previewsDir = path.join(__dirname, '../public/previews');

async function convertGifToWebp(inputPath, outputPath) {
  try {
    await sharp(inputPath, { animated: true })
      .webp({ quality: 90, effort: 6 })
      .toFile(outputPath);

    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;
    const savings = ((inputSize - outputSize) / inputSize * 100).toFixed(1);

    console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% smaller)`);
    return { input: inputSize, output: outputSize };
  } catch (error) {
    console.error(`✗ Failed: ${inputPath}`, error.message);
    return null;
  }
}

async function main() {
  const files = fs.readdirSync(previewsDir).filter(f => f.endsWith('.gif'));
  console.log(`Found ${files.length} GIF files...\n`);

  let totalInput = 0, totalOutput = 0;
  let converted = 0, skipped = 0;

  for (const file of files) {
    const inputPath = path.join(previewsDir, file);
    const outputPath = path.join(previewsDir, file.replace('.gif', '.webp'));

    // Skip if WebP already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭ Skipping ${file} (WebP exists)`);
      skipped++;
      continue;
    }

    const result = await convertGifToWebp(inputPath, outputPath);
    if (result) {
      totalInput += result.input;
      totalOutput += result.output;
      converted++;
    }
  }

  console.log(`\n📊 Summary: ${converted} converted, ${skipped} skipped`);

  console.log(`\n✅ Total: ${(totalInput/1024/1024).toFixed(1)}MB → ${(totalOutput/1024/1024).toFixed(1)}MB`);
  console.log(`   Saved: ${((totalInput-totalOutput)/1024/1024).toFixed(1)}MB (${((totalInput-totalOutput)/totalInput*100).toFixed(1)}%)`);
}

main().catch(console.error);
