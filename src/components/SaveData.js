import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Icon, Message, Popup } from 'semantic-ui-react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { createAutofillData, updateAutofillData } from '../producers/Producers'
import { putData, validateAndClean } from '../utilities'
import { API, ERRORS, UI } from '../enum'

class SaveData extends Component {
  state = {
    error: false,
    loading: false,
    redirect: false
  }

  saveData = () => {
    this.setState({ loading: true }, () => {
      const { data, domain, lds, setErrors, uiSchema } = this.props

      let language = this.context.value

      const draft = lds.producer === API.DEFAULT_PRODUCER ? data.administrativeStatus === 'DRAFT' : false
      const returned = validateAndClean(data, ['unique', 'common'], language, uiSchema, draft)

      if (Object.keys(returned.errors).length > 0) {
        this.setState({ loading: false })

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

        const url = `${lds.url}/${lds.namespace}/${domain}/${returned.data.id}`

        // If the putData fails, a new id is created on each try, should that be the case?
        putData(url, returned.data).then(() => {
          this.setState({
            loading: false,
            redirect: true,
            redirectId: returned.data.id
          })
        }).catch(error => {
          this.setState({
            error: error.toString(),
            loading: false
          })
        })
      }
    })
  }

  render () {
    const { error, loading, redirect, redirectId } = this.state
    const { domain, fresh, lds } = this.props

    let language = this.context.value

    if (redirect) {
      return <Redirect exact to={{ pathname: `/${lds.producer}/${domain}`, state: { wasSaved: redirectId } }} />
    } else {
      return (
        <Popup header={ERRORS.NOT_SAVED[language]} content={<Message negative icon='warning' content={error} />}
               open={error !== false} position='top right' wide='very'
               trigger={
                 <Button floated='right' positive animated loading={loading} onClick={this.saveData} disabled={fresh}>
                   <Button.Content visible>{UI.SAVE[language]}</Button.Content>
                   <Button.Content hidden>
                     <Icon fitted name='save' />
                   </Button.Content>
                 </Button>
               }>
        </Popup>
      )
    }
  }
}

SaveData.contextType = LanguageContext

export default SaveData
