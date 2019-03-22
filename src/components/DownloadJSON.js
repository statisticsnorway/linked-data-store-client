import React, { Component } from 'react'
import { Button, Icon } from 'semantic-ui-react'

import { createAutofillData, updateAutofillData } from '../producers/Producers'
import { validateAndClean } from '../utilities'
import { UI } from '../enum'

class DownloadJSON extends Component {
  downloadJSON = () => {
    const {data, languageCode, lds, setErrors, uiSchema} = this.props
    // TODO: For GSIM object with administrativeStatus set to DRAFT this validateAndClean might want to be skipped
    const returned = validateAndClean(data, ['unique', 'common'], languageCode, uiSchema)

    if (Object.keys(returned.errors).length > 0) {
      setErrors(returned.errors)
    } else {
      if (returned.data.id !== '') {
        Object.keys(uiSchema.autofilled).forEach(property => {
          returned.data[property] = updateAutofillData(returned.data[property], property, lds.producer, lds.user)
        })
      } else {
        Object.keys(uiSchema.autofilled).forEach(property => {
          returned.data[property] = createAutofillData(returned.data[property], property, lds.producer, lds.user)
        })
      }

      const filename = `${returned.data.id}.json`
      const json = JSON.stringify(returned.data, undefined, 2)
      const blob = new Blob([json], {type: 'text/json;charset=utf-8;'})
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
    const {languageCode} = this.props

    return (
      <Button floated='right' color='teal' animated onClick={this.downloadJSON}>
        <Button.Content visible>{UI.DOWNLOAD_JSON[languageCode]}</Button.Content>
        <Button.Content hidden>
          <Icon fitted name='download' />
        </Button.Content>
      </Button>
    )
  }
}

export default DownloadJSON
