import React, { Component } from 'react'

import FIMultiInputView from './FIMultiInputView'

class FIMultiInput extends Component {
  state = {
    innerOutline: [-1, -1],
    options: []
  }

  componentDidMount () {
    const { uiSchema } = this.props

    if (uiSchema.input.option.hasOwnProperty('options')) {
      this.setState({ options: uiSchema.input.option.options })
    }

    if (uiSchema.input.option.hasOwnProperty('endpoints')) {
      // TODO: Logic to fetch options data
    }
  }

  addItem = () => {
    const { handleChange, uiSchema, value } = this.props

    handleChange(null, { name: uiSchema.input.name, value: [...value, this.props.uiSchema.input.emptyValue[0]] })
  }

  removeItem = (indexToRemove) => {
    const { handleChange, uiSchema, value } = this.props

    handleChange(null, { name: uiSchema.input.name, value: value.filter((item, index) => index !== indexToRemove) })
  }

  addValue = (indexToAddTo) => {
    const { handleChange, uiSchema, value } = this.props
    const clonedValue = JSON.parse(JSON.stringify(value))

    clonedValue[indexToAddTo][uiSchema.input.value.handler].push('')

    handleChange(null, { name: uiSchema.input.name, value: clonedValue })
  }

  removeValue = (indexToRemoveFrom, indexToRemove) => {
    const { handleChange, uiSchema, value } = this.props
    const handler = uiSchema.input.value.handler
    const clonedValue = JSON.parse(JSON.stringify(value))

    clonedValue[indexToRemoveFrom][handler] = value[indexToRemoveFrom][handler]
      .filter((value, index) => index !== indexToRemove)

    handleChange(null, { name: uiSchema.input.name, value: clonedValue })
  }

  mergeShallowChange = (indexToEdit, handler, keeper, event, data) => {
    const { handleChange, uiSchema, value } = this.props
    const clonedValue = JSON.parse(JSON.stringify(value))

    clonedValue[indexToEdit] = { [handler]: data.value, [keeper]: clonedValue[indexToEdit][keeper] }

    handleChange(null, { name: uiSchema.input.name, value: clonedValue })
  }

  mergeDeepChange = (indexToEdit, innerIndexToEdit, event, data) => {
    const { handleChange, uiSchema, value } = this.props
    const clonedValue = JSON.parse(JSON.stringify(value))
    const handler = uiSchema.input.value.handler

    clonedValue[indexToEdit][handler][innerIndexToEdit] = data.value

    handleChange(null, { name: uiSchema.input.name, value: clonedValue })
  }

  showOutline = (index) => {
    this.setState({ outline: index })
  }

  hideOutlines = () => {
    this.setState({ outline: -1 })
  }

  showInnerOutline = (index, innerIndex) => {
    this.setState({ innerOutline: [index, innerIndex] })
  }

  hideInnerOutlines = () => {
    this.setState({ innerOutline: [-1, -1] })
  }

  render () {
    return <FIMultiInputView {...this.state} {...this.props} addItem={this.addItem} removeItem={this.removeItem}
                             addValue={this.addValue} removeValue={this.removeValue}
                             mergeShallowChange={this.mergeShallowChange} mergeDeepChange={this.mergeDeepChange}
                             showOutline={this.showOutline} hideOutlines={this.hideOutlines}
                             showInnerOutline={this.showInnerOutline} hideInnerOutlines={this.hideInnerOutlines} />
  }
}

export default FIMultiInput
