import type { MarkdownItAsync } from 'markdown-it-async'
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'

export function githubAlerts(md: MarkdownItAsync) {
  md.use(MarkdownItGitHubAlerts)
}
