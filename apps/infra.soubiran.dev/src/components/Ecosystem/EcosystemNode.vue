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
      cloudflare: {
        base: 'border-cloudflare',
        type: 'bg-cloudflare/15 text-cloudflare',
      },
      github: {
        base: 'border-github',
        type: 'bg-github/15 text-github',
      },
      soubiran: {
        base: 'border-accented',
        type: 'bg-primary/10 text-muted',
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
  type: !!props.data.type,
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
  <DefineTemplate>
    <div :class="ui.base({ class: [props.ui?.base, props.class] })">
      <span v-if="props.data.type" :class="ui.type({ class: props.ui?.type })">
        <UIcon v-if="icon" :name="icon" :class="ui.typeIcon({ class: props.ui?.typeIcon })" />
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
