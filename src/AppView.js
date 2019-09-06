import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import AppMenu from './AppMenu'
import AppFooter from './AppFooter'
import { DomainList, DomainSingle, Explore, Import, Settings } from './pages'

const footerStyleHelp = {
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
}

class AppView extends Component {
  render () {
    const { error, lds, ready } = this.props
    const { domains, ...settings } = this.props

    return (
      <div style={footerStyleHelp}>
        <AppMenu domains={domains} error={error} ready={ready} />
        <div style={{ flex: 1 }}>
          <Route path='/(settings|)' exact render={() => <Settings {...settings} />} />
          {ready && !error &&
          <>
            <Route exact path='/import' render={() => <Import lds={lds} />} />
            <Route exact path='/explore' render={() => <Explore domains={domains} lds={lds} />} />
            <Route exact path={`/:producer/:domain/:id/:view`}
                   render={({ match }) => <DomainSingle lds={lds} params={match.params} />} />
            <Route exact path={`/:producer/:domain`} render={({ location, match }) =>
              <DomainList lds={lds} location={location} params={match.params} />
            } />
          </>
          }
        </div>
        <AppFooter />
      </div>
    )
  }
}

export default AppView
