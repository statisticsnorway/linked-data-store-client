import React, { Component } from 'react'
import { Button, Container, Divider, Form, Grid, Header, Icon, Message, Popup, Segment } from 'semantic-ui-react'

import { LanguageContext } from '../../utilities/context/LanguageContext'
import { ERRORS, MESSAGES, UI } from '../../enum'

const producers = [
  { key: 'default', text: 'Default', value: 'default' },
  { key: 'gsim', text: 'GSIM', value: 'gsim' }
]

class Settings extends Component {
  render () {
    const { error, fresh, lds } = this.props
    const { changeSettings, refreshSettings } = this.props

    const ldsLocations = [
      { key: 'a', text: 'LDS A', value: process.env.REACT_APP_LDS },
      { key: 'b', text: 'LDS B', value: `${process.env.REACT_APP_LDS}-b` },
      { key: 'c', text: 'LDS C', value: `${process.env.REACT_APP_LDS}-c` }
    ]

    let language = this.context.value

    return (
      <Grid centered>
        <Grid.Column mobile={16} tablet={8} computer={4}>
          <Segment basic>
            <Header as='h1' icon={{ name: 'cog', color: 'teal' }} content={UI.SETTINGS_HEADER[language]} />
            {error && <Message negative icon='warning' header={ERRORS.ERROR[language]} content={error} />}
            <Divider hidden />
            <Form size='large'>
              <Popup flowing size='large' position='left center' trigger={
                process.env.NODE_ENV === 'production' ?
                  <Form.Select label={UI.LOCATION[language]} placeholder={UI.LOCATION[language]} name='url'
                               value={lds.url} onChange={changeSettings} options={ldsLocations} />
                  :
                  <Form.Input label={UI.LOCATION[language]} placeholder={UI.LOCATION[language]} name='url'
                              value={lds.url} onChange={changeSettings} />
              }>
                <Icon color='blue' name='info circle' />
                {MESSAGES.LOCATION[language]}
              </Popup>
              <Popup flowing size='large' position='left center' trigger={
                <Form.Input label={UI.NAMESPACE[language]} placeholder={UI.NAMESPACE[language]} name='namespace'
                            value={lds.namespace} onChange={changeSettings} />
              }>
                <Icon color='blue' name='info circle' />
                {MESSAGES.NAMESPACE[language]}
              </Popup>
              <Popup flowing size='large' position='left center' trigger={
                <Form.Select label={UI.PRODUCER[language]} placeholder={UI.PRODUCER[language]} name='producer'
                             value={lds.producer} onChange={changeSettings} options={producers} />
              }>
                <Icon color='blue' name='info circle' />
                {MESSAGES.PRODUCER[language]}
              </Popup>
              <Popup flowing size='large' position='left center' trigger={
                <Form.Input label={UI.USER[language]} placeholder={UI.USER[language]} name='user'
                            value={lds.user} onChange={changeSettings} />
              }>
                <Icon color='blue' name='info circle' />
                {MESSAGES.USER[language]}
              </Popup>
            </Form>
            <Container textAlign='center' style={{ margin: '2em' }}>
              {!fresh && <div><Icon color='orange' name='info circle' />{MESSAGES.NEW_VALUES[language]}</div>}
              <Divider hidden />
              <Button size='massive' color='teal' animated onClick={refreshSettings}>
                <Button.Content visible>{UI.APPLY[language]}</Button.Content>
                <Button.Content hidden><Icon fitted name='sync' /></Button.Content>
              </Button>
            </Container>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}

Settings.contextType = LanguageContext

export default Settings
