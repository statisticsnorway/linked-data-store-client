import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, Input, Menu } from 'semantic-ui-react'

import { LanguageContext, languages } from './utilities/context/LanguageContext'
import { UI } from './enum'

class AppMenu extends Component {
  state = {
    search: ''
  }

  clearSearch = () => {
    this.setState({ search: '' })
  }

  handleSearch = (event, data) => {
    this.setState({ search: data.value })
  }

  render () {
    const { search } = this.state
    const { domains, error, ready } = this.props

    let language = this.context.value

    return (
      <Menu borderless color='blue' size='huge'>
        <Menu.Item header as={Link} to='/' content={UI.HEADER[language]} />
        <Menu.Item icon={{
          name: ready ? 'circle' : 'spinner', color: error === false ? 'green' : 'red',
          loading: !ready, 'data-testid': 'health'
        }}
        />
        <Dropdown item scrolling disabled={!ready || error !== false}
                  text={`${UI.DOMAINS[language]} (${ready && !error ? domains.length : '...'})`}>
          <Dropdown.Menu>
            <Input icon='search' iconPosition='left' placeholder={UI.SEARCH[language]} value={search}
                   onChange={this.handleSearch} onClick={event => event.stopPropagation()} />
            <Dropdown.Divider />
            {ready && error === false && domains.filter(domain =>
              domain.name.toUpperCase().startsWith(search.toUpperCase()))
              .map(domain => <Dropdown.Item key={domain.name} as={Link} to={`${domain.route}`} content={domain.name}
                                            onClick={this.clearSearch} />)
            }
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item as={Link} to='/import' disabled={!ready || error !== false} content={UI.IMPORT[language]} />
        <Menu.Item as={Link} to='/explore' disabled={!ready || error !== false} content={UI.EXPLORE[language]} />
        <Menu.Menu position='right'>
          <Menu.Item as={Link} to='/settings' icon={{ name: 'setting', color: 'teal' }} />
          <Dropdown item text={`${UI.LANGUAGE[language]} (${UI.LANGUAGE_CHOICE[language]})`}>
            <Dropdown.Menu>
              {Object.keys(languages).map(languageName =>
                <Dropdown.Item key={languageName} content={UI[languageName][language]}
                               onClick={() => this.context.setLanguage(languages[languageName].languageCode)} />
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    )
  }
}

AppMenu.contextType = LanguageContext

export default AppMenu
