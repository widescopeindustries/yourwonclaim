
import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'images/hero.png';
const outputPath = 'images/hero-optimized.webp';

if (fs.existsSync(inputPath)) {
    console.log(`Processing new hero image ${inputPath}...`);
    sharp(inputPath)
        .resize(800, 600, {
            fit: 'cover',
            position: 'center' // Shift focus slightly to capture the decision boxes
        })
        .webp({ quality: 90 })
        .toFile(outputPath)
        .then(info => {
            console.log('New image optimized to 800x600 successfully:', info);
        })
        .catch(err => {
            console.error('Error optimizing image:', err);
        });
} else {
    console.error('Hero image not found.');
}
