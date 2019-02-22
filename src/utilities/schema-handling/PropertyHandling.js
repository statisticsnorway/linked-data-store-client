import { extractReferenceFromString } from '../common/StringHandling'

export const setProperties = (definitions, lds, domain, property) => {
  const domainProperty = definitions[domain].properties[property]
  const properties = {}

  properties.name = property
  properties.displayName = domainProperty.displayName
  properties.description = domainProperty.description

  // TODO: Other input types from reference might not actually be multiInput...? That has to be dealt with in that case
  if (domainProperty.hasOwnProperty('items') && domainProperty.items.hasOwnProperty('$ref')) {
    if (domainProperty.type !== 'array') {
      // TODO: Add logic to deal with multiInput if it is not an array (if that is ever the case)
    } else {
      properties.input = setInputFromReference(definitions, extractReferenceFromString(domainProperty.items.$ref), property)
    }
  } else {
    properties.input = setInput(definitions[domain].properties, lds, domain, property)
  }

  properties.input.required = definitions[domain].hasOwnProperty('required') && definitions[domain].required.includes(property)

  return properties
}

const setInput = (properties, lds, domain, property) => {
  switch (properties[property].type) {
    case 'array':
      return fixArray(lds, properties, property)

    case 'boolean':
      return {type: 'boolean', emptyValue: false}

    case 'number':
      return {type: 'number', emptyValue: ''}

    case 'string':
      return fixString(lds, properties, property)

    default:
      return {type: 'text', emptyValue: ''}
  }
}

const fixArray = (lds, properties, property) => {
  const input = {type: 'dropdown', emptyValue: [], multiple: true}

  if (properties[property].hasOwnProperty('enum')) {
    input.options = properties[property].enum.map(value => {return {value: value, text: value}})
  }

  if (properties.hasOwnProperty('_link_property_' + property)) {
    input.links = Object.keys(properties['_link_property_' + property].properties).map(link =>
      `${lds.url}/${lds.namespace}/${link}`
    )
  }

  if (properties[property].hasOwnProperty('items')) {
    if (properties[property].items.hasOwnProperty('format')) {
      if (properties[property].items.format === 'date-time') {
        input.type = 'date'
        input.emptyValue = [null]
      }
    }
  }

  return input
}

const fixString = (lds, properties, property) => {
  const input = {type: 'text', emptyValue: '', multiple: false}

  if (properties[property].hasOwnProperty('enum')) {
    input.type = 'dropdown'
    input.options = properties[property].enum.map(value => {return {value: value, text: value}})

    if (input.options.length < 4) {
      input.type = 'radio'
    }
  }

  if (properties.hasOwnProperty('_link_property_' + property)) {
    input.type = 'dropdown'
    input.links = Object.keys(properties['_link_property_' + property].properties).map(link =>
      `${lds.url}/${lds.namespace}/${link}`
    )
  }

  if (properties[property].hasOwnProperty('format')) {
    if (properties[property].format === 'date-time') {
      input.type = 'date'
      input.emptyValue = null
    }
  }

  return input
}

const setInputFromReference = (definitions, reference, property) => {
  const referenceProperties = definitions[reference].properties
  const input = {name: property, type: 'multiInput', option: {}, value: {}, multiple: true, reference: reference}

  Object.keys(referenceProperties).forEach(property => {
    // TODO: Checking for 'enum' is not good enough too distinguish option from value, but how else to do it?
    if (referenceProperties[property].hasOwnProperty('enum')) {
      input.option.handler = property
      input.option.displayName = referenceProperties[property].displayName
      input.option.description = referenceProperties[property].description
      input.option.multiple = referenceProperties[property].type === 'array'
      input.option.options = referenceProperties[property].enum.map(value => ({value: value, text: value}))
      input.option.required = definitions[reference].hasOwnProperty('required') && definitions[reference].required.includes(property)
    } else {
      input.value.handler = property
      input.value.displayName = referenceProperties[property].displayName
      input.value.description = referenceProperties[property].description
      input.value.multiple = referenceProperties[property].type === 'array'
      input.value.required = definitions[reference].hasOwnProperty('required') && definitions[reference].required.includes(property)
    }
  })

  input.emptyValue = [{
    [input.option.handler]: input.option.multiple ? [''] : '',
    [input.value.handler]: input.value.multiple ? [''] : ''
  }]

  return input
}
