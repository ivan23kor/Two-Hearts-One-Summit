
# PWA Icon Generation Instructions

The following SVG icons have been generated:
- icon-72x72.svg
- icon-96x96.svg
- icon-128x128.svg
- icon-144x144.svg
- icon-152x152.svg
- icon-192x192.svg
- icon-384x384.svg
- icon-512x512.svg

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
