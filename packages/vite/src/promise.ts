export const promises: Promise<any>[] = []

export async function resolveAll() {
  await Promise.all(promises)
}
