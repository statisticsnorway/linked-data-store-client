import React, { Component } from 'react'
import nb from 'date-fns/locale/nb'
import { registerLocale, setDefaultLocale } from 'react-datepicker'

import AppView from './AppView'
import { extractDomainFromString, getData } from './utilities'
import { LanguageContext } from './utilities/context/LanguageContext'
import { API } from './enum'

registerLocale(API.DEFAULT_LANGUAGE, nb)

class App extends Component {
  state = {
    error: false,
    fresh: true,
    languageCode: localStorage.hasOwnProperty('languageCode') ?
      localStorage.getItem('languageCode') : API.DEFAULT_LANGUAGE,
    lds: {
      namespace: localStorage.hasOwnProperty('namespace') ? localStorage.getItem('namespace') : API.DEFAULT_NAMESPACE,
      producer: localStorage.hasOwnProperty('producer') ? localStorage.getItem('producer') : API.DEFAULT_PRODUCER,
      url: localStorage.hasOwnProperty('url') ? localStorage.getItem('url') : process.env.REACT_APP_LDS,
      user: localStorage.hasOwnProperty('user') ? localStorage.getItem('user') : 'Test user'
    },
    ready: false
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

      this.setState({
        domains: domains,
        error: false,
        fresh: true,
        ready: true
      })
    }).catch(error => {
      this.setState({
        error: error,
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
    const { lds } = this.state

    this.setState({ ready: false }, () => {
      Object.keys(lds).forEach(item => {
        localStorage.setItem(item, lds[item])
      })

      this.loadDomains()
    })
  }

  setLanguage = (languageCode) => {
    setDefaultLocale(languageCode)

    this.setState({ languageCode: languageCode }, () => {
      localStorage.setItem('languageCode', languageCode)
    })
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
