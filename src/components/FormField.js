import React, { Component } from 'react'
import { Divider } from 'semantic-ui-react'

import {
  FIBoolean,
  FICodeBlock,
  FIDate,
  FIDropdown,
  FIMultiCodeBlock,
  FIMultiInput,
  FINumber,
  FIRadio,
  FIText
} from './form-inputs'

const formComponents = {
  boolean: FIBoolean,
  codeBlock: FICodeBlock,
  dropdown: FIDropdown,
  date: FIDate,
  multiCodeBlock: FIMultiCodeBlock,
  multiInput: FIMultiInput,
  number: FINumber,
  radio: FIRadio,
  text: FIText
}

class FormField extends Component {
  render () {
    const FormComponent = formComponents[this.props.uiSchema.input.type]

    return (
      <>
        <FormComponent {...this.props} />
        <Divider hidden />
      </>
    )
  }
}

export default FormField
