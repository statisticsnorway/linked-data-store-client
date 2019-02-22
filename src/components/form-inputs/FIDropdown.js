import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import FIDropdownView from './FIDropdownView'
import { extractStringFromObject, getData } from '../../utilities'
import { ERRORS } from '../../enum'

class FIDropdown extends Component {
  state = {
    loading: true,
    options: [],
    problem: false,
    warning: false
  }

  componentDidMount () {
    const {languageCode, uiSchema} = this.props

    if (uiSchema.input.hasOwnProperty('options')) {
      this.setState({
        loading: false,
        options: uiSchema.input.options
      })
    } else if (uiSchema.input.hasOwnProperty('links')) {
      this.loadOptions()
    } else {
      this.setState({
        loading: false,
        warning: ERRORS.NO_OPTIONS[languageCode]
      })
    }
  }

  loadOptions = () => {
    this.setState({loading: true}, () => {
      const {languageCode, lds, uiSchema, value} = this.props
      const links = uiSchema.input.links.length

      Promise.all(
        uiSchema.input.links.map(link => {
          return new Promise(resolve => {
            getData(link).then(response => {
              if (Array.isArray(response)) {
                const options = response.map(item => {
                  const domain = link.substring(link.lastIndexOf('/') + 1)
                  const value = `/${domain}/${item.id}`
                  const text = `${extractStringFromObject(item.name, lds.producer, languageCode)} ${links > 1 ? ` (${domain})` : ''}`

                  return {text: text, value: value}
                })

                resolve(options)
              } else {
                const options = []
                const domain = link.substring(link.lastIndexOf('/') + 1)
                const value = `/${domain}/${response.id}`
                const text = `${extractStringFromObject(response.name, lds.producer, languageCode)} ${links > 1 ? ` (${domain})` : ''}`
                const option = {text: text, value: value}

                options.push(option)

                resolve(options)
              }
            }).catch(error => {
              this.setState({
                loading: false,
                problem: error,
                warning: false
              })
            })
          })
        })
      ).then(allOptions => {
        const options = [].concat.apply([], allOptions)
        let warning = false

        if (options.length === 0) {
          warning = ERRORS.NO_OPTIONS[languageCode]
        } else {
          if (uiSchema.input.multiple && value.length > 0) {
            if (!options.some(r => value.includes(r.value))) {
              warning = ERRORS.MISSING_LINK[languageCode]
            }
          }

          if (!uiSchema.input.multiple && value !== '') {
            if (!options.some(r => value === r.value)) {
              warning = ERRORS.MISSING_LINK[languageCode]
            }
          }
        }

        this.setState({
          loading: false,
          options: options,
          problem: false,
          warning: warning
        })
      })
    })
  }

  handleExternalClick = () => {
    const {lds, value} = this.props

    this.setState({
      redirect: true,
      redirectRoute: `/${lds.producer}${value}/view`
    })
  }

  handleLabelClick = (event, data) => {
    const {lds} = this.props

    this.setState({
      redirect: true,
      redirectRoute: `/${lds.producer}${data.value}/view`
    })
  }

  render () {
    const {redirect, redirectRoute} = this.state

    if (redirect) {
      return <Redirect exact push to={`${redirectRoute}`} />
    } else {
      return <FIDropdownView {...this.state} {...this.props} loadOptions={this.loadOptions}
                             handleExternalClick={this.handleExternalClick} handleLabelClick={this.handleLabelClick} />
    }
  }
}

export default FIDropdown
