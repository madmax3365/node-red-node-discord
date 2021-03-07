export function extractIds(ids?: string): string[] {
  if (!ids) {
    return [];
  }
  return ids
    .split(',')
    .map((e: string) => e.trim())
    .filter((e) => e !== '');
}

export function idsFromParams(param: string | string[]): string[] {
  let ids: string[];
  if (typeof param === 'string') {
    ids = extractIds(param);
  } else {
    ids = param.map((it) => it.toString());
  }
  return ids;
}
