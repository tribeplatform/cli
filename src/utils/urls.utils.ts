export const replaceDomain = (url: string | undefined, domain: string) => {
  if (!url) {
    return url
  }

  const urlObj = new URL(url)
  urlObj.host = domain
  return urlObj.toString()
}
