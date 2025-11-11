import type MarkdownIt from 'markdown-it'
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'

export function githubAlerts(md: MarkdownIt) {
  md.use(MarkdownItGitHubAlerts)
}
