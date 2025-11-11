export function assert(id: string, frontmatter: Record<string, any>) {
  // Validate description length if present
  if (frontmatter.description) {
    const descLength = frontmatter.description.length
    if (descLength < 110 || descLength > 160) {
      throw new Error(
        `Description length must be between 110 and 160 characters. `
        + `Current length: ${descLength} in file: ${id}`,
      )
    }
  }

  // Check if this is a platform or website page (not index pages)
  const isPlatformOrWebsite = (id.includes('/platforms/') || id.includes('/websites/'))
    && !id.endsWith('index.md')

  // Validate url field for platform/website pages
  if (isPlatformOrWebsite && !frontmatter.url) {
    throw new Error(
      `Missing required field 'url' in frontmatter for file: ${id}`,
    )
  }

  // Validate repository field for platform/website pages
  if (isPlatformOrWebsite && !frontmatter.repository) {
    throw new Error(
      `Missing required field 'repository' in frontmatter for file: ${id}`,
    )
  }
}
