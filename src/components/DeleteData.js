import React, { Component } from 'react'
import { Button, Confirm, Icon, Message, Popup } from 'semantic-ui-react'

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
    this.setState({showConfirm: true})
  }

  hideConfirm = () => {
    this.setState({showConfirm: false})
  }

  deleteData = () => {
    this.setState({
      loading: true,
      showConfirm: false
    }, () => {
      const {domain, id, languageCode, lds} = this.props
      const url = `${lds.url}/${lds.namespace}/${domain.name}/${id}`

      deleteData(url).then(() => {
        this.setState({
          deleted: true,
          disabled: true,
          loading: false,
          message: MESSAGES.WAS_DELETED[languageCode]
        })
      }).catch(error => {
        this.setState({
          loading: false,
          message: `${ERRORS.NOT_DELETED[languageCode]} (${error})`
        })
      })
    })
  }

  render () {
    const {deleted, disabled, loading, message, showConfirm} = this.state
    const {languageCode} = this.props

    return <Popup open={message !== false} position='top left' wide='very'
                  content={<Message positive={deleted} negative={!deleted} icon={deleted ? 'check' : 'warning'}
                                    content={message} />}
                  trigger={
                    <div>
                      <Button floated='left' negative animated loading={loading} disabled={disabled}
                              onClick={this.showConfirm}>
                        <Button.Content visible>{UI.DELETE[languageCode]}</Button.Content>
                        <Button.Content hidden><Icon fitted name='trash alternate outline' /></Button.Content>
                      </Button>
                      <Confirm open={showConfirm} onCancel={this.hideConfirm} onConfirm={this.deleteData} content=''
                               header={MESSAGES.SURE[languageCode]} cancelButton={UI.CANCEL[languageCode]}
                               confirmButton={UI.CONFIRM[languageCode]} />
                    </div>} />
  }
}

export default DeleteData
