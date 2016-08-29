export function domainUrl (url) {
  const domain = url.split(/^https?:\/\/([^\/?#]+)(?:[\/?#]|$)/)[1]
  return domain || 'n/a'
}
