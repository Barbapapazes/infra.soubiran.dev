## Assets

```sh
rclone copy public perso:infra-soubiran-dev --filter-from ./copy-assets.txt
```

## Media Metadata Generation

Generate metadata files (width, height, blurhash) for images and videos. The script is located at the root of the monorepo (`.scripts/generate-media-metadata.ts`) and scans all apps automatically.

**Requirements**: Node.js 24 or higher

From the root directory:

```sh
pnpm run generate:media-metadata
```

This script will:
- Automatically scan all `public` directories in the `apps` folder for media files (png, jpg, jpeg, mp4) using Node 24's glob API
- Generate a JSON file next to each media file containing:
  - `width`: Image/video width in pixels
  - `height`: Image/video height in pixels
  - `blurhash`: Blurhash string for placeholder rendering
- Process all files concurrently for better performance

Example: `public/websites/image.png` => `public/websites/image.png.json`
