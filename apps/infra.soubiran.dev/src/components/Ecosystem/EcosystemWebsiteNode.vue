<script lang="ts">
import type { NodeProps } from '@vue-flow/core'
import type { EcosystemItem } from '@/types/ecosystem'

const ecosystemWebsiteNode = tv({
  slots: {
    base: '',
  },
})

export interface EcosystemWebsiteNodeProps extends NodeProps<EcosystemItem> {
  class?: any
  ui?: Partial<typeof ecosystemWebsiteNode.slots>
}
export interface EcosystemWebsiteNodeEmits {}
export interface EcosystemWebsiteNodeSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<EcosystemWebsiteNodeProps>()
defineEmits<EcosystemWebsiteNodeEmits>()
defineSlots<EcosystemWebsiteNodeSlots>()

const ui = computed(() => ecosystemWebsiteNode())
</script>

<template>
  <EcosystemNode
    :platform="props.data.platform"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    {{ props.data.platform }}
  </EcosystemNode>
</template>
