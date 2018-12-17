export function splitOnUppercase (string) {
  if (typeof string === 'string') {
    return string.match(/[A-Z][a-z]+|[0-9]+/g).join(' ')
  } else {
    return string
  }
}

export function extractName (string) {
  if (typeof string === 'string') {
    return string.replace('#/definitions/', '')
  } else {
    return string
  }
}

export function removeFilenameExtension (filename) {
  return filename.substring(0, filename.lastIndexOf('.'))
}

export function extractObjectNameFromFilename (filename) {
  let domain = removeFilenameExtension(filename)

  if (domain.includes('Example')) {
    domain = domain.substring(0, domain.lastIndexOf('Example'))
  }

  if (domain.includes('_')) {
    let count = (domain.match(/_/g) || []).length

    for (let i = 0, l = count; i < l; i++) {
      domain = domain.substring(0, domain.lastIndexOf('_'))
    }
  }

  return domain
}
