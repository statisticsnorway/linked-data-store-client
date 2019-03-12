import React, { Component } from 'react'
import nb from 'date-fns/locale/nb'
import { registerLocale, setDefaultLocale } from 'react-datepicker'

import AppView from './AppView'
import { extractDomainFromString, getData } from './utilities'

registerLocale('nb', nb)

class App extends Component {
  state = {
    error: false,
    fresh: true,
    languageCode: 'nb',
    lds: {
      namespace: 'data',
      producer: 'gsim',
      url: process.env.REACT_APP_LDS === undefined ? 'http://localhost:9090' : process.env.REACT_APP_LDS,
      user: 'Test user'
    },
    ready: false
  }

  componentDidMount () {
    this.loadDomains()
  }

  loadDomains () {
    const {lds} = this.state

    getData(`${lds.url}/${lds.namespace}?schema`).then(response => {
      const domains = response.map(path => ({
        name: extractDomainFromString(path),
        path: path,
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

  changeLanguage = (event, data) => {
    setDefaultLocale(data.name)

    this.setState({languageCode: data.name})
  }

  changeSettings = (event, data) => {
    this.setState({
      fresh: false,
      lds: {...this.state.lds, [data.name]: data.value}
    })
  }

  refreshSettings = () => {
    this.setState({ready: false}, () => this.loadDomains())
  }

  render () {
    return (
      <AppView
        {...this.state}
        changeLanguage={this.changeLanguage}
        changeSettings={this.changeSettings}
        refreshSettings={this.refreshSettings}
      />
    )
  }
}

export default App
