export const extractDomainFromString = (string) => {
  if (typeof string === 'string') {
    return string.substring(0, string.lastIndexOf('?')).substring(string.lastIndexOf('/') + 1)
  } else {
    return string.toString()
  }
}

export const extractDomainFromFilename = (filename) => {
  if (typeof filename === 'string') {
    let domain = filename.substring(0, filename.lastIndexOf('.'))

    if (domain.includes('Example')) {
      domain = domain.substring(0, domain.lastIndexOf('Example'))
    }

    if (domain.includes('_')) {
      const count = (domain.match(/_/g) || []).length

      for (let i = 0, l = count; i < l; i++) {
        domain = domain.substring(0, domain.lastIndexOf('_'))
      }
    }

    return domain
  } else {
    return filename.toString()
  }
}

export const extractReferenceFromString = (string) => {
  if (typeof string === 'string') {
    return string.replace('#/definitions/', '')
  } else {
    return string.toString()
  }
}

export function truncateString (string, length = 32) {
  if (typeof string === 'string' && string.length > length) {
    return string.substring(0, (length - 2)) + '...'
  } else {
    return string.toString()
  }
}

export const extractStringFromObject = (object, producer, languageCode) => {
  if (typeof object === 'object' && object !== null) {
    switch (producer) {
      case 'gsim':
        const nameObject = object.find(object => object.languageCode === languageCode)

        return `${nameObject === undefined ? object[0].languageText : nameObject.languageText}`

      default:
        return object.toString()
    }
  } else {
    return object
  }
}
