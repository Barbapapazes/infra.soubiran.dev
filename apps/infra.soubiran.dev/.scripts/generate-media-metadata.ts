#!/usr/bin/env tsx

import { exec } from 'node:child_process'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, parse } from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'
import { getPixels } from '@unpic/pixels'
import { encode } from 'blurhash'

const execAsync = promisify(exec)

interface MediaMetadata {
  width: number
  height: number
  blurhash: string
}

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg']
const VIDEO_EXTENSIONS = ['.mp4']
const SUPPORTED_EXTENSIONS = [...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS]

async function getImageMetadata(filePath: string): Promise<MediaMetadata> {
  const buffer = await readFile(filePath)
  const data = await getPixels(buffer)
  const blurhash = encode(Uint8ClampedArray.from(data.data), data.width, data.height, 4, 4)

  return {
    width: data.width,
    height: data.height,
    blurhash,
  }
}

async function getVideoMetadata(filePath: string): Promise<MediaMetadata> {
  // Use ffprobe to get video dimensions
  const { stdout: probeOutput } = await execAsync(
    `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${filePath}"`,
  )

  const [width, height] = probeOutput.trim().split(',').map(Number)

  // Extract first frame as image to generate blurhash
  const tempImagePath = `/tmp/frame-${Date.now()}.png`
  await execAsync(
    `ffmpeg -i "${filePath}" -vframes 1 -f image2 "${tempImagePath}" -y`,
  )

  // Get blurhash from the extracted frame
  const frameBuffer = await readFile(tempImagePath)
  const data = await getPixels(frameBuffer)
  const blurhash = encode(Uint8ClampedArray.from(data.data), data.width, data.height, 4, 4)

  return {
    width,
    height,
    blurhash,
  }
}

async function processFile(filePath: string): Promise<void> {
  const { ext, dir, name } = parse(filePath)
  const lowerExt = ext.toLowerCase()

  if (!SUPPORTED_EXTENSIONS.includes(lowerExt)) {
    return
  }

  const metadataPath = join(dir, `${name}${ext}.json`)

  // eslint-disable-next-line no-console
  console.log(`Processing: ${filePath}`)

  try {
    let metadata: MediaMetadata

    if (IMAGE_EXTENSIONS.includes(lowerExt)) {
      metadata = await getImageMetadata(filePath)
    }
    else if (VIDEO_EXTENSIONS.includes(lowerExt)) {
      metadata = await getVideoMetadata(filePath)
    }
    else {
      return
    }

    await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`)
    // eslint-disable-next-line no-console
    console.log(`✓ Created metadata: ${metadataPath}`)
  }
  catch (error) {
    console.error(`✗ Failed to process ${filePath}:`, error)
  }
}

async function scanDirectory(dirPath: string): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name)

    if (entry.isDirectory()) {
      const subFiles = await scanDirectory(fullPath)
      files.push(...subFiles)
    }
    else if (entry.isFile()) {
      const ext = parse(entry.name).ext.toLowerCase()
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        files.push(fullPath)
      }
    }
  }

  return files
}

async function main() {
  const publicDir = join(process.cwd(), 'public')

  // eslint-disable-next-line no-console
  console.log(`Scanning ${publicDir} for media files...`)

  const mediaFiles = await scanDirectory(publicDir)

  // eslint-disable-next-line no-console
  console.log(`Found ${mediaFiles.length} media file(s)`)

  for (const file of mediaFiles) {
    await processFile(file)
  }

  // eslint-disable-next-line no-console
  console.log('\nDone!')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
