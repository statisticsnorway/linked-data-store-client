import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import { Container, Dropdown, Flag, Icon, Label, Menu, Message, Segment } from 'semantic-ui-react'

import { DCFormBuilder, DCTableBuilder, SchemaHandler } from 'dc-react-components-library'
import { extractName, splitOnUppercase } from './utilities/Common'
import { LANGUAGES, MESSAGES, UI } from './utilities/Enum'
import Import from './components/Import'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ready: false,
      schemas: [],
      message: '',
      languageCode: localStorage.hasOwnProperty('languageCode') ? localStorage.getItem('languageCode') : this.props.languageCode
    }
  }

  componentDidMount () {
    const {producer, endpoint, languageCode} = this.props
    const updatedUrl = endpoint + 'data?schema=embed'

    if (producer !== '') {
      SchemaHandler(updatedUrl, producer, endpoint).then(schemas => {
        this.setState({
          schemas: schemas,
          ready: true
        })
      }).catch(error => {
        this.setState({
          ready: true,
          message: error
        })
      })
    } else {
      this.setState({
        ready: true,
        message: MESSAGES.PRODUCER_NOT_PROVIDED[languageCode]
      })
    }
  }

  changeLanguage = (languageCode) => {
    localStorage.setItem('languageCode', languageCode)

    this.setState({ready: false}, () => this.setState({
      ready: true,
      languageCode: languageCode
    }))
  }

  render () {
    const {ready, schemas, message, languageCode} = this.state
    const {producer, route, endpoint, specialFeatures, user} = this.props

    return (
      <Segment basic>
        <Menu fixed='top'>
          <Menu.Item header as={Link} to={route} disabled={!ready}>
            {UI.HEADER[languageCode]}
            <Label color='teal' size='large'>{ready ? schemas.length : <Icon fitted loading name='spinner' />}</Label>
          </Menu.Item>
          <Dropdown item text={UI.SHOW_ALL[languageCode]} scrolling disabled={!ready}>
            <Dropdown.Menu>
              {ready && schemas.map((schema, index) => {
                const domain = extractName(schema.$ref)
                const link = route + domain

                return <Dropdown.Item key={index} as={Link} to={link} content={splitOnUppercase(domain)} />
              })}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item text={UI.CREATE_NEW[languageCode]} scrolling disabled={!ready}>
            <Dropdown.Menu>
              {ready && schemas.map((schema, index) => {
                const domain = extractName(schema.$ref)
                const link = route + domain + '/new'

                return <Dropdown.Item key={index} as={Link} to={link} content={splitOnUppercase(domain)} />
              })}
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item as={Link} to='/import' content={UI.IMPORT[languageCode]} />
          <Menu.Menu position='right'>
            <Dropdown item text={UI.LANGUAGE[languageCode]}>
              <Dropdown.Menu>
                {Object.keys(LANGUAGES).map(language => {
                  return (
                    <Dropdown.Item key={language}
                                   onClick={this.changeLanguage.bind(this, LANGUAGES[language].languageCode)}>
                      <Flag name={LANGUAGES[language].flag} /> {UI[language.toUpperCase()][languageCode]}
                    </Dropdown.Item>
                  )
                })}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
        <Container fluid style={{marginTop: '5em'}}>
          {ready && message !== '' && <Message error content={message} />}
          {ready && schemas.map((schema, index) => {
            const domain = extractName(schema.$ref)
            const path = route + domain + '/:id'

            return <Route key={index} path={path} exact
                          render={({match}) => <DCFormBuilder params={match.params} producer={producer}
                                                              schema={JSON.parse(JSON.stringify(schema))}
                                                              languageCode={languageCode}
                                                              specialFeatures={specialFeatures}
                                                              endpoint={endpoint} user={user} />} />
          })}
          {ready && schemas.map((schema, index) => {
            const domain = extractName(schema.$ref)
            const path = route + domain

            return <Route key={index} path={path} exact
                          render={({match}) => <DCTableBuilder params={match.params} producer={producer}
                                                               schema={JSON.parse(JSON.stringify(schema))}
                                                               languageCode={languageCode}
                                                               specialFeatures={specialFeatures}
                                                               endpoint={endpoint} routing={path} />} />
          })}
          <Route path='/import' exact component={() => <Import endpoint={endpoint} languageCode={languageCode} />} />
        </Container>
      </Segment>
    )
  }
}

export default App
