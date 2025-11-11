import type { MarkdownItAsync } from 'markdown-it-async'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { blurhashToDataUri } from '@unpic/placeholder'
import { joinURL } from 'ufo'

interface Metadata {
  width: number
  height: number
  blurhash: string
}

export function customImage(md: MarkdownItAsync, hostname: string) {
  md.use((md) => {
    const imageRule = md.renderer.rules.image!
    md.renderer.rules.image = async (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const src = token.attrGet('src')

      if (src) {
        const isExternal = src.startsWith('http')

        if (!isExternal) {
          const remoteSrc = `https://assets.${hostname}`

          const metadataFilename = `${src}.json`
          const cachedMetadataFilename = join('.cache', metadataFilename)
          let metadata: Metadata | undefined = await readFile(cachedMetadataFilename, 'utf-8').then(text => JSON.parse(text)).catch(() => undefined)
          if (!metadata) {
            metadata = await fetch(joinURL(remoteSrc, metadataFilename)).then(res => res.json()) as Metadata
            await mkdir(dirname(cachedMetadataFilename), { recursive: true })
            await writeFile(cachedMetadataFilename, JSON.stringify(metadata, null, 2))
          }

          token.attrSet('loading', 'lazy')
          token.attrSet('width', metadata.width.toString())
          token.attrSet('height', metadata.height.toString())
          token.attrSet('style', `background-size: cover; background-image: url(${blurhashToDataUri(metadata.blurhash)});`)
          token.attrSet('src', joinURL(`https://${hostname}`, 'cdn-cgi/image', 'width=1200,quality=80,format=auto', remoteSrc, src))
        }
      }

      return imageRule(tokens, idx, options, env, self)
    }
  })
}
