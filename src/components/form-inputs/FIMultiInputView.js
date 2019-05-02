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

    return (
      <Form.Field required={uiSchema.input.required} error={!!error}>
        <label>
          <Popup basic flowing trigger={<span>{`${uiSchema.displayName} `}</span>}>
            <Icon color='blue' name='info circle' />
            {uiSchema.description}
          </Popup>
          <Popup basic flowing trigger={<Icon link name='copy outline' color='green' onClick={addItem} />}>
            <Icon color='blue' name='info circle' />
            {MESSAGES.ADD_ITEM[language]}
          </Popup>
        </label>
        {value.map((item, index) => {
            const option = uiSchema.input.option
            const value = uiSchema.input.value

            return (
              <Form.Group key={index} style={outline === index ? style : {}}>
                {value.multiple &&
                <Popup basic flowing
                       trigger={<Icon link fitted name='copy outline' color='green' onMouseOut={hideOutlines}
                                      onMouseOver={showOutline.bind(this, index)}
                                      onClick={addValue.bind(this, index)} />}>
                  <Icon color='blue' name='info circle' />
                  {MESSAGES.ADD_VALUE[language]}
                </Popup>
                }
                <Form.Select fluid placeholder={truncateString(option.displayName, 17)} width={6}
                             multiple={option.multiple} options={options} clearable value={item[option.handler]}
                             onChange={mergeShallowChange.bind(this, index, option.handler, value.handler)} />
                {value.multiple &&
                <Form.Field width={10}>
                  <List>
                    {item[value.handler].map((innerValue, innerIndex) =>
                      <List.Item key={innerIndex}
                                 style={innerOutline[0] === index && innerOutline[1] === innerIndex ? style : {}}>
                        <Popup basic flowing
                               trigger={<List.Icon link name='close' color='red' onMouseOut={hideInnerOutlines}
                                                   onClick={removeValue.bind(this, index, innerIndex)}
                                                   onMouseOver={showInnerOutline.bind(this, index, innerIndex)} />}>
                          <Icon color='blue' name='info circle' />
                          {MESSAGES.REMOVE_VALUE[language]}
                        </Popup>
                        <List.Content>
                          <Input placeholder={truncateString(value.displayName, 17)} value={innerValue}
                                 onChange={mergeDeepChange.bind(this, index, innerIndex)} />
                        </List.Content>
                      </List.Item>
                    )}
                  </List>
                </Form.Field>
                }
                {!value.multiple &&
                <TextArea rows={2} placeholder={truncateString(value.displayName, 17)} width={10}
                          value={item[value.handler]} style={{ marginRight: '0.5em' }}
                          onChange={mergeShallowChange.bind(this, index, value.handler, option.handler)} />
                }
                <Popup basic flowing
                       trigger={<Icon link name='delete' color='red' fitted onClick={removeItem.bind(this, index)}
                                      onMouseOver={showOutline.bind(this, index)}
                                      onMouseOut={hideOutlines} />}>
                  <Icon color='blue' name='info circle' />
                  {MESSAGES.REMOVE_ITEM[language]}
                </Popup>
                <Divider hidden style={{ marginBottom: 0 }} />
              </Form.Group>
            )
          }
        )}
      </Form.Field>
    )
  }
}

FIMultiInputView.contextType = LanguageContext

export default FIMultiInputView
