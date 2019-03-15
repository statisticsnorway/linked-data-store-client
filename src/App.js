import React, { Component } from 'react'
import nb from 'date-fns/locale/nb'
import { registerLocale, setDefaultLocale } from 'react-datepicker'

import AppView from './AppView'
import { extractDomainFromString, getData } from './utilities'

registerLocale('nb', nb)

const ldsEndpoint = process.env.NODE_ENV === 'production' ? 'https://lds.staging.ssbmod.net' : 'http://localhost:9090'

class App extends Component {
  state = {
    error: false,
    fresh: true,
    languageCode: localStorage.hasOwnProperty('languageCode') ? localStorage.getItem('languageCode') : 'nb',
    lds: {
      namespace: localStorage.hasOwnProperty('namespace') ? localStorage.getItem('namespace') : 'ns',
      producer: localStorage.hasOwnProperty('producer') ? localStorage.getItem('producer') : 'gsim',
      url: localStorage.hasOwnProperty('url') ? localStorage.getItem('url') : ldsEndpoint,
      user: localStorage.hasOwnProperty('user') ? localStorage.getItem('user') : 'Test user'
    },
    ready: false
  }

  componentDidMount () {
    setDefaultLocale(this.state.languageCode)

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

    this.setState({languageCode: data.name}, () => {
      localStorage.setItem('languageCode', data.name)
    })
  }

  changeSettings = (event, data) => {
    this.setState({
      fresh: false,
      lds: {...this.state.lds, [data.name]: data.value}
    })
  }

  refreshSettings = () => {
    this.setState({ready: false}, () => {
      Object.keys(this.state.lds).forEach(item => {
        localStorage.setItem(item, this.state.lds[item])
      })

      this.loadDomains()
    })
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
