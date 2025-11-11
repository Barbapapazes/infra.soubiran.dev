<script lang="ts" setup>
import { useHead } from '@unhead/vue'

interface Repository {
  url: string
  private?: boolean
}

const { frontmatter } = defineProps<{
  frontmatter: {
    title: string
    url?: string
    repository?: string | Repository
  }
}>()

useHead({
  titleTemplate: '%s · Estéban Soubiran',
})

// Helper to get repository info
function getRepositoryInfo() {
  if (!frontmatter.repository)
    return null

  if (typeof frontmatter.repository === 'string') {
    return { url: frontmatter.repository, private: false }
  }

  return {
    url: frontmatter.repository.url,
    private: frontmatter.repository.private ?? false,
  }
}

const repositoryInfo = getRepositoryInfo()
</script>

<template>
  <UContainer class="py-12">
    <div class="mx-auto max-w-screen-md space-y-6">
      <div>
        <h1 class="text-xl font-bold text-highlighted">
          {{ frontmatter.title }}
        </h1>
        <div v-if="frontmatter.url || repositoryInfo" class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <a
            v-if="frontmatter.url"
            :href="frontmatter.url"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1 hover:text-default transition-colors"
          >
            <span>Website:</span>
            <span class="font-semibold">{{ frontmatter.url }}</span>
          </a>
          <div v-if="repositoryInfo" class="inline-flex items-center gap-1">
            <span>Repository:</span>
            <a
              v-if="!repositoryInfo.private"
              :href="repositoryInfo.url"
              target="_blank"
              rel="noopener"
              class="font-semibold hover:text-default transition-colors"
            >
              {{ repositoryInfo.url }}
            </a>
            <span v-else class="font-semibold">
              {{ repositoryInfo.url }}
            </span>
          </div>
        </div>
      </div>

      <slot />
    </div>
  </UContainer>
</template>
