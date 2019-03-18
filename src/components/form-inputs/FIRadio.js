import React, { Component } from 'react'
import { Form, Radio } from 'semantic-ui-react'

class FIRadio extends Component {
  render () {
    const {error, handleChange, uiSchema, value} = this.props

    return (
      <Form.Field required={uiSchema.input.required} error={!!error}>
        <label>{uiSchema.displayName}</label>
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
