import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, Input, Menu } from 'semantic-ui-react'

import { LANGUAGES, UI } from './enum'

class AppMenu extends Component {
  state = {
    search: ''
  }

  clearSearch = () => {
    this.setState({search: ''})
  }

  handleSearch = (event, data) => {
    this.setState({search: data.value})
  }

  render () {
    const {search} = this.state
    const {changeLanguage, domains, error, languageCode, ready} = this.props

    return (
      <Menu borderless color='blue' size='huge'>
        <Menu.Item header as={Link} to='/' content={UI.HEADER[languageCode]} />
        <Menu.Item icon={{
          name: ready ? 'circle' : 'spinner', color: error === false ? 'green' : 'red',
          loading: !ready, 'data-testid': 'health'
        }}
        />
        <Dropdown item scrolling disabled={error !== false} text={UI.DOMAINS[languageCode]}>
          <Dropdown.Menu>
            <Input icon='search' iconPosition='left' placeholder={UI.SEARCH[languageCode]} value={search}
                   onChange={this.handleSearch} onClick={event => event.stopPropagation()} />
            <Dropdown.Divider />
            {ready && error === false && domains.filter(domain =>
              domain.name.toUpperCase().startsWith(search.toUpperCase()))
              .map(domain => <Dropdown.Item key={domain.name} as={Link} to={`${domain.route}`} content={domain.name}
                                            onClick={this.clearSearch} />)
            }
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item as={Link} to='/import' disabled={error !== false} content={UI.IMPORT[languageCode]} />
        <Menu.Item as={Link} to='/explore' disabled={error !== false} content={UI.EXPLORE[languageCode]} />
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
    )
  }
}

export default AppMenu
