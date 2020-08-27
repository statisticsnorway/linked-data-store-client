import React, { Component } from 'react'
import nb from 'date-fns/locale/nb'
import { registerLocale, setDefaultLocale } from 'react-datepicker'

import AppView from './AppView'
import { extractDomainFromString, getData } from './utilities'
import { extractFromVersionObject } from './producers/Producers'
import { LanguageContext } from './utilities/context/LanguageContext'
import { API } from './enum'

registerLocale(API.DEFAULT_LANGUAGE, nb)

class App extends Component {
  state = {
    error: false,
    fresh: true,
    languageCode: API.DEFAULT_LANGUAGE,
    lds: {
      namespace: API.DEFAULT_NAMESPACE,
      producer: API.DEFAULT_PRODUCER,
      url: process.env.REACT_APP_LDS,
      user: 'Test user'
    },
    ready: false,
    schemaModel: {}
  }

  componentDidMount () {
    const { languageCode } = this.state

    setDefaultLocale(languageCode)

    this.loadDomains()
  }

  loadDomains () {
    const { lds } = this.state

    getData(`${lds.url}/${lds.namespace}${API.SCHEMA_QUERY}`).then(response => {
      const domains = response.map(path => ({
        name: extractDomainFromString(path),
        route: `/${lds.producer}/${extractDomainFromString(path)}`
      }))

      if (lds.producer === API.DEFAULT_PRODUCER) {
        getData(`${lds.url}/${lds.namespace}/${API.DEFAULT_VERSION_OBJECT.NAME}${API.SCHEMA_QUERY}`).then(response => {
          this.setState({
            domains: domains,
            error: false,
            fresh: true,
            ready: true,
            schemaModel: extractFromVersionObject(response, lds.producer)
          })
        }).catch(error => {
          if (error !== 'Not a managed resource name: "About"') {
            this.setState({
              error: error.toString(),
              fresh: true,
              ready: true
            })
          } else {
            this.setState({
              domains: domains,
              error: false,
              fresh: true,
              ready: true
            })
          }
        })
      } else {
        this.setState({
          domains: domains,
          error: false,
          fresh: true,
          ready: true
        })
      }
    }).catch(error => {
      this.setState({
        error: error.toString(),
        fresh: true,
        ready: true
      })
    })
  }

  changeSettings = (event, data) => {
    const { lds } = this.state

    this.setState({
      fresh: false,
      lds: { ...lds, [data.name]: data.value }
    })
  }

  refreshSettings = () => {
    this.setState({ ready: false }, () => {
      this.loadDomains()
    })
  }

  setLanguage = (languageCode) => {
    setDefaultLocale(languageCode)

    this.setState({ languageCode: languageCode })
  }

  render () {
    const { languageCode } = this.state

    return (
      <LanguageContext.Provider value={{
        value: languageCode,
        setLanguage: (languageCode) => this.setLanguage(languageCode)
      }}>
        <AppView
          {...this.state}
          changeSettings={this.changeSettings}
          refreshSettings={this.refreshSettings}
        />
      </LanguageContext.Provider>
    )
  }
}

export default App
