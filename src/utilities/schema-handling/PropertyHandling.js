import { extractReferenceFromString } from '../common/StringHandling'

const fixArray = (lds, properties, property) => {
  const input = { type: 'dropdown', emptyValue: [], multiple: true }

  if (properties[property].hasOwnProperty('enum')) {
    input.options = properties[property].enum.map(value => {return { value: value, text: value }})
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
  const input = { type: 'text', emptyValue: '', multiple: false }

  if (property === 'codeBlock' || property === 'processExecutionCode') {
    input.type = 'codeBlock'
  } else {
    if (properties[property].hasOwnProperty('enum')) {
      input.type = 'dropdown'
      input.options = properties[property].enum.map(value => {return { value: value, text: value }})

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
  }

  return input
}

const setInput = (properties, lds, domain, property) => {
  switch (properties[property].type) {
    case 'array':
      return fixArray(lds, properties, property)

    case 'boolean':
      return { type: 'boolean', emptyValue: false }

    case 'number':
      return { type: 'number', emptyValue: '' }

    case 'string':
      return fixString(lds, properties, property)

    default:
      return { type: 'text', emptyValue: '' }
  }
}

const setReferenceInput = (definitions, referenceProperties, reference, property, codeBlocks) => {
  const input = { name: property, type: 'multiInput', option: {}, value: {}, multiple: true, reference: reference }

  Object.keys(referenceProperties).forEach(key => {
    if (!key.startsWith('_link_property_')) {
      let inputType = 'value'

      // Checking for 'enum' is not good enough too distinguish option from value, but how else to do it?
      if (referenceProperties[key].hasOwnProperty('enum')) {
        input[inputType = 'option'].options = referenceProperties[key].enum.map(value => ({ value, text: value }))
      } else if (key === 'rank') {
        inputType = 'option'
      } else if (key === 'codeBlockIndex') {
        inputType = 'index'
        input.index = {}
      } else if (key === 'codeBlockTitle') {
        inputType = 'title'
        input.title = {}
      } else if (key === 'processStepInstance') {
        inputType = 'refLink'
        input.refLink = {}
      }

      input[inputType].handler = key
      input[inputType].displayName = referenceProperties[key].displayName
      input[inputType].description = referenceProperties[key].description
      input[inputType].multiple = referenceProperties[key].type === 'array'
      input[inputType].required = definitions[reference].hasOwnProperty('required') && definitions[reference].required.includes(key)
    }
  })

  if (codeBlocks) {
    input.emptyValue = [{
      [input.index.handler]: 1,
      [input.title.handler]: '',
      [input.refLink.handler]: '',
      [input.option.handler]: input.option.multiple ? [''] : '',
      [input.value.handler]: input.value.multiple ? [''] : ''
    }]

    input.type = 'multiCodeBlock'
  } else {
    input.emptyValue = [{
      [input.option.handler]: input.option.multiple ? [''] : '',
      [input.value.handler]: input.value.multiple ? [''] : ''
    }]
  }

  return input
}

const setInputFromReference = (definitions, reference, property) => {
  const referenceProperties = definitions[reference].properties

  if (Object.keys(referenceProperties).length > 2) {
    // If this is ever the case without it being related to GSIM and ProcessStepCodeBlockDetails it will have to be handled differently
    return setReferenceInput(definitions, referenceProperties, reference, property, true)
  } else {
    return setReferenceInput(definitions, referenceProperties, reference, property, false)
  }
}

export const setProperties = (definitions, lds, domain, property) => {
  const domainProperty = definitions[domain].properties[property]
  const properties = {
    name: property,
    displayName: domainProperty.displayName,
    description: domainProperty.description
  }

  // Other input types from reference might not actually be multiInput...? That has to be dealt with in that case
  if (domainProperty.hasOwnProperty('items') && domainProperty.items.hasOwnProperty('$ref')) {
    if (domainProperty.type !== 'array') {
      // Add logic to deal with multiInput if it is not an array (if that is ever the case)
    } else {
      properties.input = setInputFromReference(definitions, extractReferenceFromString(domainProperty.items.$ref), property)
    }
  } else {
    properties.input = setInput(definitions[domain].properties, lds, domain, property)
  }

  properties.input.required = definitions[domain].hasOwnProperty('required') && definitions[domain].required.includes(property)

  return properties
}
