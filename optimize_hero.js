
import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'images/hero.png';
const outputPath = 'images/hero-optimized.webp';

if (fs.existsSync(inputPath)) {
    console.log(`Processing ${inputPath}...`);
    sharp(inputPath)
        .resize(800, 600, {
            fit: 'cover',
            position: 'top' // Keep the header of the award letter visible
        })
        .webp({ quality: 85 }) // Slightly higher quality, but still small
        .toFile(outputPath)
        .then(info => {
            console.log('Image optimized to 800x600 successfully:', info);
        })
        .catch(err => {
            console.error('Error optimizing image:', err);
        });
} else {
    console.error('Hero image not found.');
}
