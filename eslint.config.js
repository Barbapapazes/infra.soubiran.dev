import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  stylistic: true,
  ignores: [
    '**/pnpm-lock.yaml',
    '**/test-results/**',
    '**/playwright-report/**',
  ],
})
