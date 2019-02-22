import React, { Component } from 'react'
import { Button, Container, Divider, Form, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react'

import { MESSAGES, UI } from '../../enum'

const producers = [
  {key: 'default', text: 'Default', value: 'default'},
  {key: 'gsim', text: 'GSIM', value: 'gsim'}
]

class Settings extends Component {
  render () {
    const {error, fresh, languageCode, lds} = this.props
    const {changeSettings, refreshSettings} = this.props

    return (
      <Grid centered>
        <Grid.Column mobile={16} tablet={8} computer={4}>
          <Segment basic>
            <Header as='h1' icon={{name: 'cog', color: 'teal'}} content={UI.SETTINGS_HEADER[languageCode]} />
            {error && <Message negative icon='warning' header='Error' content={error} />}
            <Divider hidden />
            <Form size='large'>
              <Form.Input label={UI.LOCATION[languageCode]} placeholder={UI.LOCATION[languageCode]} name='url'
                          value={lds.url} onChange={changeSettings} />
              <Form.Input label={UI.NAMESPACE[languageCode]} placeholder={UI.NAMESPACE[languageCode]} name='namespace'
                          value={lds.namespace} onChange={changeSettings} />
              <Form.Select label={UI.PRODUCER[languageCode]} placeholder={UI.PRODUCER[languageCode]} name='producer'
                           value={lds.producer} onChange={changeSettings} options={producers} />
              <Form.Input label={UI.USER[languageCode]} placeholder={UI.USER[languageCode]} name='user'
                          value={lds.user} onChange={changeSettings} />
            </Form>
            <Container textAlign='center' style={{margin: '2em'}}>
              {!fresh && <div><Icon color='orange' name='info circle' />{MESSAGES.NEW_VALUES[languageCode]}</div>}
              <Divider hidden />
              <Button size='massive' color='teal' icon='refresh' content={UI.REFRESH[languageCode]}
                      onClick={refreshSettings} />
            </Container>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Settings
