<script lang="ts">
import type { EcosystemPlatform } from '@/types/ecosystem'

const ecosystemNode = tv({
  slots: {
    base: 'size-24 border border-dashed rounded flex items-center justify-center',
  },
  variants: {
    platform: {
      cloudflare: {
        base: 'border-cloudflare',
      },
    },
  },
})

export interface EcosystemNodeProps {
  platform: EcosystemPlatform
  class?: any
  ui?: Partial<typeof ecosystemNode.slots>
}
export interface EcosystemNodeEmits {}
export interface EcosystemNodeSlots {
  default: (props: any) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<EcosystemNodeProps>()
defineEmits<EcosystemNodeEmits>()
defineSlots<EcosystemNodeSlots>()

function isCloudflarePlatform(platform: EcosystemPlatform) {
  return ['Cloudflare Build', 'Cloudflare R2', 'Cloudflare Pages'].includes(platform)
}

const ui = computed(() => ecosystemNode({
  platform: isCloudflarePlatform(props.platform) ? 'cloudflare' : undefined,
}))
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </div>
</template>
