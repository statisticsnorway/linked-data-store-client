import React, { Component } from 'react'
import { Divider, Form, Grid, Header, Icon, Label, List, Message, Popup, Segment } from 'semantic-ui-react'

import { DeleteData, DownloadJSON, FormField, SaveData } from '../../../components'
import { convertDataToView } from '../../../utilities'
import { ERRORS, MESSAGES, UI } from '../../../enum'

class DomainSingleEdit extends Component {
  render () {
    const {data, domain, error, errors, fresh, languageCode, lds, ready, schema, uiSchema} = this.props
    const {handleChange, setErrors} = this.props

    return (
      <Segment basic loading={!ready}>
        {ready && error && <Message negative icon='warning' header={ERRORS.ERROR[languageCode]} content={error} />}
        {ready && !error &&
        <div>
          <Header as='h1' dividing icon={{name: 'edit outline', color: fresh ? 'teal' : 'orange'}}
                  content={schema.displayName} subheader={schema.description} />
          {lds.producer === 'gsim' && data.administrativeStatus === 'DRAFT' &&
          <Message warning icon='warning' header={UI.WARNING[languageCode]}
                   content={`${uiSchema.common.administrativeStatus.displayName} ${MESSAGES.GSIM_DRAFT[languageCode]}`}
          />
          }
          {Object.keys(errors).length > 0 && <Message error content={
            <List>
              {Object.keys(errors).map(error =>
                <List.Item key={error}>
                  <List.Content>
                    <b>{schema.properties[error].displayName}</b>: {errors[error]}
                  </List.Content>
                </List.Item>
              )}
            </List>
          } />}
          <Divider hidden />
          <Grid divided stackable>
            {['unique', 'common'].map(column =>
              <Grid.Column key={column} width={6}>
                <Form>
                  {Object.keys(uiSchema[column]).map(property =>
                    <FormField key={property} languageCode={languageCode} uiSchema={uiSchema[column][property]}
                               lds={lds} value={data[property]} handleChange={handleChange} error={errors[property]} />
                  )}
                </Form>
              </Grid.Column>
            )}
            <Grid.Column width={4}>
              <Popup flowing hideOnScroll position='left center'
                     trigger={<Label attached='top right' color={fresh ? 'green' : 'orange'} circular size='big'
                                     icon={{fitted: true, name: fresh ? 'save' : 'edit'}} style={{right: '0.5em'}} />}>
                <Icon color='blue' name='info circle' />
                {fresh ? MESSAGES.NOT_EDITED[languageCode] : MESSAGES.EDITED[languageCode]}
              </Popup>
              <List relaxed>
                {Object.keys(uiSchema.autofilled).map(property =>
                  <List.Item key={property}>
                    <List.Content>
                      <Popup basic flowing
                             trigger={
                               <List.Header>
                                 {`${uiSchema.autofilled[property].displayName} `}
                                 <Icon color='teal' name={uiSchema.autofilled[property].icon} />
                               </List.Header>
                             }>
                        <Icon color='blue' name='info circle' />
                        {uiSchema.autofilled[property].description}
                      </Popup>
                      <List.Description>
                        {convertDataToView(data[property], languageCode, lds.producer, uiSchema.autofilled[property])}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                )}
              </List>
            </Grid.Column>
          </Grid>
          <Divider hidden />
          <DeleteData domain={domain} languageCode={languageCode} lds={lds} id={data.id} uiSchema={uiSchema} />
          <DownloadJSON data={data} languageCode={languageCode} lds={lds} setErrors={setErrors} uiSchema={uiSchema} />
          <SaveData data={data} domain={domain} fresh={fresh} languageCode={languageCode} lds={lds}
                    setErrors={setErrors} uiSchema={uiSchema} />
        </div>
        }
      </Segment>
    )
  }
}

export default DomainSingleEdit
