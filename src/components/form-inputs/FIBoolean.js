import React, { Component } from 'react'
import { Form, Icon, Popup } from 'semantic-ui-react'

class FIBoolean extends Component {
  render () {
    const {error, handleChange, uiSchema, value} = this.props

    return (
      <Popup basic flowing
             trigger={
               <Form.Checkbox name={uiSchema.name} checked={value} error={!!error}
                              onChange={() => handleChange(null, {name: uiSchema.name, value: !value})}
                              label={uiSchema.displayName} />
             }>
        <Icon color='blue' name='info circle' />
        {uiSchema.description}
      </Popup>
    )
  }
}

export default FIBoolean
