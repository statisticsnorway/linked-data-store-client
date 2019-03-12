import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Divider, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react'

import { extractStringFromObject } from '../../../producers/Producers'
import { convertDataToView } from '../../../utilities'
import { MESSAGES, UI } from '../../../enum'

class DomainSingleView extends Component {
  render () {
    const {data, domain, error, languageCode, lds, location, ready, uiSchema} = this.props

    return (
      <Segment basic loading={!ready}>
        {ready && !error &&
        <div>
          <Header as='h1' dividing icon={{name: 'file alternate outline', color: 'teal'}}
                  content={extractStringFromObject(data.name, lds.producer, languageCode)}
                  subheader={extractStringFromObject(data.description, lds.producer, languageCode)} />
          {location.state && location.state.wasSaved &&
          <Message positive icon='check' content={`${MESSAGES.WAS_SAVED[languageCode]}`} />
          }
          <Divider hidden />
          <Grid columns='equal' divided>
            {['common', 'unique', 'autofilled'].map(grouping =>
              <Grid.Column key={grouping}>
                <Grid>
                  {Object.keys(uiSchema[grouping]).map(property =>
                    <Grid.Row key={property} style={{paddingTop: '0'}}>
                      <Grid.Column textAlign='right' width={5}>
                        <b>{uiSchema[grouping][property].displayName}</b>
                      </Grid.Column>
                      <Grid.Column width={11}>
                        {convertDataToView(data[property], languageCode, lds.producer, uiSchema[grouping][property])}
                      </Grid.Column>
                    </Grid.Row>
                  )}
                </Grid>
              </Grid.Column>
            )}
          </Grid>
          <Divider hidden />
          <Button floated='right' color='orange' animated as={Link} to={`${domain.route}/${data.id}/edit`}>
            <Button.Content visible>{UI.EDIT[languageCode]}</Button.Content>
            <Button.Content hidden><Icon fitted name='edit outline' /></Button.Content>
          </Button>
        </div>
        }
        {ready && error && <Message negative icon='warning' header='Error' content={error} />}
      </Segment>
    )
  }
}

export default DomainSingleView
