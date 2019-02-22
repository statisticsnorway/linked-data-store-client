import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'

import { truncateString } from '../../utilities'

class FINumber extends Component {
  render () {
    const {error, handleChange, uiSchema, value} = this.props

    return <Form.Input type='number' icon={{name: 'hashtag', color: 'teal'}} iconPosition='left' name={uiSchema.name}
                       label={uiSchema.displayName} placeholder={truncateString(uiSchema.displayName)} value={value}
                       onChange={handleChange} required={uiSchema.input.required} error={!!error} />
  }
}

export default FINumber
