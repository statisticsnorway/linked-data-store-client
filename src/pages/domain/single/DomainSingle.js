import React, { Component } from 'react'

import DomainSingleEdit from './DomainSingleEdit'
import DomainSingleView from './DomainSingleView'
import { LanguageContext } from '../../../utilities/context/LanguageContext'
import { createDefaultData, createUiSchema, getData } from '../../../utilities'
import { API, MESSAGES } from '../../../enum'

const { v4: uuidv4 } = require('uuid')

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

    getData(`${lds.url}/${lds.namespace}/${params.domain}${API.SCHEMA_QUERY}`).then(schema => {
      const uiSchema = createUiSchema(schema.definitions, lds, params.domain)
      const defaultData = createDefaultData(schema.definitions[params.domain].properties, uiSchema)

      if (params.id === API.VIEWS.NEW) {
        defaultData.id = uuidv4()

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
            error: error.toString(),
            ready: true
          })
        })
      }
    }).catch(error => {
      this.setState({
        error: error.toString(),
        ready: true
      })
    })
  }

  reload = () => {
    this.setState({
      error: false,
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

    if (params.view === API.VIEWS.EDIT) {
      return <DomainSingleEdit {...this.state} domain={params.domain} handleChange={this.handleChange} lds={lds}
                               setErrors={this.setErrors} isNew={params.id === API.VIEWS.NEW} />
    }

    if (params.view === API.VIEWS.VIEW) {
      return <DomainSingleView {...this.state} domain={params.domain} lds={lds} />
    }

    return null
  }
}

DomainSingle.contextType = LanguageContext

export default DomainSingle
