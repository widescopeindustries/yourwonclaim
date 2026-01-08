
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath = 'images/hero.png';
const outputPath = 'images/hero-optimized.webp';

if (fs.existsSync(inputPath)) {
    console.log(`Processing ${inputPath}...`);
    sharp(inputPath)
        .resize(800) // Resize to 800px width as requested
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(info => {
            console.log('Image optimized successfully:', info);
        })
        .catch(err => {
            console.error('Error optimizing image:', err);
        });
} else {
    // try finding existing webp to resize if png missing
    const inputWebp = 'images/hero.webp';
    if (fs.existsSync(inputWebp)) {
        console.log(`Processing ${inputWebp} instead...`);
        sharp(inputWebp)
            .resize(800)
            .webp({ quality: 80 })
            .toFile(outputPath)
            .then(info => {
                console.log('Image optimized successfully:', info);
            })
            .catch(err => console.error(err));
    } else {
        console.error('Hero image not found.');
    }
}
