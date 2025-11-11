import type { MarkdownItAsync } from 'markdown-it-async'
import { Buffer } from 'node:buffer'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { getPixels } from '@unpic/pixels'
import { blurhashToDataUri } from '@unpic/placeholder'
import { encode } from 'blurhash'
import { joinURL } from 'ufo'

export function customImage(md: MarkdownItAsync, hostname: string) {
  md.use((md) => {
    const imageRule = md.renderer.rules.image!
    md.renderer.rules.image = async (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const src = token.attrGet('src')

      if (src) {
        const isExternal = src.startsWith('http')

        if (!isExternal) {
          const remoteSrc = joinURL(`https://${hostname}`, 'cdn-cgi/image', 'width=1200,quality=80,format=auto', `https://assets.${hostname}`, src)

          const file = join('.cache', src)
          let img: Uint8Array<ArrayBufferLike> | undefined = await readFile(file).then(bin => Buffer.from(bin)).catch(() => undefined)
          if (!img) {
            img = await fetch(remoteSrc).then(res => res.bytes())
            await mkdir(dirname(file), { recursive: true })
            await writeFile(file, Buffer.from(img!))
          }

          const data = await getPixels(img!)
          const blurhash = encode(Uint8ClampedArray.from(data.data), data.width, data.height, 4, 4)

          token.attrSet('src', remoteSrc)
          token.attrSet('loading', 'lazy')
          token.attrSet('width', data.width.toString())
          token.attrSet('height', data.height.toString())
          token.attrSet('style', `background-size: cover; background-image: url(${blurhashToDataUri(blurhash)});`)
        }
      }

      return imageRule(tokens, idx, options, env, self)
    }
  })
}
