import React, { Component } from 'react'

import DomainSingleEdit from './DomainSingleEdit'
import DomainSingleView from './DomainSingleView'
import { LanguageContext } from '../../../utilities/context/LanguageContext'
import { createDefaultData, createUiSchema, getData } from '../../../utilities'
import { MESSAGES } from '../../../enum'

class DomainSingle extends Component {
  state = {
    error: false,
    errors: {},
    fresh: true,
    ready: false
  }

  componentDidMount () {
    this.load()
  }

  componentDidUpdate (prevProps) {
    const { params } = this.props

    if (prevProps.params.id !== params.id) {
      this.reload()
    }
  }

  load = () => {
    const { lds, params } = this.props

    let language = this.context.value

    getData(`${lds.url}/${lds.namespace}/${params.domain}?schema`).then(schema => {
      const uiSchema = createUiSchema(schema.definitions, lds, params.domain)
      const defaultData = createDefaultData(schema.definitions[params.domain].properties, uiSchema)

      if (params.id === 'new') {
        this.setState({
          data: defaultData,
          error: false,
          schema: schema.definitions[params.domain],
          ready: true,
          uiSchema: uiSchema
        })
      } else {
        getData(`${lds.url}/${lds.namespace}/${params.domain}/${params.id}`).then(data => {
          if (Array.isArray(data) && data.length < 1) {
            this.setState({
              error: MESSAGES.NOTHING_FOUND[language],
              ready: true
            })
          } else {
            this.setState({
              data: { ...defaultData, ...data },
              error: false,
              schema: schema.definitions[params.domain],
              ready: true,
              uiSchema: uiSchema
            })
          }
        }).catch(error => {
          this.setState({
            error: error,
            ready: true
          })
        })
      }
    }).catch(error => {
      this.setState({
        error: error,
        ready: true
      })
    })
  }

  reload = () => {
    this.setState({
      errors: {},
      fresh: true,
      ready: false
    }, () => {
      this.load()
    })
  }

  handleChange = (event, data) => {
    const { [data.name]: deleted, ...errors } = this.state.errors

    this.setState({
      data: { ...this.state.data, [data.name]: data.value },
      errors: errors,
      fresh: false
    })
  }

  setErrors = (errors) => {
    this.setState({ errors: errors })
  }

  render () {
    const { lds, params } = this.props

    if (params.view === 'edit') {
      return <DomainSingleEdit {...this.state} domain={params.domain} handleChange={this.handleChange} lds={lds}
                               setErrors={this.setErrors} />
    }

    if (params.view === 'view') {
      return <DomainSingleView {...this.state} domain={params.domain} lds={lds} />
    }

    return null
  }
}

DomainSingle.contextType = LanguageContext

export default DomainSingle
