import React, { Component } from 'react'

import FIDateView from './FIDateView'

class FIDate extends Component {
  addItem = () => {
    const {handleChange, uiSchema, value} = this.props

    handleChange(null, {name: uiSchema.name, value: [...value, this.props.uiSchema.input.emptyValue[0]]})
  }

  removeItem = (indexToRemove) => {
    const {handleChange, uiSchema, value} = this.props

    handleChange(null, {name: uiSchema.name, value: value.filter((item, index) => index !== indexToRemove)})
  }

  mergeShallowChange = (date) => {
    const {handleChange, uiSchema} = this.props

    handleChange(null, {name: uiSchema.name, value: date})
  }

  mergeDeepChange = (index, date) => {
    const {handleChange, uiSchema, value} = this.props
    const clonedValue = value.slice()

    clonedValue[index] = date

    handleChange(null, {name: uiSchema.name, value: clonedValue})
  }

  showOutline = (index) => {
    this.setState({outline: index})
  }

  hideOutlines = () => {
    this.setState({outline: -1})
  }

  render () {
    return <FIDateView {...this.state} {...this.props} addItem={this.addItem} removeItem={this.removeItem}
                       mergeShallowChange={this.mergeShallowChange} mergeDeepChange={this.mergeDeepChange}
                       showOutline={this.showOutline} hideOutlines={this.hideOutlines} />
  }
}

export default FIDate
