import React, { Component } from 'react'
import { Button, Container, Divider, Form, Grid, Header, Icon, Label, Message, Popup, Segment } from 'semantic-ui-react'

import { LanguageContext } from '../../utilities/context/LanguageContext'
import { API, ERRORS, MESSAGES, UI } from '../../enum'

const producers = [
  { key: 'basic', text: 'Basic', value: 'basic' },
  { key: API.DEFAULT_PRODUCER, text: 'GSIM', value: API.DEFAULT_PRODUCER }
]

class Settings extends Component {
  render () {
    const { error, fresh, lds, ready, schemaModel } = this.props
    const { changeSettings, refreshSettings } = this.props

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
                <Form.Input label={UI.LOCATION[language]} placeholder={UI.LOCATION[language]} name='url'
                            value={lds.url} onChange={changeSettings} disabled={!ready} />
              }>
                <Icon color='blue' name='info circle' />
                {MESSAGES.LOCATION[language]}
              </Popup>
              <Popup flowing size='large' position='left center' trigger={
                <Form.Input label={UI.NAMESPACE[language]} placeholder={UI.NAMESPACE[language]} name='namespace'
                            value={lds.namespace} onChange={changeSettings} disabled={!ready} />
              }>
                <Icon color='blue' name='info circle' />
                {MESSAGES.NAMESPACE[language]}
              </Popup>
              <Popup flowing size='large' position='left center' trigger={
                <Form.Select label={UI.PRODUCER[language]} placeholder={UI.PRODUCER[language]} name='producer'
                             value={lds.producer} onChange={changeSettings} options={producers} disabled={!ready} />
              }>
                <Icon color='blue' name='info circle' />
                {MESSAGES.PRODUCER[language]}
              </Popup>
              {lds.producer === API.DEFAULT_PRODUCER &&
              <Popup flowing size='large' position='left center' trigger={
                <Form.Field inline disabled={!ready}>
                  <label>{`${schemaModel.displayName}: `}</label>
                  <Label color='teal' tag>
                    {!ready ? <Icon loading name='spinner' /> : schemaModel.version}
                  </Label>
                </Form.Field>
              }>
                <Icon color='blue' name='info circle' />
                {schemaModel.latestChange}
              </Popup>
              }
              <Popup flowing size='large' position='left center' trigger={
                <Form.Input label={UI.USER[language]} placeholder={UI.USER[language]} name='user'
                            value={lds.user} onChange={changeSettings} disabled={!ready} />
              }>
                <Icon color='blue' name='info circle' />
                {MESSAGES.USER[language]}
              </Popup>
            </Form>
            <Container textAlign='center' style={{ margin: '2em' }}>
              {!fresh && <div><Icon color='orange' name='info circle' />{MESSAGES.NEW_VALUES[language]}</div>}
              <Divider hidden />
              <Button size='massive' color='teal' animated disabled={!ready} onClick={refreshSettings}>
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
