<script lang="ts" setup>
import { useHead } from '@unhead/vue'
import link from '~icons/ph/link'
import github from '~icons/simple-icons/github'

interface Repository {
  url: string
  private?: boolean
}

const props = defineProps<{
  frontmatter: {
    title: string
    url?: string
    repository?: string | Repository
  }
}>()

useHead({
  titleTemplate: '%s · Estéban Soubiran',
})

const isRepositoryPrivate = computed(() => typeof props.frontmatter.repository === 'string' ? false : props.frontmatter.repository?.private ?? false)
const repositoryUrl = computed(() => typeof props.frontmatter.repository === 'string' ? props.frontmatter.repository : props.frontmatter.repository?.url ?? '')

const linkClass = '[&_span]:border-b [&_span]:border-muted hover:[&_span]:border-(--ui-text-dimmed) [&_span]:transition-colors [&_span]:duration-300'
</script>

<template>
  <UContainer class="py-12">
    <div class="mx-auto max-w-screen-md space-y-6">
      <div>
        <h1 class="text-xl font-bold text-highlighted">
          {{ props.frontmatter.title }}
        </h1>
        <div v-if="props.frontmatter.url || props.frontmatter.repository" class="mt-2 flex items-center gap-2 font-sofia text-sm text-muted">
          <a
            v-if="props.frontmatter.url"
            :href="`${props.frontmatter.url}?utm_source=infra.soubiran.dev&utm_medium=link`"
            :class="linkClass"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1"
          >
            <UIcon :name="link" class="size-4" />
            <span>{{ props.frontmatter.url }}</span>
          </a>
          <span v-if="props.frontmatter.url && repositoryUrl"> · </span>
          <component
            :is="isRepositoryPrivate ? 'span' : 'a'"
            v-if="repositoryUrl"
            v-bind="isRepositoryPrivate ? {} : { href: repositoryUrl, target: '_blank', rel: 'noopener', class: linkClass }"
            class="inline-flex items-center gap-1"
          >
            <UIcon :name="github" class="size-4" />
            <span>{{ repositoryUrl }}</span>
          </component>
        </div>
      </div>

      <slot />
    </div>
  </UContainer>
</template>
