import type { Buffer } from 'node:buffer'
import { getPixels } from '@unpic/pixels'
import { encode } from 'blurhash'

export interface BlurhashResult {
  width: number
  height: number
  blurhash: string
}

export async function generateBlurhash(imageBuffer: Uint8Array | Buffer): Promise<BlurhashResult> {
  const data = await getPixels(imageBuffer)
  const blurhash = encode(Uint8ClampedArray.from(data.data), data.width, data.height, 4, 4)

  return {
    width: data.width,
    height: data.height,
    blurhash,
  }
}
