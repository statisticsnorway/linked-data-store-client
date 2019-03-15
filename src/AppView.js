import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Divider } from 'semantic-ui-react'

import AppMenu from './AppMenu'
import { DomainList, DomainSingle, Explore, Import, Settings } from './pages'

class AppView extends Component {
  render () {
    const {error, languageCode, lds} = this.props
    const {changeLanguage, domains, ready, ...settings} = this.props

    return (
      <div>
        <AppMenu changeLanguage={changeLanguage} domains={domains} error={error} languageCode={languageCode}
                 ready={ready} />
        <Route path='/(settings|)' exact render={() => <Settings {...settings} />} />
        {ready && !error &&
        <div>
          <Route path='/import' exact render={() => <Import languageCode={languageCode} lds={lds} />} />
          <Route path='/explore' exact
                 render={() => <Explore domains={domains} languageCode={languageCode} lds={lds} />} />
          {domains.map(domain =>
            <Route key={`${domain.name}Single`} exact path={`${domain.route}/:id/:view`} render={({location, match}) =>
              <DomainSingle domain={domain} languageCode={languageCode} lds={lds} location={location}
                            params={match.params} />
            } />
          )}
          {domains.map(domain =>
            <Route key={`${domain.name}List`} exact path={`${domain.route}`} render={() =>
              <DomainList domain={domain} languageCode={languageCode} lds={lds} />
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
