import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Divider } from 'semantic-ui-react'

import AppMenu from './AppMenu'
import { DomainList, DomainSingle, Explore, Import, Settings } from './pages'

class AppView extends Component {
  render () {
    const { error, lds } = this.props
    const { domains, ready, ...settings } = this.props

    return (
      <div>
        <AppMenu domains={domains} error={error} ready={ready} />
        <Route path='/(settings|)' exact render={() => <Settings {...settings} />} />
        {ready && !error &&
        <div>
          <Route path='/import' exact render={() => <Import lds={lds} />} />
          <Route path='/explore' exact render={() => <Explore domains={domains} lds={lds} />} />
          {domains.map(domain =>
            <Route key={`${domain.name}Single`} exact path={`${domain.route}/:id/:view`}
                   render={({ location, match }) =>
                     <DomainSingle domain={domain} lds={lds} location={location} params={match.params} />} />
          )}
          {domains.map(domain =>
            <Route key={`${domain.name}List`} exact path={`${domain.route}`} render={() =>
              <DomainList domain={domain} lds={lds} />
            } />
          )}
        </div>
        }
        <Divider hidden />
      </div>
    )
  }
}

export default AppView
