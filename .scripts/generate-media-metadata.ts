import type { Buffer } from 'node:buffer'
import { exec } from 'node:child_process'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, parse, resolve } from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'
import { getPixels } from '@unpic/pixels'
import { encode } from 'blurhash'

const execAsync = promisify(exec)

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg']
const VIDEO_EXTENSIONS = ['.mp4']
const SUPPORTED_EXTENSIONS = [...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS]

/**
 * Generates blurhash for an image buffer
 */
async function generateBlurhash(imageBuffer: Buffer) {
  const data = await getPixels(imageBuffer)
  const blurhash = encode(Uint8ClampedArray.from(data.data), data.width, data.height, 4, 4)

  return {
    width: data.width,
    height: data.height,
    blurhash,
  }
}

async function getVideoMetadata(filePath: string) {
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

  // Get blurhash from the extracted frame using shared logic
  const frameBuffer = await readFile(tempImagePath)
  const result = await generateBlurhash(frameBuffer)

  return {
    width,
    height,
    blurhash: result.blurhash,
  }
}

async function processFile(filePath: string) {
  const { ext, dir, name } = parse(filePath)
  const lowerExt = ext.toLowerCase()

  if (!SUPPORTED_EXTENSIONS.includes(lowerExt)) {
    return
  }

  const metadataPath = join(dir, `${name}${ext}.json`)

  // eslint-disable-next-line no-console
  console.log(`Processing: ${filePath}`)

  try {
    let metadata

    if (IMAGE_EXTENSIONS.includes(lowerExt)) {
      const buffer = await readFile(filePath)
      metadata = await generateBlurhash(buffer)
    }
    else if (VIDEO_EXTENSIONS.includes(lowerExt)) {
      metadata = await getVideoMetadata(filePath)
    }
    else {
      return
    }

    await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`)
    // eslint-disable-next-line no-console
    console.log(`Created metadata: ${metadataPath}`)
  }
  catch (error) {
    console.error(`Failed to process ${filePath}:`, error)
  }
}

async function scanDirectory(dirPath: string) {
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
  // Parse command line arguments
  // Usage: node generate-media-metadata.ts [publicDir] [targetDir1,targetDir2,...]
  const args = process.argv.slice(2)

  // Default to 'public' directory in current working directory
  const publicDir = args[0] ? resolve(args[0]) : resolve(process.cwd(), 'public')

  // Default target directories
  const targetDirectories = args[1] ? args[1].split(',') : ['websites', 'platforms']

  // eslint-disable-next-line no-console
  console.log(`Scanning for media files in ${targetDirectories.join(', ')}...`)
  // eslint-disable-next-line no-console
  console.log(`Public directory: ${publicDir}`)

  const allMediaFiles = []

  // Scan only specified directories
  for (const dir of targetDirectories) {
    const dirPath = join(publicDir, dir)
    try {
      const files = await scanDirectory(dirPath)
      allMediaFiles.push(...files)
    }
    catch {
      // Directory doesn't exist, skip it
      console.warn(`Directory ${dirPath} not found, skipping...`)
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Found ${allMediaFiles.length} media file(s)`)

  // Process all files concurrently
  await Promise.all(allMediaFiles.map(file => processFile(file)))

  // eslint-disable-next-line no-console
  console.log('\nDone!')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
