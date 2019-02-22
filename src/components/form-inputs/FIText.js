import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'

import { truncateString } from '../../utilities'

class FIText extends Component {
  render () {
    const {error, handleChange, uiSchema, value} = this.props

    return <Form.TextArea rows={2} label={uiSchema.displayName} name={uiSchema.name} required={uiSchema.input.required}
                          placeholder={truncateString(uiSchema.displayName)} value={value} onChange={handleChange}
                          error={!!error} />
  }
}

export default FIText
