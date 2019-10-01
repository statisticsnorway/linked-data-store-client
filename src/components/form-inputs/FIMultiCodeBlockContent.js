import React, { Component } from 'react'
import { Accordion, Dropdown, Form, Icon, Popup } from 'semantic-ui-react'
import AceEditor from 'react-ace'

import 'brace/mode/python'
import 'brace/theme/github'

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

    return (
      <Accordion fluid>
        {/* We may want to sort this by element.codeBlockIndex */}
        {value.map((element, index) =>
          <div key={element.codeBlockIndex}>
            <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleAccordionClick}>
              <Icon name='dropdown' />
              {`${UI.ZEPPELIN_PARAGRAPH_INDEX[language]}: ${element.codeBlockIndex}`}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === index}>
              <Form>
                <Form.Field required={inputOption.required}>
                  <label>
                    <Popup basic flowing trigger={<span>{`${inputOption.displayName} `}</span>}>
                      <Icon color='blue' name='info circle' />
                      {inputOption.description}
                    </Popup>
                  </label>
                  <Dropdown fluid selection placeholder={truncateString(inputOption.displayName)}
                            multiple={inputOption.multiple} options={inputOption.options} clearable
                            value={element.codeBlockType}
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
                    name={uiSchema.input.name}
                    value={element.codeBlockValue}
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
