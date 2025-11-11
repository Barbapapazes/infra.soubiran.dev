<script lang="ts">
import type { NodeProps } from '@vue-flow/core'
import type { EcosystemItem, EcosystemName, EcosystemType } from '@/types/ecosystem'
import { Handle } from '@vue-flow/core'
import { RouterLink } from 'vue-router'
import nuxt from '~icons/logos/nuxt-icon'
import slidev from '~icons/logos/slidev'
import globeSimple from '~icons/ph/globe-simple'
import authentik from '~icons/simple-icons/authentik'
import cloudflare from '~icons/simple-icons/cloudflare'
import github from '~icons/simple-icons/github'
import githubactions from '~icons/simple-icons/githubactions'
import hetzner from '~icons/simple-icons/hetzner'
import inertiajs from '~icons/simple-icons/inertia'
import laravel from '~icons/simple-icons/laravel'
import sqlite from '~icons/simple-icons/sqlite'

const ecosystemNode = tv({
  slots: {
    base: 'border border-dashed rounded-full flex justify-center',
    typeIcon: 'size-4',
    type: 'pl-3 pr-2 py-1 rounded-l-full text-xs font-mono flex items-center gap-1',
    name: 'py-1 text-sm',
  },
  variants: {
    type: {
      true: {
        name: 'pl-2 pr-3',
      },
      false: {
        name: 'px-3',
      },
    },
    name: {
      'soubiran': {
        base: 'border-accented',
        type: 'bg-primary/10 text-muted',
      },
      'cloudflare': {
        base: 'border-cloudflare',
        type: 'bg-cloudflare/15 text-cloudflare',
      },
      'github': {
        base: 'border-github',
        type: 'bg-github/15 text-github',
      },
      'authentik': {
        base: 'border-authentik',
        type: 'bg-authentik/15 text-authentik',
      },
      'forge': {
        base: 'border-forge',
        type: 'bg-forge/15 text-forge',
      },
      'hetzner': {
        base: 'border-hetzner',
        type: 'bg-hetzner/15 text-hetzner',
      },
      'partykit': {
        base: 'border-partykit',
        type: 'bg-partykit/15 text-partykit',
      },
      'vite': {
        base: 'border-vite',
        type: 'bg-vite/15 text-vite',
      },
      'vue': {
        base: 'border-vue',
        type: 'bg-vue/15 text-vue',
      },
      'nuxt': {
        base: 'border-nuxt',
        type: 'bg-nuxt/15 text-nuxt',
      },
      'vitepress': {
        base: 'border-vitepress',
        type: 'bg-vitepress/15 text-vitepress',
      },
      'slidev': {
        base: 'border-slidev',
        type: 'bg-slidev/15 text-slidev',
      },
      'pinia-colada': {
        base: 'border-pinia-colada',
        type: 'bg-pinia-colada/15 text-pinia-colada',
      },
      'inertiajs': {
        base: 'border-inertiajs',
        type: 'bg-inertiajs/15 text-inertiajs',
      },
      'laravel': {
        base: 'border-laravel',
        type: 'bg-laravel/15 text-laravel',
      },
      'sqlite': {
        base: 'border-sqlite',
        type: 'bg-sqlite/15 text-sqlite',
      },
      'litestream': {
        base: 'border-litestream',
        type: 'bg-litestream/15 text-litestream',
      },
    },
  },
})

export interface EcosystemNodeProps extends NodeProps<EcosystemItem> {
  class?: any
  ui?: Partial<typeof ecosystemNode.slots>
}
export interface EcosystemNodeEmits {}
export interface EcosystemNodeSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<EcosystemNodeProps>()
defineEmits<EcosystemNodeEmits>()
defineSlots<EcosystemNodeSlots>()

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

const isCloudflare = (name: EcosystemName) => name.includes('Cloudflare')
const isGithub = (name: EcosystemName) => name.includes('GitHub')
const isSoubiran = (name: EcosystemName) => name.includes('soubiran.dev')
const isNuxt = (name: EcosystemName) => name.includes('Nuxt')

