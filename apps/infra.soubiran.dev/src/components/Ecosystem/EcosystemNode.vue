<script lang="ts">
import type { NodeProps } from '@vue-flow/core'
import type { EcosystemItem, EcosystemName, EcosystemType } from '@/types/ecosystem'
import { Handle } from '@vue-flow/core'
import slidev from '~icons/logos/slidev'
import globeSimple from '~icons/ph/globe-simple'
import cloudflare from '~icons/simple-icons/cloudflare'
import github from '~icons/simple-icons/github'
import githubactions from '~icons/simple-icons/githubactions'

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
      'cloudflare': {
        base: 'border-cloudflare',
        type: 'bg-cloudflare/15 text-cloudflare',
      },
      'github': {
        base: 'border-github',
        type: 'bg-github/15 text-github',
      },
      'soubiran': {
        base: 'border-accented',
        type: 'bg-primary/10 text-muted',
      },
      'slidev': {
        base: 'border-slidev',
        type: 'bg-slidev/15 text-slidev',
      },
      'vitepress': {
        base: 'border-vitepress',
        type: 'bg-vitepress/15 text-vitepress',
      },
      'pinia-colada': {
        base: 'border-pinia-colada',
        type: 'bg-pinia-colada/15 text-pinia-colada',
      },
      'vite': {
        base: 'border-vite',
        type: 'bg-vite/15 text-vite',
      },
      'vue': {
        base: 'border-vue',
        type: 'bg-vue/15 text-vue',
      },
      'partykit': {
        base: 'border-partykit',
        type: 'bg-partykit/15 text-partykit',
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

function getTypeIcon(name: EcosystemName, type?: EcosystemType): string | object | undefined {
  if (isCloudflare(name)) {
    switch (type) {
      case 'deployment':
        return 'cloudflare:workers'
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
      case 'website':
      case 'data':
        return globeSimple
    }
  }

  if (name === 'Slidev') {
    return slidev
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
    case name === 'Slidev':
      return 'slidev'
    case name === 'VitePress':
      return 'vitepress'
    case name === 'Pinia Colada':
      return 'pinia-colada'
    case name === 'Vite':
      return 'vite'
    case name === 'Vue':
      return 'vue'
    case name === 'PartyKit':
      return 'partykit'
    default:
  }
}

const ui = computed(() => ecosystemNode({
  type: !!props.data.type,
  name: genericName(props.data.name),
}))
</script>

<template>
  <div>
    <DefineTemplate>
      <div :class="ui.base({ class: [props.ui?.base, props.class] })">
        <span v-if="props.data.type" :class="ui.type({ class: props.ui?.type })">
          <UIcon v-if="icon" :name="icon" :class="ui.typeIcon({ class: props.ui?.typeIcon })" />
          <img v-else-if="logo" :src="logo" :alt="props.data.name" :class="ui.typeIcon({ class: props.ui?.typeIcon })">
          {{ props.data.type }}
        </span>

        <span :class="ui.name({ class: props.ui?.name })">{{ props.data.name }}</span>

        <Handle type="target" :position="props.sourcePosition" style="opacity: 0" />
        <Handle type="source" :position="props.targetPosition" style="opacity: 0" />
      </div>
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
