const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = 'C:/Users/LEOFERSON/.gemini/antigravity/brain/26110c54-13c0-4247-88d6-1d304666e934/turpi_favicon_1791740710654.jpg';

async function processFavicon() {
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  console.log(`Processing ${width}x${height}...`);

  // Flood-fill from outer edges to mark true exterior background
  const isExteriorBg = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let qHead = 0;
  let qTail = 0;

  function isWhiteLike(idx) {
    const r = data[idx * 3];
    const g = data[idx * 3 + 1];
    const b = data[idx * 3 + 2];
    // Threshold for white background
    return r >= 242 && g >= 242 && b >= 242;
  }

  // Seed borders
  for (let x = 0; x < width; x++) {
    const topIdx = x;
    const btmIdx = (height - 1) * width + x;
    if (isWhiteLike(topIdx)) {
      isExteriorBg[topIdx] = 1;
      queue[qTail++] = topIdx;
    }
    if (isWhiteLike(btmIdx)) {
      isExteriorBg[btmIdx] = 1;
      queue[qTail++] = btmIdx;
    }
  }

  for (let y = 0; y < height; y++) {
    const leftIdx = y * width;
    const rightIdx = y * width + (width - 1);
    if (!isExteriorBg[leftIdx] && isWhiteLike(leftIdx)) {
      isExteriorBg[leftIdx] = 1;
      queue[qTail++] = leftIdx;
    }
    if (!isExteriorBg[rightIdx] && isWhiteLike(rightIdx)) {
      isExteriorBg[rightIdx] = 1;
      queue[qTail++] = rightIdx;
    }
  }

  // BFS flood fill
  while (qHead < qTail) {
    const p = queue[qHead++];
    const x = p % width;
    const y = Math.floor(p / width);

    // 4-neighborhood
    const neighbors = [
      x > 0 ? p - 1 : -1,
      x < width - 1 ? p + 1 : -1,
      y > 0 ? p - width : -1,
      y < height - 1 ? p + width : -1,
    ];

    for (const n of neighbors) {
      if (n >= 0 && !isExteriorBg[n] && isWhiteLike(n)) {
        isExteriorBg[n] = 1;
        queue[qTail++] = n;
      }
    }
  }

  console.log(`Exterior background pixels identified: ${qTail}`);

  // Construct RGBA buffer with smooth anti-aliased edge alpha
  const rgba = Buffer.alloc(width * height * 4);

  // Find bounding box of non-background content
  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const srcOffset = idx * 3;
      const dstOffset = idx * 4;

      let r = data[srcOffset];
      let g = data[srcOffset + 1];
      let b = data[srcOffset + 2];

      if (isExteriorBg[idx]) {
        // Completely transparent
        rgba[dstOffset] = 0;
        rgba[dstOffset + 1] = 0;
        rgba[dstOffset + 2] = 0;
        rgba[dstOffset + 3] = 0;
      } else {
        // Check if this pixel is near exterior background (for subpixel anti-aliasing)
        const isNearBg =
          (x > 0 && isExteriorBg[idx - 1]) ||
          (x < width - 1 && isExteriorBg[idx + 1]) ||
          (y > 0 && isExteriorBg[idx - width]) ||
          (y < height - 1 && isExteriorBg[idx + width]);

        let alpha = 255;
        if (isNearBg) {
          // If the pixel is very close to white near the boundary, feather the edge
          const minChannel = Math.min(r, g, b);
          if (minChannel > 220) {
            alpha = Math.round(Math.max(0, Math.min(255, (255 - minChannel) * (255 / 35))));
          }
        }

        rgba[dstOffset] = r;
        rgba[dstOffset + 1] = g;
        rgba[dstOffset + 2] = b;
        rgba[dstOffset + 3] = alpha;

        if (alpha > 30) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
  }

  console.log(`Content bounding box: x=${minX}..${maxX}, y=${minY}..${maxY}`);

  // Create square crop around the upper body / head
  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;
  const size = Math.max(contentWidth, contentHeight);
  const centerX = Math.round((minX + maxX) / 2);
  const centerY = Math.round(minY + size / 2); // Center slightly towards upper head

  // Extract square box
  const cropSize = Math.min(width, Math.round(size * 1.05));
  let cropX = Math.round(centerX - cropSize / 2);
  let cropY = Math.round(minY - 10);
  if (cropX < 0) cropX = 0;
  if (cropX + cropSize > width) cropX = width - cropSize;
  if (cropY < 0) cropY = 0;
  if (cropY + cropSize > height) cropY = height - cropSize;

  const croppedBuffer = await sharp(rgba, {
    raw: { width, height, channels: 4 },
  })
    .extract({ left: cropX, top: cropY, width: cropSize, height: cropSize })
    .png()
    .toBuffer();

  // Export various resolutions
  const output512 = await sharp(croppedBuffer).resize(512, 512).png().toBuffer();
  const output192 = await sharp(croppedBuffer).resize(192, 192).png().toBuffer();
  const output64 = await sharp(croppedBuffer).resize(64, 64).png().toBuffer();
  const output32 = await sharp(croppedBuffer).resize(32, 32).png().toBuffer();

  // 1. Write public/turpi.png (replaces JPEG fake PNG with TRUE transparent 512x512 PNG)
  fs.writeFileSync('public/turpi.png', output512);
  console.log('Saved public/turpi.png (512x512 transparent)');

  // 2. Write app/icon.png (Next.js App router standard app icon)
  fs.writeFileSync('app/icon.png', output512);
  console.log('Saved app/icon.png (512x512 transparent)');

  // 3. Write public/favicon.png and public/icon-192.png
  fs.writeFileSync('public/favicon.png', output64);
  fs.writeFileSync('public/icon-192.png', output192);
  fs.writeFileSync('public/icon-512.png', output512);
  console.log('Saved public/favicon.png, icon-192.png, icon-512.png');

  // 4. Create proper multi-size ICO file for app/favicon.ico and public/favicon.ico
  // An ICO header + 32x32 PNG entry is fully supported by all modern browsers
  const icoHeader = Buffer.from([
    0x00, 0x00,             // Reserved
    0x01, 0x00,             // Type 1 = ICO
    0x01, 0x00,             // 1 Image
    32, 32,                 // Width, Height (32x32)
    0, 0,                   // Colors (0 = no palette)
    0x01, 0x00,             // Color planes (1)
    0x20, 0x00,             // Bits per pixel (32-bit RGBA)
    // Size of image data in bytes (little-endian uint32):
    output32.length & 0xff,
    (output32.length >> 8) & 0xff,
    (output32.length >> 16) & 0xff,
    (output32.length >> 24) & 0xff,
    // Offset of image data from beginning of file (22 bytes header):
    0x16, 0x00, 0x00, 0x00
  ]);
  const icoFile = Buffer.concat([icoHeader, output32]);
  fs.writeFileSync('app/favicon.ico', icoFile);
  fs.writeFileSync('public/favicon.ico', icoFile);
  console.log('Saved app/favicon.ico and public/favicon.ico (32x32 transparent PNG in ICO format)');
}

processFavicon().catch(err => {
  console.error('Error processing favicon:', err);
  process.exit(1);
});
