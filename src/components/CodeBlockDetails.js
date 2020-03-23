import React, { Component } from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-github'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { truncateString } from '../utilities'
import { UI } from '../enum'

class CodeBlockDetails extends Component {
  state = { modalOpen: false }

  showModal = () => this.setState({ modalOpen: true })
  closeModal = () => this.setState({ modalOpen: false })

  render () {
    const { data, uiSchema } = this.props
    const { modalOpen } = this.state

    let language = this.context.value

    return (
      <>
        <Button animated primary onClick={this.showModal}>
          <Button.Content visible>{UI.VIEW_CODE_BLOCK[language]}</Button.Content>
          <Button.Content hidden>
            <Icon fitted name='file code outline' />
          </Button.Content>
        </Button>

        <Modal open={modalOpen} onClose={this.closeModal}>
          <Modal.Header>{uiSchema.displayName}</Modal.Header>
          <Modal.Content>
            <AceEditor
              mode='python'
              theme='github'
              fontSize={16}
              highlightActiveLine={true}
              readOnly={true}
              placeholder={truncateString(uiSchema.displayName)}
              name={uiSchema.name}
              value={data}
              width='100%'
              editorProps={{ $blockScrolling: true }}
            />
          </Modal.Content>
        </Modal>
      </>
    )
  }
}

CodeBlockDetails.contextType = LanguageContext

export default CodeBlockDetails
