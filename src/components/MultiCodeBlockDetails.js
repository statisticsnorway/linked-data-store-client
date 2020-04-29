import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Accordion, Button, Divider, Form, Icon, Label, Modal, Popup } from 'semantic-ui-react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-github'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { truncateString } from '../utilities'
import { API, UI } from '../enum'

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
    const { data, producer, uiSchema } = this.props
    const { activeIndex, modalOpen } = this.state

    let language = this.context.value

    const inputOption = uiSchema.input.option
    const inputValue = uiSchema.input.value
    const inputRefLink = uiSchema.input.refLink
    const inputTitle = uiSchema.input.title
    const inputIndex = uiSchema.input.index

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
                <div key={element[inputIndex.handler]}>
                  <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleAccordionClick}>
                    <Icon name='dropdown' />
                    {`${element[inputTitle.handler]} - ${UI.ZEPPELIN_PARAGRAPH_INDEX[language]}: ${element[inputIndex.handler]}`}
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === index}>
                    <Form>
                      <Popup basic flowing trigger={<Label color='teal' tag content={element[inputOption.handler]} />}>
                        <Icon color='blue' name='info circle' />
                        {inputOption.description}
                      </Popup>
                      <Divider hidden style={{ marginBottom: 0 }} />
                      {typeof (element[inputRefLink.handler]) !== 'undefined' &&
                      <Form.Field>
                        <label>
                          <Popup basic flowing trigger={<span>{`${inputRefLink.displayName}`}</span>}>
                            <Icon color='blue' name='info circle' />
                            {inputRefLink.description}
                          </Popup>
                        </label>
                        <Link to={`/${producer}${element[inputRefLink.handler]}/${API.VIEWS.VIEW}`}>
                          {element[inputRefLink.handler]}
                        </Link>
                      </Form.Field>
                      }
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
                          value={element[inputValue.handler]}
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
