import React, { Component } from 'react'
import { Button, Icon } from 'semantic-ui-react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { createAutofillData } from '../producers/Producers'
import { validateAndClean } from '../utilities'
import { API, UI } from '../enum'

class DownloadJSON extends Component {
  downloadJSON = () => {
    const { data, lds, setErrors, uiSchema } = this.props

    let language = this.context.value

    const draft = lds.producer === API.DEFAULT_PRODUCER ? data.administrativeStatus === 'DRAFT' : false
    const returned = validateAndClean(data, ['unique', 'common'], language, uiSchema, draft)

    if (Object.keys(returned.errors).length > 0) {
      setErrors(returned.errors)
    } else {
      if (returned.data.id === '') {
        Object.keys(uiSchema.autofilled).forEach(property => {
          returned.data[property] = createAutofillData(returned.data[property], property, lds.producer, lds.user)
        })
      }

      const filename = `${returned.data.id}.json`
      const json = JSON.stringify(returned.data, undefined, 2)
      const blob = new Blob([json], { type: 'text/json;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  render () {
    let language = this.context.value

    return (
      <Button floated='right' color='teal' animated onClick={this.downloadJSON}>
        <Button.Content visible>{UI.DOWNLOAD_JSON[language]}</Button.Content>
        <Button.Content hidden>
          <Icon fitted name='download' />
        </Button.Content>
      </Button>
    )
  }
}

DownloadJSON.contextType = LanguageContext

export default DownloadJSON
