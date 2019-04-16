import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Icon, Message, Popup } from 'semantic-ui-react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { createAutofillData, updateAutofillData } from '../producers/Producers'
import { putData, validateAndClean } from '../utilities'
import { ERRORS, UI } from '../enum'

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

      // TODO: For GSIM objects with administrativeStatus set to DRAFT this validateAndClean might want to be skipped
      // const draft = lds.producer === 'gsim' ? data.administrativeStatus === 'DRAFT' : false
      const returned = validateAndClean(data, false, ['unique', 'common'], language, uiSchema)

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

        const url = `${lds.url}/${lds.namespace}/${domain.name}/${returned.data.id}`

        // TODO: If the putData fails, a new id is created on each try, should that be the case?
        putData(url, returned.data).then(() => {
          this.setState({
            loading: false,
            redirect: true,
            redirectId: returned.data.id
          })
        }).catch(error => {
          this.setState({
            error: error,
            loading: false
          })
        })
      }
    })
  }

  render () {
    const { error, loading, redirect, redirectId } = this.state
    const { domain, fresh } = this.props

    let language = this.context.value

    if (redirect) {
      return <Redirect exact push to={{ pathname: `${domain.route}/${redirectId}/view`, state: { wasSaved: true } }} />
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
