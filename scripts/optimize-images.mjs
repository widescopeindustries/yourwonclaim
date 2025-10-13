import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(process.cwd(), 'images', 'proof');
const outDir = root; // write next to originals
const sizes = [640, 960, 1440];

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p); else yield p;
  }
}

function isImage(file) {
  return /(jpe?g|png)$/i.test(path.extname(file));
}

async function optimize(file) {
  const input = await fs.readFile(file);
  const base = path.basename(file, path.extname(file));
  for (const width of sizes) {
    const webp = await sharp(input).resize({ width }).webp({ quality: 74 }).toBuffer();
    await fs.writeFile(path.join(outDir, `${base}-${width}.webp`), webp);
    const avif = await sharp(input).resize({ width }).avif({ quality: 45 }).toBuffer();
    await fs.writeFile(path.join(outDir, `${base}-${width}.avif`), avif);
  }
}

async function main() {
  let count = 0;
  for await (const file of walk(root)) {
    if (!isImage(file)) continue;
    await optimize(file);
    count++;
    process.stdout.write(`Optimized: ${path.basename(file)}\n`);
  }
  console.log(`Done. Optimized ${count} images.`);
}

main().catch((err) => { console.error(err); process.exit(1); });


