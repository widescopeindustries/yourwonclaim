import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const outDir = path.resolve(process.cwd(), 'og');
await fs.mkdir(outDir, { recursive: true });

function escapeXml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function createOG({ filename, bgColor = '#0B1F38', title, subtitle }) {
  const width = 1200; const height = 630;
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0B1F38"/>
        <stop offset="100%" stop-color="#1C232D"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <g fill="#FFC857" font-family="Poppins, Arial, sans-serif">
      <text x="64" y="220" font-size="72" font-weight="700">${escapeXml(title)}</text>
    </g>
    <g fill="#F6F8FC" font-family="Inter, Arial, sans-serif">
      <text x="64" y="320" font-size="36">${escapeXml(subtitle)}</text>
    </g>
    <g fill="#F6F8FC" font-family="Poppins, Arial, sans-serif">
      <text x="64" y="560" font-size="28" font-weight="700">YourWonClaim.com</text>
    </g>
  </svg>`;

  const buffer = Buffer.from(svg);
  const png = await sharp(buffer).png().toBuffer();
  await fs.writeFile(path.join(outDir, filename), png);
}

await createOG({ filename: 'home-1200x630.png', title: 'The Combat PTSD First Strategy', subtitle: 'Stop Getting Denied. Clarity. Strategy. Victory.' });
await createOG({ filename: 'guide-1200x630.png', title: 'Strategy Guide — $197', subtitle: 'Framework, templates, and C&P prep.' });

console.log('OG images generated in /og');


