import type { Buffer } from 'node:buffer'
import { exec } from 'node:child_process'
import { glob, readFile, writeFile } from 'node:fs/promises'
import { join, parse, resolve } from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'
import { getPixels } from '@unpic/pixels'
import { cyan, dim, green, yellow } from 'ansis'
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

function formatPathForLog(filePath: string): string {
  const relPath = filePath.replace(`${process.cwd()}/`, '')
  const splitToken = '/public/'
  const idx = relPath.indexOf(splitToken)
  let left = relPath
  let right = ''
  if (idx !== -1) {
    left = relPath.slice(0, idx + splitToken.length)
    right = relPath.slice(idx + splitToken.length)
  }
  return `${dim(left)}${cyan(right)}`
}

async function processFile(filePath: string) {
  const time = Date.now()

  const { ext, dir, name } = parse(filePath)
  const lowerExt = ext.toLowerCase()

  if (!SUPPORTED_EXTENSIONS.includes(lowerExt)) {
    return
  }

  const metadataPath = join(dir, `${name}${ext}.json`)

  // eslint-disable-next-line no-console
  console.info(`${dim('Processing')} ${formatPathForLog(filePath)}`)

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
    console.info(`${dim(`Created metadata`)} ${formatPathForLog(metadataPath)} ${dim(`(${Date.now() - time} ms)`)}`)
  }
  catch (error) {
    console.error(`Failed to process ${filePath}:`, error)
  }
}

async function main() {
  const time = Date.now()

  const baseDir = process.cwd()
  // Scan all public directories in apps folder
  const appsDir = resolve(baseDir, 'apps')

  // eslint-disable-next-line no-console
  console.info(yellow(`Scanning for media files in all apps...`))

  const allMediaFiles: string[] = []

  // Find all public directories in apps
  try {
    for await (const appDir of glob('*/public', { cwd: appsDir })) {
      const publicDir = join(appsDir, appDir)
      // eslint-disable-next-line no-console
      console.info(dim(`  Scanning ${publicDir.replace(`${baseDir}/`, '')}...`))

      // Build glob patterns for all supported extensions
      const patterns = SUPPORTED_EXTENSIONS.map(ext => `**/*${ext}`)

      // Use Node 24's glob API to scan for all media files
      for (const pattern of patterns) {
        try {
          for await (const file of glob(pattern, { cwd: publicDir })) {
            allMediaFiles.push(join(publicDir, file))
          }
        }
        catch (error) {
          console.warn(`Error scanning with pattern ${pattern}:`, error)
        }
      }
    }
  }
  catch (error) {
    console.error('Error scanning apps directory:', error)
    process.exit(1)
  }

  // eslint-disable-next-line no-console
  console.info(green(`✓ Found ${allMediaFiles.length} media file(s)`))

  // Process all files concurrently
  await Promise.all(allMediaFiles.map(file => processFile(file)))

  // eslint-disable-next-line no-console
  console.info(green(`✓ Done in ${((Date.now() - time) / 1000).toFixed(2)} seconds`))
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
