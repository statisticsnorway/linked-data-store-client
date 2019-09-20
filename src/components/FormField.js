import React, { Component } from 'react'
import { Divider } from 'semantic-ui-react'

import {
  FIBoolean,
  FIDate,
  FIDropdown,
  FIMultiInput,
  FINumber,
  FIProcessStepCodeBlockDetails,
  FIRadio,
  FIText
} from './form-inputs'

const formComponents = {
  boolean: FIBoolean,
  dropdown: FIDropdown,
  date: FIDate,
  multiInput: FIMultiInput,
  number: FINumber,
  processStepCodeBlockDetails: FIProcessStepCodeBlockDetails,
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
