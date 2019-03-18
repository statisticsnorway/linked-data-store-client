import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'

class FIBoolean extends Component {
  render () {
    const {error, handleChange, uiSchema, value} = this.props

    return <Form.Checkbox label={uiSchema.displayName} name={uiSchema.name} checked={value} error={!!error}
                          onChange={() => handleChange(null, {name: uiSchema.name, value: !value})} />
  }
}

export default FIBoolean
