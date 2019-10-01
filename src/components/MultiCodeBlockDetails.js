import React, { Component } from 'react'
import { Accordion, Button, Form, Icon, Label, Modal, Popup } from 'semantic-ui-react'
import AceEditor from 'react-ace'

import 'brace/mode/python'
import 'brace/theme/github'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { truncateString } from '../utilities'
import { UI } from '../enum'

class MultiCodeBlockDetails extends Component {
  state = {
    activeIndex: -1,
    modalOpen: false
  }

  showModal = () => this.setState({ modalOpen: true })
  closeModal = () => this.setState({ modalOpen: false })

  handleAccordionClick = (event, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render () {
    const { data, uiSchema } = this.props
    const { activeIndex, modalOpen } = this.state

    let language = this.context.value

    const inputOption = uiSchema.input.option
    const inputValue = uiSchema.input.value

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
            <Accordion fluid>
              {data.map((element, index) =>
                <div key={element.codeBlockIndex}>
                  <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleAccordionClick}>
                    <Icon name='dropdown' />
                    {`${UI.ZEPPELIN_PARAGRAPH_INDEX[language]}: ${element.codeBlockIndex}`}
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === index}>
                    <Form>
                      <Form.Field inline>
                        <label>
                          <Popup basic flowing trigger={<span>{`${inputOption.displayName} `}</span>}>
                            <Icon color='blue' name='info circle' />
                            {inputOption.description}
                          </Popup>
                        </label>
                        <Label color='teal' tag content={element.codeBlockType} />
                      </Form.Field>
                      <Form.Field>
                        <label>
                          <Popup basic flowing trigger={<span>{`${inputValue.displayName} `}</span>}>
                            <Icon color='blue' name='info circle' />
                            {inputValue.description}
                          </Popup>
                        </label>
                        <AceEditor
                          mode='python'
                          theme='github'
                          fontSize={16}
                          highlightActiveLine={true}
                          readOnly={true}
                          placeholder={truncateString(inputValue.displayName)}
                          name={uiSchema.input.name}
                          value={element.codeBlockValue}
                          width='100%'
                          editorProps={{ $blockScrolling: true }}
                        />
                      </Form.Field>
                    </Form>
                  </Accordion.Content>
                </div>
              )}
            </Accordion>
          </Modal.Content>
        </Modal>
      </>
    )
  }
}

MultiCodeBlockDetails.contextType = LanguageContext

export default MultiCodeBlockDetails
