import React, { Component } from 'react'

import { LanguageContext } from '../../utilities/context/LanguageContext'

class FIProcessStepCodeBlockDetailsContent extends Component {
  componentDidMount () {
    const { uiSchema, value } = this.props

    console.log(uiSchema)
    console.log(value)
  }

  render () {
    return (
      <div>

      </div>
    )
  }
}

FIProcessStepCodeBlockDetailsContent.contextType = LanguageContext

export default FIProcessStepCodeBlockDetailsContent
