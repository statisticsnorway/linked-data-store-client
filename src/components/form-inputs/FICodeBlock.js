import React, { Component } from 'react'
import { Form, Icon, Popup } from 'semantic-ui-react'
import AceEditor from 'react-ace'

import 'brace/mode/python'
import 'brace/theme/github'

import { truncateString } from '../../utilities'

class FICodeBlock extends Component {
  render () {
    const { error, handleChange, uiSchema, value } = this.props

    return (
      <Form.Field required={uiSchema.input.required} error={!!error}>
        <label>
          <Popup basic flowing trigger={<span>{uiSchema.displayName}</span>}>
            <Icon color='blue' name='info circle' />
            {uiSchema.description}
          </Popup>
        </label>
        <AceEditor
          mode='python'
          theme='github'
          fontSize={16}
          highlightActiveLine={true}
          placeholder={truncateString(uiSchema.displayName)}
          onChange={(value, event) => handleChange(null, { name: uiSchema.name, value: value })}
          name={uiSchema.name}
          value={value}
          width='100%'
          height='20em'
          editorProps={{ $blockScrolling: true }}
        />
      </Form.Field>
    )
  }
}

export default FICodeBlock
