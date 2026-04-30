<script lang="ts">
import link from '~icons/ph/link'
import github from '~icons/simple-icons/github'

const pageLinks = tv({
  slots: {
    base: 'mt-2 flex items-center gap-2 font-sofia text-sm text-muted',
    link: '[&_span]:border-b [&_span]:border-muted hover:[&_span]:border-(--ui-text-dimmed) [&_span]:transition-colors [&_span]:duration-300 inline-flex items-center gap-1',
    separator: '',
  },
})

interface Repository {
  url: string
  private?: boolean
}

export interface PageLinksProps {
  url?: string
  repository?: string | Repository
  class?: any
  ui?: Partial<typeof pageLinks.slots>
}
export interface PageLinksEmits {}
export interface PageLinksSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<PageLinksProps>()
defineEmits<PageLinksEmits>()
defineSlots<PageLinksSlots>()

const isRepositoryPrivate = computed(() => typeof props.repository === 'string' ? false : props.repository?.private ?? false)
const repositoryUrl = computed(() => typeof props.repository === 'string' ? props.repository : props.repository?.url ?? '')

const ui = computed(() => pageLinks())
</script>

<template>
  <div v-if="props.url || repositoryUrl" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <a
      v-if="props.url"
      :href="`${props.url}?utm_source=infra.soubiran.dev&utm_medium=link`"
      :class="ui.link({ class: props.ui?.link })"
      target="_blank"
      rel="noopener"
    >
      <UIcon :name="link" class="size-4" />
      <span>{{ props.url.replace('https://', '') }}</span>
    </a>
    <span v-if="props.url && repositoryUrl" :class="ui.separator({ class: props.ui?.separator })"> · </span>
    <component
      :is="isRepositoryPrivate ? 'span' : 'a'"
      v-if="repositoryUrl"
      v-bind="isRepositoryPrivate ? {} : { href: repositoryUrl, target: '_blank', rel: 'noopener', class: ui.link({ class: props.ui?.link }) }"
      class="inline-flex items-center gap-1"
    >
      <UIcon :name="github" class="size-4" />
      <span>{{ repositoryUrl.replace('https://github.com/', '') }}</span>
    </component>
  </div>
</template>
