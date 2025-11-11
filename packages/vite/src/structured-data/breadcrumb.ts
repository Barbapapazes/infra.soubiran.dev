import type { Options } from './options'
import { joinURL } from 'ufo'
import { getUri, toUrl } from '../utils'

interface BreadcrumbData {
  '@type': 'BreadcrumbList'
  '@id': string
  'itemListElement': {
    '@type': 'ListItem'
    'position': number
    'name': string
    'item'?: {
      '@type': 'WebSite' | 'WebPage'
      '@id': string
    }
  }[]
}

export interface BreadcrumbItem {
  title: string
  type?: 'WebSite' | 'WebPage'
  url?: string
}

/**
 * @see https://developer.yoast.com/features/schema/pieces/breadcrumb/
 */
export function breadcrumb(id: string, items: BreadcrumbItem[], options: Options) {
  const data: BreadcrumbData = {
    '@type': 'BreadcrumbList',
    '@id': joinURL(toUrl(options.hostname), '#', 'schema', 'BreadcrumbList', getUri(id)),
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.title,
      ...item.type && item.url
        ? {
            item: {
              '@type': item.type,
              '@id': item.url,
            },
          }
        : {},
    } satisfies BreadcrumbData['itemListElement'][number])),
  }

  return {
    data,
  }
}
