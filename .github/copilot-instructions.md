# Copilot Instructions

This repository contains the infrastructure status page for Estéban Soubiran, built with modern web technologies.

## Project Structure

This is a **pnpm workspace monorepo** with the following structure:

- `apps/infra.soubiran.dev/` - Main Vue.js application
- `packages/vite/` - Shared Vite configuration package
- `.github/prompts/` - Custom prompts for GitHub Copilot

## Technology Stack

- **Frontend Framework**: Vue 3 with TypeScript
- **Build Tool**: Vite (using rolldown-vite fork)
- **Routing**: Vue Router with vite-ssg for static site generation
- **Styling**: Tailwind CSS v4 with @nuxt/ui components
- **Testing**: Playwright for end-to-end tests
- **Linting**: ESLint with @antfu/eslint-config
- **Package Manager**: pnpm v10.20.0
- **Deployment**: Cloudflare Workers (via wrangler)

## Key Commands

From the root directory:
```bash
pnpm install          # Install all dependencies
pnpm run lint         # Run ESLint across all packages
pnpm run lint:fix     # Auto-fix linting issues
```

From `apps/infra.soubiran.dev/`:
```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production (SSG)
pnpm run preview      # Preview production build
pnpm run test         # Run Playwright tests
pnpm run test:ui      # Run Playwright tests with UI
```

## Code Style Guidelines

- Use **TypeScript** for all new code
- Follow **@antfu/eslint-config** conventions (Vue, TypeScript, and stylistic rules enabled)
- Use **Composition API** with `<script setup>` syntax for Vue components
- Use **single quotes** for strings
- Use **2 spaces** for indentation
- Avoid semicolons (per ESLint config)

## Development Workflow

1. **Always install dependencies first**: Run `pnpm install` from the root
2. **Test before committing**: Run `pnpm run lint` and `pnpm run test` from appropriate directories
3. **Build validation**: Ensure `pnpm run build` succeeds before submitting changes
4. **CI checks**: The CI pipeline runs both linting and Playwright tests

## Special Considerations

### Package Overrides
This project uses custom package overrides in pnpm:
- `markdown-it` → `markdown-exit@1.0.0-beta.6`
- `vite` → `rolldown-vite@7.1.20`

### Patched Dependencies
Several packages have custom patches applied:
- `@nuxt/ui`
- `vite-ssg`
- `unhead`

When working with these packages, be aware that behavior may differ from their standard versions.

### Pages and Content
- Pages are markdown files in `apps/infra.soubiran.dev/pages/`
- The application uses file-based routing via vite-ssg
- Content includes platform status information

### Components
- Reusable Vue components are in `apps/infra.soubiran.dev/src/components/`
- Use @nuxt/ui components where possible for consistency
- Follow existing component patterns (e.g., `Socials.vue`, `ViewersCounter.vue`)

## Testing

- Playwright tests are located in `apps/infra.soubiran.dev/tests/`
- Tests run against the preview server in CI
- Always ensure tests pass before submitting changes

## Deployment

The application is deployed to Cloudflare Workers:
- Configuration: `apps/infra.soubiran.dev/wrangler.jsonc`
- Build output: `apps/infra.soubiran.dev/dist/`
- Assets are copied to Cloudflare using rclone (see README in app directory)

## Best Practices

1. **Minimal changes**: Make the smallest possible changes to achieve the goal
2. **Preserve working code**: Don't modify code that isn't related to your task
3. **Use existing patterns**: Follow the conventions established in the codebase
4. **Test thoroughly**: Run linting, building, and tests before finalizing changes
5. **Monorepo awareness**: Remember this is a workspace - changes may affect multiple packages
