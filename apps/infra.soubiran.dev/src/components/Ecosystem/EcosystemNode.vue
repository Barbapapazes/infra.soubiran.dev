<script lang="ts">
import type { NodeProps } from '@vue-flow/core'
import type { EcosystemItem, EcosystemPlatform, EcosystemType } from '@/types/ecosystem'
import { Handle } from '@vue-flow/core'

const ecosystemNode = tv({
  slots: {
    base: 'border border-dashed rounded-full flex justify-center',
    typeIcon: 'size-4',
    type: 'pl-3 pr-2 py-1 rounded-l-full text-xs font-mono flex items-center gap-1',
    platform: 'py-1 text-sm',
  },
  variants: {
    type: {
      true: {
        platform: 'pl-2 pr-3',
      },
      false: {
        platform: 'px-3',
      },
    },
    platform: {
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

function isCloudflarePlatform(platform: EcosystemPlatform) {
  return platform.includes('Cloudflare')
}

function isGithubPlatform(platform: EcosystemPlatform) {
  return platform.includes('GitHub')
}

function isSoubiranPlatform(platform: EcosystemPlatform) {
  return platform.includes('soubiran.dev')
}

function isSlidevPlatform(platform: EcosystemPlatform) {
  return platform.includes('Slidev')
}

function getTypeIcon(platform: EcosystemPlatform, type?: EcosystemType): string | undefined {
  if (isCloudflarePlatform(platform)) {
    switch (type) {
      case 'deployment':
        return 'cloudflare:workers'
      case 'build':
        return 'cloudflare:workers'
      case 'object-storage':
        return 'cloudflare:r2'
      case 'domain':
        return 'i-simple-icons:cloudflare'
    }
  }

  if (isGithubPlatform(platform)) {
    switch (type) {
      case 'data':
      case 'repository':
        return 'i-simple-icons:github'
      case 'ci/cd':
        return 'i-simple-icons:githubactions'
    }
  }

  if (isSoubiranPlatform(platform)) {
    switch (type) {
      case 'website':
        return 'i-ph:globe-simple'
      case 'data':
        return 'i-ph:globe-simple'
    }
  }

  if (platform === 'Slidev') {
    return 'i-logos:slidev'
  }
}

function getTypeLogo(platform: EcosystemPlatform): string | undefined {
  if (platform === 'VitePress') {
    return 'https://vitepress.dev/vitepress-logo-mini.svg'
  }

  if (platform === 'Pinia Colada') {
    return 'https://pinia-colada.esm.dev/logo.svg'
  }

  if (platform === 'Vite') {
    return 'https://vitejs.dev/logo.svg'
  }

  if (platform === 'Vue') {
    return 'https://vuejs.org/images/logo.png'
  }
}

const icon = computed(() => getTypeIcon(props.data.platform, props.data.type))
const logo = computed(() => getTypeLogo(props.data.platform))

function genericPlatform(platform: EcosystemPlatform) {
  if (isCloudflarePlatform(platform)) {
    return 'cloudflare'
  }

  if (isGithubPlatform(platform)) {
    return 'github'
  }

  if (isSoubiranPlatform(platform)) {
    return 'soubiran'
  }

  if (isSlidevPlatform(platform)) {
    return 'slidev'
  }

  if (platform === 'VitePress') {
    return 'vitepress'
  }

  if (platform === 'Pinia Colada') {
    return 'pinia-colada'
  }

  if (platform === 'Vite') {
    return 'vite'
  }

  if (platform === 'Vue') {
    return 'vue'
  }
}

const ui = computed(() => ecosystemNode({
  type: !!props.data.type,
  platform: genericPlatform(props.data.platform),
}))
</script>

<template>
  <DefineTemplate>
    <div :class="ui.base({ class: [props.ui?.base, props.class] })">
      <span v-if="props.data.type" :class="ui.type({ class: props.ui?.type })">
        <UIcon v-if="icon" :name="icon" :class="ui.typeIcon({ class: props.ui?.typeIcon })" />
        <img v-else-if="logo" :src="logo" :alt="props.data.platform" :class="ui.typeIcon({ class: props.ui?.typeIcon })">
        {{ props.data.type }}
      </span>

      <span :class="ui.platform({ class: props.ui?.platform })">{{ props.data.platform }}</span>

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
</template>
