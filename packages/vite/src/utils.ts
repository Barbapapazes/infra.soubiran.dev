import { joinURL, withoutTrailingSlash } from 'ufo'

export function getUri(id: string) {
  return withoutTrailingSlash(id.split('/pages/')[1].replace(/\.md$/, '').replace(/index$/, ''))
}

export function toUrl(hostname: string, ...paths: string[]) {
  return joinURL(`https://${hostname}`, ...paths)
}

export type Page = 'platforms-index' | 'platforms-show'
export function extractPage(id: string) {
  const uri = getUri(id)

  if (uri === 'platforms') {
    return 'platforms-index'
  }

  if (uri.startsWith('platforms/')) {
    return 'platforms-show'
  }

  return null
}
