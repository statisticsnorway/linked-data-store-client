import React, { Component } from 'react'
import { Button, Divider, Grid, Header, Icon, List, Popup, Segment, Statistic } from 'semantic-ui-react'

import { LanguageContext } from '../../utilities/context/LanguageContext'
import { MESSAGES, UI } from '../../enum'

class ImportView extends Component {
  render () {
    const { fileUploader, progress, ready, responses, successful, total } = this.props
    const { handleClick, handleUpload, reset } = this.props

    let language = this.context.value

    return (
      <Grid centered>
        <Grid.Column mobile={16} tablet={16} computer={8}>
          <Segment basic textAlign='center'>
            <Header as='h1' content={UI.IMPORT[language]} />
            <Divider hidden />
            <Button size='massive' color='teal' animated onClick={handleClick} loading={progress !== total}
                    disabled={ready && progress === total} style={{ margin: '0' }}>
              <Button.Content visible>{UI.UPLOAD[language]}</Button.Content>
              <Button.Content hidden><Icon fitted name='upload' /></Button.Content>
            </Button>
            <input ref={fileUploader} style={{ display: 'none' }} type='file' multiple accept='application/json'
                   onChange={handleUpload} data-testid='fileUploader' />
            <Divider hidden />
            {ready && progress === total &&
            <div>
              <Statistic.Group size='large' widths='one'>
                <Statistic color={successful === total ? 'green' : 'red'}>
                  <Statistic.Value>{successful} / {total}</Statistic.Value>
                  <Statistic.Label>{UI.IMPORTING_SUCCESS[language]}</Statistic.Label>
                </Statistic>
              </Statistic.Group>
              <Divider hidden />
              <Popup flowing hideOnScroll position='top center' size='large'
                     trigger={<Button color='blue' icon='redo' onClick={reset} style={{ margin: '0' }} />}>
                <Icon color='blue' name='info circle' />
                {MESSAGES.RESTART[language]}
              </Popup>
            </div>
            }
          </Segment>
          <List relaxed>
            {responses.map(response =>
              <List.Item key={response.name}>
                <List.Icon size='large' name='warning' color='red' verticalAlign='middle' />
                <List.Content>
                  <List.Header>{`${response.name}`}</List.Header>
                  <List.Description>{`${response.text}`}</List.Description>
                </List.Content>
              </List.Item>
            )}
          </List>
        </Grid.Column>
      </Grid>
    )
  }
}

ImportView.contextType = LanguageContext

export default ImportView
