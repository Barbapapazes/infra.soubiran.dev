import { Buffer } from 'node:buffer'
import { dirname } from 'node:path'
import fs from 'fs-extra'
import sharp from 'sharp'

const ogSVG = fs.readFileSync(new URL('./og-template.svg', import.meta.url), 'utf-8')

export async function og(title: string, output: string) {
  if (fs.existsSync(output))
    return

  await fs.mkdir(dirname(output), { recursive: true })
  // breakline every 30 chars
  const lines = title.trim().split(/(.{0,30})(?:\s|$)/g).filter(Boolean)

  const data: Record<string, string> = {
    line1: lines[0],
    line2: lines[1],
    line3: lines[2],
    headline: '',
  }
  const svg = ogSVG.replace(/\{\{([^}]+)\}\}/g, (_: unknown, name: string) => data[name] || '')

  // eslint-disable-next-line no-console
  console.log(`Generating ${output}`)
  try {
    await sharp(Buffer.from(svg))
      .resize(1200 * 1.1, 630 * 1.1)
      .png()
      .toFile(output)
  }
  catch (e) {
    console.error('Failed to generate og image', e)
  }
}
