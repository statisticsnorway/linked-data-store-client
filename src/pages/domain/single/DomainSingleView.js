import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Divider, Grid, Header, Icon, Message, Popup, Segment } from 'semantic-ui-react'

import { LanguageContext } from '../../../utilities/context/LanguageContext'
import { extractStringFromObject } from '../../../producers/Producers'
import { convertDataToView } from '../../../utilities'
import { ERRORS, MESSAGES, UI } from '../../../enum'

class DomainSingleView extends Component {
  render () {
    const { data, domain, error, lds, location, ready, uiSchema } = this.props

    let language = this.context.value

    return (
      <Segment basic loading={!ready}>
        {ready && error && <Message negative icon='warning' header={ERRORS.ERROR[language]} content={error} />}
        {ready && !error &&
        <div>
          <Header as='h1' dividing>
            <Icon name='file alternate outline' color='teal' />
            <Header.Content>
              {`${extractStringFromObject(data.name, lds.producer, language)} `}
              <i style={{ fontWeight: 400 }}>({domain.name})</i>
              <Header.Subheader>
                {extractStringFromObject(data.description, lds.producer, language)}
              </Header.Subheader>
            </Header.Content>
          </Header>
          {location.state && location.state.wasSaved &&
          <Message positive icon='check' content={`${MESSAGES.WAS_SAVED[language]}`} />
          }
          <Divider hidden />
          <Grid columns='equal' divided>
            {['common', 'unique', 'autofilled'].map(grouping =>
              <Grid.Column key={grouping}>
                <Grid>
                  {Object.keys(uiSchema[grouping]).map(property =>
                    <Grid.Row key={property} style={{ paddingTop: '0' }}>
                      <Grid.Column textAlign='right' width={5}>
                        <Popup basic flowing trigger={<b>{uiSchema[grouping][property].displayName}</b>}>
                          <Icon color='blue' name='info circle' />
                          {uiSchema[grouping][property].description}
                        </Popup>
                      </Grid.Column>
                      <Grid.Column width={11}>
                        {convertDataToView(data[property], language, lds.producer, uiSchema[grouping][property])}
                      </Grid.Column>
                    </Grid.Row>
                  )}
                </Grid>
              </Grid.Column>
            )}
          </Grid>
          <Divider hidden />
          <Button floated='right' color='orange' animated as={Link} to={`${domain.route}/${data.id}/edit`}>
            <Button.Content visible>{UI.EDIT[language]}</Button.Content>
            <Button.Content hidden><Icon fitted name='edit outline' /></Button.Content>
          </Button>
        </div>
        }
      </Segment>
    )
  }
}

DomainSingleView.contextType = LanguageContext

export default DomainSingleView
