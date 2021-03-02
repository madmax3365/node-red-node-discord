export function extractIds(ids: string): string[] {
  return ids
    .split(',')
    .map((e: string) => e.trim())
    .filter((e: string) => e !== '');
}
