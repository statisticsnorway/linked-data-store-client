import React, { Component } from 'react'
import { Divider, Form, Icon, Input, List, Popup, TextArea } from 'semantic-ui-react'

import { LanguageContext } from '../../utilities/context/LanguageContext'
import { truncateString } from '../../utilities'
import { MESSAGES } from '../../enum'

const style = { outline: '1px solid #00b5ad', outlineOffset: '2px' }

class FIMultiInputView extends Component {
  render () {
    const { error, innerOutline, options, outline, uiSchema, value } = this.props
    const { addItem, removeItem, addValue, removeValue } = this.props
    const { showOutline, hideOutlines, showInnerOutline, hideInnerOutlines } = this.props
    const { mergeShallowChange, mergeDeepChange } = this.props

    let language = this.context.value

    const inputOption = uiSchema.input.option
    const inputValue = uiSchema.input.value

    return (
      <Form.Field required={uiSchema.input.required} error={!!error}>
        <label>
          <Popup basic flowing trigger={<span>{`${uiSchema.displayName} `}</span>}>
            <Icon color='blue' name='info circle' />
            {uiSchema.description}
          </Popup>
          <Popup basic flowing trigger={
            <Icon link name='copy outline' color='green' onClick={addItem} data-testid='add-input-item' />
          }>
            <Icon color='blue' name='info circle' />
            {MESSAGES.ADD_ITEM[language]}
          </Popup>
        </label>
        {value.map((item, index) =>
          <Form.Group key={index} style={outline === index ? style : {}}>
            {inputValue.multiple &&
            <Popup basic flowing
                   trigger={<Icon link fitted name='copy outline' color='green' onMouseOut={hideOutlines}
                                  onMouseOver={showOutline.bind(this, index)}
                                  onClick={addValue.bind(this, index)} data-testid='add-input-value' />}>
              <Icon color='blue' name='info circle' />
              {MESSAGES.ADD_VALUE[language]}
            </Popup>
            }
            {options && options.length > 0
                ? <Form.Select fluid placeholder={truncateString(inputOption.displayName, 17)} width={6}
                               multiple={inputOption.multiple} options={options} clearable value={item[inputOption.handler]}
                               onChange={mergeShallowChange.bind(this, index, inputOption.handler, inputValue.handler)} />
                : <Form.Input placeholder={truncateString(inputOption.displayName, 17)} width={10}
                              value={item[inputOption.handler]} style={{ marginRight: '0.5em' }}
                              onChange={mergeShallowChange.bind(this, index, inputOption.handler, inputValue.handler)} />
            }

            {inputValue.multiple &&
            <Form.Field width={10}>
              <List>
                {item[inputValue.handler].map((innerValue, innerIndex) =>
                  <List.Item key={innerIndex}
                             style={innerOutline[0] === index && innerOutline[1] === innerIndex ? style : {}}>
                    <Popup basic flowing
                           trigger={<List.Icon link name='close' color='red' onMouseOut={hideInnerOutlines}
                                               onClick={removeValue.bind(this, index, innerIndex)}
                                               onMouseOver={showInnerOutline.bind(this, index, innerIndex)}
                                               style={{ paddingRight: 0 }} data-testid='remove-input-value' />}>
                      <Icon color='blue' name='info circle' />
                      {MESSAGES.REMOVE_VALUE[language]}
                    </Popup>
                    <List.Content>
                      <Input placeholder={truncateString(inputValue.displayName, 17)} value={innerValue}
                             onChange={mergeDeepChange.bind(this, index, innerIndex)} />
                    </List.Content>
                  </List.Item>
                )}
              </List>
            </Form.Field>
            }
            {!inputValue.multiple &&
            <TextArea rows={2} placeholder={truncateString(inputValue.displayName, 17)} width={10}
                      value={item[inputValue.handler]} style={{ marginRight: '0.5em' }}
                      onChange={mergeShallowChange.bind(this, index, inputValue.handler, inputOption.handler)} />
            }
            <Popup basic flowing
                   trigger={<Icon link name='delete' color='red' fitted onClick={removeItem.bind(this, index)}
                                  onMouseOver={showOutline.bind(this, index)}
                                  onMouseOut={hideOutlines} data-testid='remove-input-item' />}>
              <Icon color='blue' name='info circle' />
              {MESSAGES.REMOVE_ITEM[language]}
            </Popup>
            <Divider hidden style={{ marginBottom: 0 }} />
          </Form.Group>
        )}
      </Form.Field>
    )
  }
}

FIMultiInputView.contextType = LanguageContext

export default FIMultiInputView
