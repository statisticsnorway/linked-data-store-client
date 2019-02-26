import React from 'react'
import { Icon, List } from 'semantic-ui-react'

import { UI } from '../../enum'

export const createDefaultData = (properties, uiSchema) => {
  const data = {}

  Object.keys(properties).forEach(property => {
    if (uiSchema.common.hasOwnProperty(property)) {
      data[property] = uiSchema.common[property].input.emptyValue
    } else if (uiSchema.unique.hasOwnProperty(property)) {
      data[property] = uiSchema.unique[property].input.emptyValue
    } else if (uiSchema.autofilled.hasOwnProperty(property)) {
      data[property] = ''
    }
  })

  return data
}

export const convertDataToView = (data, languageCode, producer, uiSchema) => {
  if (data === '') {
    return '-'
  } else {
    if (uiSchema.hasOwnProperty('input')) {
      switch (uiSchema.input.type) {
        case 'boolean':
          return fixBoolean(data)

        case 'date':
          return fixDate(data, languageCode)

        case 'dropdown':
          return fixDropdown(data)

        case 'multiInput':
          return fixMultiInput(data, uiSchema)

        default:
          return data
      }
    } else {
      switch (uiSchema.type) {
        case 'date-time':
          return convertDate(data, languageCode)

        default:
          return data
      }
    }
  }
}

const convertDate = (data, languageCode) => {
  if (data !== '') {
    const date = new Date(data)

    return date.toLocaleDateString(UI.LOCALE[languageCode])
  } else {
    return data
  }
}

const fixBoolean = (data) =>
  <Icon fitted size='large' name={data ? 'check square outline' : 'square outline'} color={data ? 'green' : 'red'} />

const fixDate = (data, languageCode) => {
  if (Array.isArray(data)) {
    return (
      <List>
        {data.map((item, index) => <List.Item key={index} content={convertDate(item, languageCode)} />)}
      </List>
    )
  } else {
    return convertDate(data, languageCode)
  }
}

const fixDropdown = (data) => {
  if (Array.isArray(data)) {
    return (
      <List>
        {data.map((item, index) => <List.Item key={index} style={{lineHeight: '1.4285em'}} content={item} />)}
      </List>
    )
  } else {
    return data
  }
}

const fixMultiInput = (data, uiSchema) =>
  <List>
    {data.map((value, index) =>
      <List.Item key={index}>
        <List.Content>
          <List.Header style={{lineHeight: '1.4285em', fontStyle: 'italic'}}>
            {`${value[uiSchema.input.option.handler]}`}
          </List.Header>
          <List.Description>
            {Array.isArray(value[uiSchema.input.value.handler]) ?
              <List.List style={{paddingLeft: '0', paddingTop: '0'}}>
                {value[uiSchema.input.value.handler].map(item => <List.Item key={item} content={item} />)}
              </List.List>
              :
              `${value[uiSchema.input.value.handler]}`
            }
          </List.Description>
        </List.Content>
      </List.Item>
    )}
  </List>
