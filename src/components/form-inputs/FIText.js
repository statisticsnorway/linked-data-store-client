import React, { Component } from 'react'
import { Form, Icon, Popup, TextArea } from 'semantic-ui-react'

import { truncateString } from '../../utilities'

class FIText extends Component {
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
        <TextArea rows={2} name={uiSchema.name} placeholder={truncateString(uiSchema.displayName)} value={value}
                  onChange={handleChange} />
      </Form.Field>
    )
  }
}

export default FIText
