import React, { Component } from 'react'

import DomainSingleEdit from './DomainSingleEdit'
import DomainSingleView from './DomainSingleView'
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
    const {params} = this.props

    if (prevProps.params.id !== params.id) {
      this.reload()
    }
  }

  load = () => {
    const {domain, languageCode, lds, params} = this.props

    getData(`${lds.url}${domain.path}`).then(schema => {
      const uiSchema = createUiSchema(schema.definitions, lds, domain.name)
      const defaultData = createDefaultData(schema.definitions[domain.name].properties, uiSchema)

      if (params.id === 'new') {
        this.setState({
          data: defaultData,
          error: false,
          schema: schema.definitions[domain.name],
          ready: true,
          uiSchema: uiSchema
        })
      } else {
        getData(`${lds.url}/${lds.namespace}/${domain.name}/${params.id}`).then(data => {
          if (Array.isArray(data) && data.length < 1) {
            this.setState({
              error: MESSAGES.NOTHING_FOUND[languageCode],
              ready: true
            })
          } else {
            this.setState({
              data: {...defaultData, ...data},
              error: false,
              schema: schema.definitions[domain.name],
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
    const {[data.name]: deleted, ...errors} = this.state.errors

    this.setState({
      data: {...this.state.data, [data.name]: data.value},
      errors: errors,
      fresh: false
    })
  }

  setErrors = (errors) => {
    this.setState({errors: errors})
  }

  render () {
    const {domain, languageCode, lds, location, params} = this.props

    if (params.view === 'edit') {
      return <DomainSingleEdit {...this.state} domain={domain} handleChange={this.handleChange}
                               languageCode={languageCode} lds={lds} setErrors={this.setErrors} />
    }

    if (params.view === 'view') {
      return <DomainSingleView {...this.state} domain={domain} languageCode={languageCode} lds={lds}
                               location={location} />
    }

    return null
  }
}

export default DomainSingle
