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
    const { error, lds } = this.props
    const { domains, ready, ...settings } = this.props

    return (
      <div style={footerStyleHelp}>
        <AppMenu domains={domains} error={error} ready={ready} />
        <Route path='/(settings|)' exact render={() => <Settings {...settings} />} />
        {ready && !error &&
        <div style={{ flex: 1 }}>
          <Route path='/import' exact render={() => <Import lds={lds} />} />
          <Route path='/explore' exact render={() => <Explore domains={domains} lds={lds} />} />
          {domains.map(domain =>
            <Route key={`${domain.name}Single`} exact path={`${domain.route}/:id/:view`}
                   render={({ match }) => <DomainSingle domain={domain} lds={lds} params={match.params} />} />
          )}
          {domains.map(domain =>
            <Route key={`${domain.name}List`} exact path={domain.route} render={({ location }) =>
              <DomainList domain={domain} lds={lds} location={location} />
            } />
          )}
        </div>
        }
        <AppFooter />
      </div>
    )
  }
}

export default AppView
