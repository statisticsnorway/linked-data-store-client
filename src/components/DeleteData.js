import React, { Component } from 'react'
import { Button, Confirm, Icon, Message, Popup } from 'semantic-ui-react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { deleteData } from '../utilities'
import { ERRORS, MESSAGES, UI } from '../enum'

class DeleteData extends Component {
  state = {
    deleted: false,
    disabled: this.props.id === '',
    loading: false,
    message: false,
    showConfirm: false
  }

  showConfirm = () => {
    this.setState({ showConfirm: true })
  }

  hideConfirm = () => {
    this.setState({ showConfirm: false })
  }

  deleteData = () => {
    this.setState({
      loading: true,
      showConfirm: false
    }, () => {
      const { domain, id, lds } = this.props
      const url = `${lds.url}/${lds.namespace}/${domain.name}/${id}`

      let language = this.context.value

      deleteData(url).then(() => {
        this.setState({
          deleted: true,
          disabled: true,
          loading: false,
          message: MESSAGES.WAS_DELETED[language]
        })
      }).catch(error => {
        this.setState({
          loading: false,
          message: `${ERRORS.NOT_DELETED[language]} (${error})`
        })
      })
    })
  }

  render () {
    const { deleted, disabled, loading, message, showConfirm } = this.state
    const { id } = this.props

    let language = this.context.value

    return <Popup open={message !== false} position='top left' wide='very'
                  content={<Message positive={deleted} negative={!deleted} icon={deleted ? 'check' : 'warning'}
                                    content={message} />}
                  trigger={
                    <>
                      <Button floated='left' negative animated loading={loading} disabled={disabled}
                              onClick={this.showConfirm}>
                        <Button.Content visible>{UI.DELETE[language]}</Button.Content>
                        <Button.Content hidden><Icon fitted name='trash alternate outline' /></Button.Content>
                      </Button>
                      <Confirm open={showConfirm} onCancel={this.hideConfirm} onConfirm={this.deleteData}
                               header={MESSAGES.SURE[language]}
                               content={`${MESSAGES.SURE_EXTENDED[language]} ${id}`}
                               cancelButton={{
                                 color: 'red',
                                 content: UI.CANCEL[language],
                                 icon: 'close',
                                 floated: 'left'
                               }}
                               confirmButton={{ content: UI.CONFIRM[language], icon: 'check' }} />
                    </>} />
  }
}

DeleteData.contextType = LanguageContext

export default DeleteData
