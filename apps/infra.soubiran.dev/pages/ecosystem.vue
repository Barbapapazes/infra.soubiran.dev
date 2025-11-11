<script lang="ts" setup>
import type { EcosystemItem } from '@/types/ecosystem'
import Ecosystem from '@/components/Ecosystem/Ecosystem.vue'

const router = useRouter()
const ecosystem = router.getRoutes()
  .filter(route => (route.path.startsWith('/websites/') || route.path.startsWith('/platforms/')) && route.meta.frontmatter.ecosystem)
  .map(route => ({
    type: route.path.startsWith('/websites/') ? 'website' : 'platform',
    name: route.meta.frontmatter.title,
    ecosystem: route.meta.frontmatter.ecosystem!,
  } satisfies EcosystemItem))
</script>

<template>
  <Ecosystem
    name="Estéban's Infra"
    :ecosystem="ecosystem"
    :ui="{ root: 'w-screen h-screen' }"
  />
</template>
