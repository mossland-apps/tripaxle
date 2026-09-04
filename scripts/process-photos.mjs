import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const SRC = resolve('photos-from-you');
const OUT = resolve('src/assets/images');
mkdirSync(OUT, { recursive: true });

// [sourceFile, outName, targetWidth]
const jobs = [
  ['pexels-mo-eid-18460078.jpg', 'porto-skyline.jpg', 1800, 78],
  ['luis-alvoeiro-quaresma-A_7XpKl37Xc-unsplash.jpg', 'portugal-cork-road.jpg', 1800, 76],
  ['alberto-frias-r48cmjbEwZI-unsplash.jpg', 'sintra-park.jpg', 1800, 74],
  ['pexels-carlos-machado-1013427.jpg', 'alentejo-village.jpg', 1800, 76],
  ['pexels-lisa-fotios-1534560.jpg', 'lisbon-trams.jpg', 1800, 74],
  ['pexels-skitterphoto-9253.jpg', 'lisbon-alfama.jpg', 1800, 78],
  ['pexels-andrew-mcleod-2894470.jpg', 'douro-valley.jpg', 1800, 72],
  ['pexels-mylo-kaye-10785618.jpg', 'pena-palace.jpg', 1800, 76],
  ['pexels-egor-kunovsky-16897047.jpg', 'coimbra.jpg', 1800, 74],
  ['luis-cardoso-Hoe8G65XhZA-unsplash.jpg', 'autumn-forest.jpg', 1800, 70],
  ['natanael-vieira-PBD2vtYo7o0-unsplash.jpg', 'geres-bridge.jpg', 1800, 70],
  ['pexels-petra-nesti-17330179.jpg', 'porto-ribeira.jpg', 1100, 76],
  ['Portugal Map2.png', 'portugal-spain-map.jpg', 1100, 80],
  ['pexels-myersmc16-13540098.jpg', 'algarve-coast.jpg', 1800, 74],
  ['pexels-mo-eid-1268975-17910087.jpg', 'algarve-cliffs-aerial.jpg', 1800, 72],
  ['pexels-raybilcliff-30970429.jpg', 'algarve-beach-dusk.jpg', 1800, 74],
];

for (const [srcName, outName, width, quality] of jobs) {
  const info = await sharp(resolve(SRC, srcName))
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toFile(resolve(OUT, outName));
  console.log(
    `${outName.padEnd(24)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`,
  );
}
