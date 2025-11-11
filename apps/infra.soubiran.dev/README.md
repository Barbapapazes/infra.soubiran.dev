# Infrastructure Status Page

## Deployment

```sh
rclone copy public perso:infra-soubiran-dev --filter-from ./copy-assets.txt
```

## Media Metadata Generation

Generate metadata files (width, height, blurhash) for all images and videos in the public folder:

```sh
pnpm run generate:media-metadata
```

This script will:
- Scan the `public` directory recursively for media files (png, jpg, jpeg, mp4)
- Generate a JSON file next to each media file containing:
  - `width`: Image/video width in pixels
  - `height`: Image/video height in pixels
  - `blurhash`: Blurhash string for placeholder rendering

Example: `public/image.png` → `public/image.png.json`
