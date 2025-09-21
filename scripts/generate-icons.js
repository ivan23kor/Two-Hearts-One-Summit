import fs from 'fs';
import path from 'path';

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = 'public/icons';

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG template for the climbing game icon (mountain with hearts)
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#4a5568;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="heartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e53e3e;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background circle -->
  <circle cx="256" cy="256" r="240" fill="#1a1a1a" stroke="#4a5568" stroke-width="4"/>

  <!-- Mountain silhouette -->
  <path d="M 100 400 L 180 280 L 220 320 L 256 240 L 290 300 L 330 260 L 412 400 Z"
        fill="url(#mountainGradient)" opacity="0.9"/>

  <!-- Peak line -->
  <path d="M 180 280 L 220 320 L 256 240 L 290 300 L 330 260"
        stroke="#fff" stroke-width="3" fill="none" opacity="0.6"/>

  <!-- Left heart -->
  <path d="M 200 200 C 200 185, 215 185, 215 200 C 215 185, 230 185, 230 200 C 230 215, 215 240, 215 240 C 215 240, 200 215, 200 200 Z"
        fill="url(#heartGradient)"/>

  <!-- Right heart -->
  <path d="M 280 180 C 280 165, 295 165, 295 180 C 295 165, 310 165, 310 180 C 310 195, 295 220, 295 220 C 295 220, 280 195, 280 180 Z"
        fill="url(#heartGradient)"/>

  <!-- Connection line between hearts -->
  <line x1="215" y1="210" x2="295" y2="190" stroke="#ff6b6b" stroke-width="2" opacity="0.6"/>

  <!-- Two small climber figures -->
  <circle cx="200" cy="340" r="6" fill="#fff"/>
  <rect x="197" y="346" width="6" height="15" fill="#fff"/>
  <rect x="194" y="355" width="4" height="8" fill="#fff"/>
  <rect x="202" y="355" width="4" height="8" fill="#fff"/>

  <circle cx="280" cy="320" r="6" fill="#fff"/>
  <rect x="277" y="326" width="6" height="15" fill="#fff"/>
  <rect x="274" y="335" width="4" height="8" fill="#fff"/>
  <rect x="282" y="335" width="4" height="8" fill="#fff"/>
</svg>
`.trim();

// Generate PNG-like SVG files for each size
iconSizes.forEach(size => {
  const svgContent = createIconSVG(size);
  const filename = path.join(iconsDir, `icon-${size}x${size}.svg`);

  fs.writeFileSync(filename, svgContent);
  console.log(`Generated ${filename}`);
});

// Create a simple PNG placeholder script instruction
const pngInstructions = `
# PWA Icon Generation Instructions

The following SVG icons have been generated:
${iconSizes.map(size => `- icon-${size}x${size}.svg`).join('\n')}

To convert these to PNG format for better browser compatibility:

1. Use an online SVG to PNG converter or:
2. Use ImageMagick: convert icon-512x512.svg icon-512x512.png
3. Use Node.js with sharp: npm install sharp && node convert-icons.js

For production, consider using a dedicated icon generation tool like:
- PWA Asset Generator
- Real Favicon Generator
- App Icon Generator

The current SVG icons include:
- Mountain silhouette representing the climbing theme
- Two hearts symbolizing the cooperative nature
- Small climber figures for visual context
- Climbing game appropriate color scheme
`;

fs.writeFileSync(path.join(iconsDir, 'README.md'), pngInstructions);

console.log('Icon generation complete!');
console.log('Note: For production, convert SVG icons to PNG format for better browser support.');