
import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'images/hero.png';
const outputPath = 'images/hero-optimized.webp';

async function optimize() {
    if (fs.existsSync(inputPath)) {
        const image = sharp(inputPath);
        const metadata = await image.metadata();
        console.log(`Original dimensions: ${metadata.width}x${metadata.height}`);

        // We want to focus on the "Decision" part. 
        // In this specific image, the "100 percent" text is near the bottom.
        // Let's crop from the bottom or use fit: contain to be safe.
        // Or better, let's use cover with position: bottom to ensure the decision is visible.

        await image
            .resize(800, 600, {
                fit: 'cover',
                position: 'bottom' // Focus on the Decision part at the bottom
            })
            .webp({ quality: 90 })
            .toFile(outputPath);

        console.log('Optimized focusing on the bottom (Decision area).');
    }
}

optimize();
