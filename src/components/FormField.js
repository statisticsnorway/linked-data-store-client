import React, { Component } from 'react'

import { FIBoolean, FIDate, FIDropdown, FIMultiInput, FINumber, FIRadio, FIText } from './form-inputs'
import { Divider } from 'semantic-ui-react'

const formComponents = {
  boolean: FIBoolean,
  dropdown: FIDropdown,
  date: FIDate,
  multiInput: FIMultiInput,
  number: FINumber,
  radio: FIRadio,
  text: FIText
}

class FormField extends Component {
  render () {
    const FormComponent = formComponents[this.props.uiSchema.input.type]

    return (
      <div>
        <FormComponent {...this.props} />
        <Divider hidden />
      </div>
    )
  }
}

export default FormField
