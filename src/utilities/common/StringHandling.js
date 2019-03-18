export const extractDomainFromEndpoint = (endpoint) => {
  if (typeof endpoint === 'string') {
    return endpoint.substring(endpoint.lastIndexOf('/') + 1)
  } else {
    return endpoint
  }
}

export const extractDomainFromString = (string) => {
  if (typeof string === 'string') {
    return string.substring(0, string.lastIndexOf('?')).substring(string.lastIndexOf('/') + 1)
  } else {
    return string
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
    return filename
  }
}

export const extractReferenceFromString = (string) => {
  if (typeof string === 'string') {
    return string.replace('#/definitions/', '')
  } else {
    return string
  }
}

export const extractTypeFromEndpoint = (endpoint) => {
  if (typeof endpoint === 'string') {
    return endpoint.slice(1, endpoint.lastIndexOf('/'))
  } else {
    return endpoint
  }
}

export const lowerCaseFirst = (string) => {
  if (typeof string === 'string') {
    return string.charAt(0).toLowerCase() + string.slice(1)
  } else {
    return string
  }
}

export const upperCaseFirst = (string) => {
  if (typeof string === 'string') {
    return string.charAt(0).toUpperCase() + string.slice(1)
  } else {
    return string
  }
}

export const stringToColor = (string) => {
  if (typeof string === 'string') {
    let hash = 0

    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF
      color += ('00' + value.toString(16)).substr(-2)
    }

    return color
  } else {
    return '#000000'
  }
}

export const truncateString = (string, length = 32) => {
  if (typeof string === 'string' && string.length > length) {
    return string.substring(0, (length - 2)) + '...'
  } else {
    return string
  }
}
