import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import { Divider, Dropdown, Menu } from 'semantic-ui-react'

import { DomainList, DomainSingle, Import, Settings } from './pages'
import { LANGUAGES, UI } from './enum'

class AppView extends Component {
  render () {
    const {error, fresh, languageCode, lds} = this.props
    const {changeLanguage, domains, ready, ...settings} = this.props

    return (
      <div>
        <Menu borderless color='blue' size='huge'>
          <Menu.Item header as={Link} to='/' content={UI.HEADER[languageCode]} />
          <Menu.Item
            icon={{name: ready ? 'circle' : 'spinner', color: error === false ? 'green' : 'red', loading: !ready}}
          />
          <Dropdown item scrolling disabled={error !== false} text={UI.DOMAINS[languageCode]}>
            <Dropdown.Menu>
              {fresh && ready && !error && domains.map(domain =>
                <Dropdown.Item key={domain.name} as={Link} to={`/${domain.route}`} content={domain.name} />
              )}
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item as={Link} to='/import' disabled={error !== false} content={UI.IMPORT[languageCode]} />
          <Menu.Menu position='right'>
            <Menu.Item as={Link} to='/settings' icon={{name: 'setting', color: 'teal'}} />
            <Dropdown item text={`${UI.LANGUAGE[languageCode]} (${UI.LANGUAGE_CHOICE[languageCode]})`}>
              <Dropdown.Menu>
                {Object.keys(LANGUAGES).map(language =>
                  <Dropdown.Item key={language} name={LANGUAGES[language].languageCode}
                                 content={UI[language][languageCode]} onClick={changeLanguage} />
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
        <Route path='/(settings|)' exact render={() => <Settings {...settings} />} />
        {fresh && ready && !error &&
        <div>
          <Route path='/import' exact render={() => <Import languageCode={languageCode} lds={lds} />} />
          {domains.map(domain =>
            <Route key={`${domain.name}Single`} exact path={`/${domain.route}/:id/:view`} render={({location, match}) =>
              <DomainSingle domain={domain} languageCode={languageCode} lds={lds} location={location}
                            params={match.params} />
            } />
          )}
          {domains.map(domain =>
            <Route key={`${domain.name}List`} exact path={`/${domain.route}`} render={() =>
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
