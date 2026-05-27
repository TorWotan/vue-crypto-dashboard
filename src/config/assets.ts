const BASE_URL = import.meta.env.BASE_URL

export const getAssetPath = (path: string): string => {
  if (/^https?:\/\//i.test(path)) return path
  if (path.startsWith('/')) path = path.slice(1)
  return BASE_URL + path
}