function getTypeIcon(name: EcosystemName, type?: EcosystemType): string | object | undefined {
  if (isCloudflare(name)) {
    switch (type) {
      case 'deployment':
      case 'build':
        return 'cloudflare:workers'
      case 'object-storage':
        return 'cloudflare:r2'
      case 'domain':
        return cloudflare
    }
  }

  if (isGithub(name)) {
    switch (type) {
      case 'data':
      case 'repository':
        return github
      case 'ci/cd':
        return githubactions
    }
  }

  if (isSoubiran(name)) {
    switch (type) {
      case 'platform':
      case 'website':
      case 'data':
        return globeSimple
    }
  }

  if (isNuxt(name)) {
    return nuxt
  }

  if (name === 'Slidev') {
    return slidev
  }

  if (name === 'Forge') {
    return 'forge'
  }

  if (name === 'Authentik') {
    return authentik
  }

  if (name === 'Hetzner') {
    return hetzner
  }

  if (name === 'Inertia.js') {
    return inertiajs
  }

  if (name === 'Laravel') {
    return laravel
  }

  if (name === 'SQLite') {
    return sqlite
  }
}

function getTypeLogo(name: EcosystemName): string | undefined {
  switch (name) {
    case 'VitePress':
      return 'https://vitepress.dev/vitepress-logo-mini.svg'
    case 'Pinia Colada':
      return 'https://pinia-colada.esm.dev/logo.svg'
    case 'Vite':
      return 'https://vitejs.dev/logo.svg'
    case 'Vue':
      return 'https://vuejs.org/images/logo.png'
    case 'PartyKit':
      return 'https://docs.partykit.io/favicon.svg'
    case 'Litestream':
      return 'https://litestream.io/favicon-16x16.png'
    default:
      return undefined
  }
}

const icon = computed(() => getTypeIcon(props.data.name, props.data.type))
const logo = computed(() => getTypeLogo(props.data.name))

function genericName(name: EcosystemName) {
  switch (true) {
    case isCloudflare(name):
      return 'cloudflare'
    case isGithub(name):
      return 'github'
    case isSoubiran(name):
      return 'soubiran'
    case isNuxt(name):
      return 'nuxt'
    default:
      return name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '') as any
  }
}

const isWebsiteOrPlatform = computed(() => props.data.type === 'website' || props.data.type === 'platform')

const ui = computed(() => ecosystemNode({
  type: !!props.data.type,
  name: genericName(props.data.name),
}))
</script>

<template>
  <div>
    <DefineTemplate>
      <component :is="isWebsiteOrPlatform ? RouterLink : 'div'" :class="ui.base({ class: [props.ui?.base, props.class] })" :to="isWebsiteOrPlatform ? `${props.data.type}s/${props.data.name.replace(/\./g, '-')}` : undefined">
        <span v-if="props.data.type" :class="ui.type({ class: props.ui?.type })">
          <UIcon v-if="icon" :name="icon" :class="ui.typeIcon({ class: props.ui?.typeIcon })" />
          <img v-else-if="logo" :src="logo" :alt="props.data.name" :class="ui.typeIcon({ class: props.ui?.typeIcon })">
          {{ props.data.type }}
        </span>

        <span :class="ui.name({ class: props.ui?.name })">{{ props.data.name }}</span>

        <Handle type="target" :position="props.sourcePosition" style="opacity: 0" />
        <Handle type="source" :position="props.targetPosition" style="opacity: 0" />
      </component>
    </DefineTemplate>

    <UPopover v-if="props.data.description" mode="hover" arrow>
      <ReuseTemplate />

      <template #content>
        <UPageCard
          :description="props.data.description"
          :to="props.data.href"
          :ui="{
            container: 'p-2 sm:p-2',
            title: 'text-sm',
            description: 'text-sm',
          }"
        />
      </template>
    </UPopover>

    <ReuseTemplate v-else />
  </div>
</template>
