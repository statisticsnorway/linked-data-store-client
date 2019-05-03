import React, { Component } from 'react'
import { Container, Divider, List } from 'semantic-ui-react'

import { LanguageContext } from './utilities/context/LanguageContext'
import { UI } from './enum'

class AppFooter extends Component {
  render () {
    let language = this.context.value

    return (
      <Container fluid textAlign='center'>
        <Divider section />
        <List horizontal divided link size='small'>
          <List.Item as='a' href={`${process.env.REACT_APP_GIT_HUB}`} icon={{ fitted: true, name: 'github' }} />
          <List.Item content={`${UI.APP_VERSION[language]}: ${process.env.REACT_APP_VERSION}`} />
        </List>
        <Divider hidden />
      </Container>
    )
  }
}

AppFooter.contextType = LanguageContext

export default AppFooter
