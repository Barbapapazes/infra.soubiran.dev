# Infrastructure Status Page

## Deployment

```sh
rclone copy public perso:infra-soubiran-dev --filter-from ./copy-assets.txt
```

## Media Metadata Generation

Generate metadata files (width, height, blurhash) for images and videos in the `public/websites` and `public/platforms` directories:

```sh
pnpm run generate:media-metadata
```

This script will:
- Scan the `public/websites` and `public/platforms` directories recursively for media files (png, jpg, jpeg, mp4)
- Generate a JSON file next to each media file containing:
  - `width`: Image/video width in pixels
  - `height`: Image/video height in pixels
  - `blurhash`: Blurhash string for placeholder rendering
- Process all files concurrently for better performance

Example: `public/websites/image.png` → `public/websites/image.png.json`
