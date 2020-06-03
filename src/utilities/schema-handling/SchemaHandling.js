import { producers } from '../../producers/Producers'
import { setProperties } from './PropertyHandling'
import { setAutofillProperties } from './AutofillHandling'

export const createUiSchema = (definitions, lds, domain) => {
  const domainProperties = definitions[domain].properties
  const uiSchema = {
    autofilled: {},
    common: {},
    unique: {},
    displayName: definitions[domain].displayName !== '' ? definitions[domain].displayName : domain,
    description: definitions[domain].description
  }

  Object.keys(domainProperties).forEach(property => {
    if (!property.startsWith('_link_property_')) {
      if (producers[lds.producer].grouping.autofilled.includes(property)) {
        uiSchema.autofilled[property] = setAutofillProperties(domainProperties, property, lds.producer)
      } else if (producers[lds.producer].grouping.common.includes(property)) {
        uiSchema.common[property] = setProperties(definitions, lds, domain, property)
      } else {
        uiSchema.unique[property] = setProperties(definitions, lds, domain, property)
      }
    }
  })

  return uiSchema
}
