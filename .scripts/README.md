# Scripts

This directory contains shared scripts that can be used across all apps in the monorepo.

## generate-media-metadata.ts

Generates metadata files (width, height, blurhash) for images and videos.

### Usage

From the root directory:

```bash
pnpm run generate:media-metadata
```

Or with custom public directory:

```bash
pnpm run generate:media-metadata [publicDir]
```

From any app directory:

```bash
pnpm run generate:media-metadata
```

### Parameters

- `publicDir` (optional): Path to the public directory to scan. Defaults to `./public` relative to the current working directory.

### Examples

```bash
# Use defaults (scans entire ./public directory)
pnpm run generate:media-metadata

# Custom public directory
pnpm run generate:media-metadata apps/myapp/public

# From a specific app directory (will use that app's public directory)
cd apps/infra.soubiran.dev
pnpm run generate:media-metadata
```

### What it does

1. Scans the entire public directory recursively for supported media files using Node 24's glob API:
   - Images: `.png`, `.jpg`, `.jpeg`
   - Videos: `.mp4`
   - Images: `.png`, `.jpg`, `.jpeg`
   - Videos: `.mp4`

2. For each media file found, generates a JSON metadata file with:
   - `width`: Media width in pixels
   - `height`: Media height in pixels
   - `blurhash`: Blurhash string for efficient placeholder rendering

3. Saves the metadata as `<filename>.<ext>.json` next to the original file

Example: `public/websites/image.png` → `public/websites/image.png.json`

### Requirements

- **Node.js 24 or higher** (required for native TypeScript support and glob API)
- `ffmpeg` and `ffprobe` must be installed for video processing
- Dependencies: `@unpic/pixels`, `blurhash` (installed at root level)
