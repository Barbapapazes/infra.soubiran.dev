import type { Options } from './options'
import { joinURL } from 'ufo'

interface PersonData {
  '@type': 'Person'
  '@id': string
  'name': string
  'sameAs': string[]
}

/**
 * @see https://developer.yoast.com/features/schema/pieces/person/
 */
export function person(options: Options) {
  const data: PersonData = {
    '@type': 'Person',
    '@id': joinURL(options.url, '#', 'schema', 'Person', '1'),
    'name': 'Estéban Soubiran',
    'sameAs': [
      'https://x.com/soubiran_',
      'https://www.linkedin.com/in/esteban25',
      'https://www.twitch.tv/barbapapazes',
      'https://www.youtube.com/@barbapapazes',
      'https://github.com/barbapapazes',
      'https://soubiran.dev',
      'https://esteban-soubiran.site',
      'https://barbapapazes.dev',
    ],
  }

  return {
    data,
  }
}
