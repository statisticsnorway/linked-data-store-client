import React, { Component } from 'react'
import { Button, Form, Icon, Modal, Popup } from 'semantic-ui-react'

import { LanguageContext } from '../../utilities/context/LanguageContext'
import { UI } from '../../enum'
import FIMultiCodeBlockContent from './FIMultiCodeBlockContent'

class FIMultiCodeBlock extends Component {
  state = { modalOpen: false }

  showModal = () => this.setState({ modalOpen: true })
  closeModal = () => this.setState({ modalOpen: false })

  render () {
    const { error, uiSchema } = this.props
    const { modalOpen } = this.state

    let language = this.context.value

    return (
      <Form.Field required={uiSchema.input.required} error={!!error}>
        <label>
          <Popup basic flowing trigger={<span>{uiSchema.displayName}</span>}>
            <Icon color='blue' name='info circle' />
            {uiSchema.description}
          </Popup>
        </label>
        <Button animated primary size='large' onClick={this.showModal}>
          <Button.Content visible>{UI.HANDLE_CODE_BLOCKS[language]}</Button.Content>
          <Button.Content hidden>
            <Icon fitted name='file code outline' />
          </Button.Content>
        </Button>

        <Modal size='large' centered={false} open={modalOpen} onClose={this.closeModal}>
          <Modal.Header>{uiSchema.displayName}</Modal.Header>
          <Modal.Content>
            <FIMultiCodeBlockContent {...this.props} />
          </Modal.Content>
        </Modal>
      </Form.Field>
    )
  }
}

FIMultiCodeBlock.contextType = LanguageContext

export default FIMultiCodeBlock
