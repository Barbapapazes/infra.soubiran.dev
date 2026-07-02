<script lang="ts" setup>
import type { Component } from 'vue'
import data from 'virtual:quick-news-graph'
import { onMounted, shallowRef } from 'vue'

const ScrollableViewport = shallowRef<Component | null>(null)
const WorkflowGraph = shallowRef<Component | null>(null)

onMounted(async () => {
  const graph = await import('@cloudflare-graph/vue')

  ScrollableViewport.value = graph.ScrollableViewport
  WorkflowGraph.value = graph.WorkflowGraph
})
</script>

<template>
  <component
    :is="ScrollableViewport"
    v-if="ScrollableViewport && WorkflowGraph"
    class="not-prose isolate h-164"
    viewport-class="size-full"
  >
    <component :is="WorkflowGraph" :workflow="data" />
  </component>
</template>
