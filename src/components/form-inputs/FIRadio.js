import React, { Component } from 'react'
import { Form, Icon, Popup, Radio } from 'semantic-ui-react'

class FIRadio extends Component {
  render () {
    const { error, handleChange, uiSchema, value } = this.props

    return (
      <Form.Field required={uiSchema.input.required} error={!!error}>
        <Popup basic flowing trigger={<label>{uiSchema.displayName}</label>}>
          <Icon color='blue' name='info circle' />
          {uiSchema.description}
        </Popup>
        <Form.Group>
          {uiSchema.input.options.map(option =>
            <Form.Field key={option.text} control={Radio} name={uiSchema.name} label={option.text} value={option.value}
                        checked={value === option.value} onChange={handleChange} />
          )}
        </Form.Group>
      </Form.Field>
    )
  }
}

export default FIRadio
