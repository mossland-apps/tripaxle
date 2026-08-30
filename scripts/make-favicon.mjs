import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PUB = resolve('public');
const svg = readFileSync(resolve(PUB, 'favicon.svg'));

// Apple touch icon: iOS applies its own rounded mask, so render full-bleed
// (square corners) at 180px with a little breathing room around the mark.
const appleSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#b9532f"/>
  <circle cx="32" cy="32" r="21" fill="#faf6f1"/>
  <circle cx="32" cy="32" r="13" fill="#b9532f"/>
  <g fill="#faf6f1">
    <rect x="29.8" y="14" width="4.4" height="12" rx="2.2"/>
    <rect x="29.8" y="14" width="4.4" height="12" rx="2.2" transform="rotate(72 32 32)"/>
    <rect x="29.8" y="14" width="4.4" height="12" rx="2.2" transform="rotate(144 32 32)"/>
    <rect x="29.8" y="14" width="4.4" height="12" rx="2.2" transform="rotate(216 32 32)"/>
    <rect x="29.8" y="14" width="4.4" height="12" rx="2.2" transform="rotate(288 32 32)"/>
    <circle cx="32" cy="32" r="6"/>
  </g>
</svg>`);

const png = (input, size) =>
  sharp(input, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

await sharp(appleSvg, { density: 384 })
  .resize(180, 180)
  .png({ compressionLevel: 9 })
  .toFile(resolve(PUB, 'apple-touch-icon.png'));

// Also a plain 512 PNG (handy for share cards / PWA-ish use).
await sharp(svg, { density: 512 })
  .resize(512, 512)
  .png({ compressionLevel: 9 })
  .toFile(resolve(PUB, 'icon-512.png'));

// favicon.ico — PNG-encoded entries at 16 / 32 / 48 (accepted by all modern
// browsers and Windows).
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => png(svg, s)));

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);

const entries = [];
let offset = 6 + 16 * sizes.length;
sizes.forEach((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s === 256 ? 0 : s, 0);
  e.writeUInt8(s === 256 ? 0 : s, 1);
  e.writeUInt8(0, 2); // palette
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // planes
  e.writeUInt16LE(32, 6); // bpp
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  entries.push(e);
});

writeFileSync(resolve(PUB, 'favicon.ico'), Buffer.concat([header, ...entries, ...pngs]));

console.log('favicon.ico    ', sizes.map((s, i) => `${s}px=${pngs[i].length}b`).join('  '));
console.log('apple-touch-icon.png  180x180');
console.log('icon-512.png          512x512');
