<script lang="ts">
import type { NodeProps } from '@vue-flow/core'
import type { EcosystemItem } from '@/types/ecosystem'

const ecosystemRepositoryNode = tv({
  slots: {
    base: '',
  },
})

export interface EcosystemRepositoryNodeProps extends NodeProps<EcosystemItem> {
  class?: any
  ui?: Partial<typeof ecosystemRepositoryNode.slots>
}
export interface EcosystemRepositoryNodeEmits {}
export interface EcosystemRepositoryNodeSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<EcosystemRepositoryNodeProps>()
defineEmits<EcosystemRepositoryNodeEmits>()
defineSlots<EcosystemRepositoryNodeSlots>()

const ui = computed(() => ecosystemRepositoryNode())
</script>

<template>
  <EcosystemNode
    :platform="props.data.platform"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    {{ props.data.platform }}
  </EcosystemNode>
</template>
