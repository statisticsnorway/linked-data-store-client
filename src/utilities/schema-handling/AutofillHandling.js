import { producers } from '../../producers/Producers'

export const setAutofillProperties = (domainProperties, property, producer) => {
  const properties = {
    name: property,
    displayName:
      domainProperties[property].displayName !== undefined && domainProperties[property].displayName !== '' ?
        domainProperties[property].displayName : property,
    description: domainProperties[property].description
  }

  if (domainProperties[property].hasOwnProperty('format')) {
    properties.type = domainProperties[property].format

    if (domainProperties[property].format === 'date-time') {
      properties.icon = 'calendar alternate outline'
    }
  } else {
    properties.type = domainProperties[property].type
  }

  [{ type: 'user', icon: 'user outline' }].forEach(value => {
    if (producers[producer].autofillTypes[value.type].includes(property)) {
      properties.icon = value.icon
    }
  })

  return properties
}

export const setVersion = (version) => {
  const versionArray = version.split('.')

  versionArray[2] = parseInt(versionArray[2]) + 1

  return versionArray.join('.')
}
