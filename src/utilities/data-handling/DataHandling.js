import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, List } from 'semantic-ui-react'

import { API, UI } from '../../enum'
import { CodeBlockDetails, MultiCodeBlockDetails } from '../../components'

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

const convertDate = (data, language) => {
  if (data !== '') {
    const date = new Date(data)

    return date.toLocaleDateString(UI.LOCALE[language])
  } else {
    return data
  }
}

const fixBoolean = (data) =>
  <Icon fitted size='large' name={data ? 'check square outline' : 'square outline'} color={data ? 'green' : 'red'} />

const fixDate = (data, language) => {
  if (Array.isArray(data)) {
    return (
      <List>
        {data.map((item, index) => <List.Item key={index} content={convertDate(item, language)} />)}
      </List>
    )
  } else {
    return convertDate(data, language)
  }
}

const fixDropdown = (data, producer) => {
  if (Array.isArray(data)) {
    return (
      <List>
        {data.map(item => {
          if (item.startsWith('/')) {
            // Add resolving names of referenced objects here
            return <List.Item key={item} style={{ lineHeight: '1.4285em' }} as={Link}
                              to={`/${producer}${item}/${API.VIEWS.VIEW}`}
                              content={item} />
          } else {
            return <List.Item key={item} style={{ lineHeight: '1.4285em' }} content={item} />
          }
        })}
      </List>
    )
  } else {
    if (data.startsWith('/')) {
      // Add resolving names of referenced object here
      return <Link to={`/${producer}${data}/${API.VIEWS.VIEW}`}>{data}</Link>
    } else {
      return data
    }
  }
}

const fixMultiInput = (data, uiSchema) =>
  <List>
    {data.map((value, index) =>
      <List.Item key={index}>
        <List.Content>
          <List.Header style={{ lineHeight: '1.4285em', fontStyle: 'italic' }}>
            {value[uiSchema.input.option.handler]}
          </List.Header>
          <List.Description>
            {Array.isArray(value[uiSchema.input.value.handler]) ?
              <List.List style={{ paddingLeft: '0', paddingTop: '0' }}>
                {value[uiSchema.input.value.handler].map(item => <List.Item key={item} content={item} />)}
              </List.List>
              :
              value[uiSchema.input.value.handler]
            }
          </List.Description>
        </List.Content>
      </List.Item>
    )}
  </List>

export const convertDataToView = (data, language, producer, uiSchema) => {
  if (data === '') {
    return '-'
  } else {
    if (uiSchema.hasOwnProperty('input')) {
      switch (uiSchema.input.type) {
        case 'boolean':
          return fixBoolean(data)

        case 'date':
          return fixDate(data, language)

        case 'dropdown':
          return fixDropdown(data, producer)

        case 'multiCodeBlock':
          return <MultiCodeBlockDetails data={data} uiSchema={uiSchema} />

        case 'multiInput':
          return fixMultiInput(data, uiSchema)

        case 'codeBlock':
          return <CodeBlockDetails data={data} uiSchema={uiSchema} />

        default:
          return data
      }
    } else {
      return uiSchema.type === 'date-time' ? convertDate(data, language) : data
    }
  }
}
