import React, { Component } from 'react'
import { Form, Icon, Input, Popup } from 'semantic-ui-react'

import { truncateString } from '../../utilities'

class FINumber extends Component {
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
        <Input type='number' icon={{ name: 'hashtag', color: 'teal' }} iconPosition='left' name={uiSchema.name}
               placeholder={truncateString(uiSchema.displayName)} value={value} onChange={handleChange} />
      </Form.Field>
    )
  }
}

export default FINumber
