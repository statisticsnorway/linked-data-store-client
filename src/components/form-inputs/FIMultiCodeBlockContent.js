import React, { Component } from 'react'
import { Accordion, Dropdown, Form, Icon, Popup, TextArea } from 'semantic-ui-react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-github'

import { LanguageContext } from '../../utilities/context/LanguageContext'
import { truncateString } from '../../utilities'
import { UI } from '../../enum'

class FIMultiCodeBlockContent extends Component {
  state = { activeIndex: -1 }

  handleAccordionClick = (event, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  mergeDeepChange = (indexToEdit, handler, data) => {
    const { handleChange, uiSchema, value } = this.props
    const clonedValue = JSON.parse(JSON.stringify(value))

    clonedValue[indexToEdit][handler] = data

    handleChange(null, { name: uiSchema.input.name, value: clonedValue })
  }

  render () {
    const { uiSchema, value } = this.props
    const { activeIndex } = this.state

    let language = this.context.value

    const inputOption = uiSchema.input.option
    const inputValue = uiSchema.input.value
    const inputTitle = uiSchema.input.title
    const inputIndex = uiSchema.input.index

    return (
      <Accordion fluid>
        {/* We may want to sort this by element.codeBlockIndex */}
        {value.map((element, index) =>
          <div key={element[inputIndex.handler]}>
            <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleAccordionClick}>
              <Icon name='dropdown' />
              {`${UI.ZEPPELIN_PARAGRAPH_INDEX[language]}: ${element[inputIndex.handler]}`}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === index}>
              <Form>
                <Form.Field required={inputTitle.required}>
                  <label>
                    <Popup basic flowing trigger={<span>{`${inputTitle.displayName} `}</span>}>
                      <Icon color='blue' name='info circle' />
                      {inputTitle.description}
                    </Popup>
                  </label>
                  <TextArea rows={2} name={inputTitle.handler} placeholder={truncateString(inputTitle.displayName)}
                            value={element[inputTitle.handler]}
                            onChange={(event, data) => this.mergeDeepChange(index, inputTitle.handler, data.value)} />
                </Form.Field>
                <Form.Field required={inputOption.required}>
                  <label>
                    <Popup basic flowing trigger={<span>{`${inputOption.displayName} `}</span>}>
                      <Icon color='blue' name='info circle' />
                      {inputOption.description}
                    </Popup>
                  </label>
                  <Dropdown fluid selection placeholder={truncateString(inputOption.displayName)}
                            multiple={inputOption.multiple} options={inputOption.options} clearable
                            value={element[inputOption.handler]}
                            onChange={(event, data) => this.mergeDeepChange(index, inputOption.handler, data.value)} />
                </Form.Field>

                <Form.Field required={inputValue.required}>
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
                    placeholder={truncateString(inputValue.displayName)}
                    onChange={(data, event) => this.mergeDeepChange(index, inputValue.handler, data)}
                    name={inputValue.handler}
                    value={element[inputValue.handler]}
                    width='100%'
                    height='20em'
                    editorProps={{ $blockScrolling: true }}
                  />
                </Form.Field>
              </Form>
            </Accordion.Content>
          </div>
        )}
      </Accordion>
    )
  }
}

FIMultiCodeBlockContent.contextType = LanguageContext

export default FIMultiCodeBlockContent
