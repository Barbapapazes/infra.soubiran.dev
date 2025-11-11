import type { Options } from './options'
import type { person } from './person'
import { joinURL } from 'ufo'

interface WebsiteData {
  '@type': 'WebSite'
  '@id': string
  'url': string
  'name': string
  'inLanguage': string[]
  'publisher': {
    '@id': string
  }
}

/**
 * @see https://developer.yoast.com/features/schema/pieces/website/
 */
export function website(structuredData: { person: ReturnType<typeof person> }, options: Options) {
  const data: WebsiteData = {
    '@type': 'WebSite',
    '@id': joinURL(options.url, '#', 'schema', 'WebSite', '1'),
    'url': options.url,
    'name': options.name,
    'inLanguage': ['en-US'],
    'publisher': {
      '@id': structuredData.person.data['@id'],
    },
  }

  return {
    data,
  }
}
