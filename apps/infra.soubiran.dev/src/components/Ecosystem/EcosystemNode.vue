<script lang="ts">
import type { NodeProps } from '@vue-flow/core'
import type { EcosystemItem, EcosystemPlatform, EcosystemType } from '@/types/ecosystem'
import { Handle } from '@vue-flow/core'

const ecosystemNode = tv({
  slots: {
    base: 'border border-dashed rounded-full flex justify-center',
    platform: 'px-2 py-1',
    typeIcon: 'size-4',
    type: 'px-2 py-1 rounded-full text-xs font-mono flex items-center gap-1',
  },
  variants: {
    platform: {
      cloudflare: {
        base: 'border-cloudflare',
        type: 'bg-cloudflare/15 text-cloudflare',
      },
      github: {
        base: 'border-github',
        type: 'bg-github/15 text-github',
      },
      soubiran: {
        base: 'border-primary',
        type: 'bg-primary/15 text-primary',
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

function isCloudflarePlatform(platform: EcosystemPlatform) {
  return platform.includes('Cloudflare')
}

function isGithubPlatform(platform: EcosystemPlatform) {
  return platform.includes('GitHub')
}

function isSoubiranPlatform(platform: EcosystemPlatform) {
  return platform.includes('soubiran.dev')
}

function getTypeIcon(type: EcosystemType, platform: EcosystemPlatform): string | undefined {
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
}

const icon = computed(() => getTypeIcon(props.data.type, props.data.platform))

const ui = computed(() => ecosystemNode({
  platform: isCloudflarePlatform(props.data.platform)
    ? 'cloudflare'
    : isGithubPlatform(props.data.platform)
      ? 'github'
      : isSoubiranPlatform(props.data.platform)
        ? 'soubiran'
        : undefined,
}))
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <span v-if="props.data.type" :class="ui.type({ class: props.ui?.type })">
      <UIcon v-if="icon" :name="icon" :class="ui.typeIcon({ class: props.ui?.typeIcon })" />
      {{ props.data.type }}
    </span>

    <span :class="ui.platform({ class: props.ui?.platform })">{{ props.data.platform }}</span>

    <Handle type="target" :position="props.sourcePosition" style="opacity: 0" />
    <Handle type="source" :position="props.targetPosition" style="opacity: 0" />
  </div>
</template>
