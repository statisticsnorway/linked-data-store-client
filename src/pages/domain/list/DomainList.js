import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Divider, Header, Icon, Message, Segment } from 'semantic-ui-react'

import DomainListTable from './DomainListTable'
import { producers } from '../../../producers/Producers'
import { extractStringFromObject, getData } from '../../../utilities'
import { UI } from '../../../enum'

class DomainList extends Component {
  state = {
    error: false,
    ready: false
  }

  componentDidMount () {
    const {domain, languageCode, lds} = this.props
    const schemaUrl = `${lds.url}${domain.path}`
    const dataUrl = `${lds.url}/${lds.namespace}/${domain.name}`

    getData(schemaUrl).then(schema =>
      getData(dataUrl).then(data =>
        this.setState({
          columns: this.mapColumns(domain, lds.producer, schema.definitions[domain.name].properties),
          data: this.mapData(Array.isArray(data) ? data : [data], languageCode, lds.producer),
          displayName: schema.definitions[domain.name].displayName,
          error: false,
          ready: true
        })
      ).catch(error =>
        this.setState({
          error: error,
          ready: true
        })
      )
    ).catch(error =>
      this.setState({
        error: error,
        ready: true
      })
    )
  }

  mapColumns = (domain, producer, properties) =>
    producers[producer].tableHeaders.map(header => ({
      accessor: header,
      Cell: props => header === 'id' ?
        <Link to={`/${domain.route}/${props.original.id}/view`}>
          {props.value}
        </Link>
        :
        `${props.value}`,
      Header: properties[header] ? properties[header].displayName : '',
      headerStyle: {fontWeight: '700'}
    }))

  mapData = (data, languageCode, producer) =>
    data.map(item => {
      const dataEntry = {}

      producers[producer].tableHeaders.forEach(header => {
        dataEntry[header] = item[header] ? extractStringFromObject(item[header], producer, languageCode) : ''
      })

      return dataEntry
    })

  render () {
    const {columns, data, displayName, error, ready} = this.state
    const {domain, languageCode} = this.props

    return (
      <Segment basic loading={!ready}>
        {ready && !error &&
        <div>
          <Header as='h1' icon={{name: 'table', color: 'teal'}} content={displayName} />
          <DomainListTable columns={columns} languageCode={languageCode} data={data} />
          <Divider hidden />
          <Link to={`/${domain.route}/new/edit`}>
            <Button animated color='teal' floated='right' disabled={!!error || !ready}>
              <Button.Content visible>
                {`${UI.CREATE_NEW[languageCode]} ${displayName}`}
              </Button.Content>
              <Button.Content hidden>
                <Icon fitted name='pencil alternate' />
              </Button.Content>
            </Button>
          </Link>
        </div>
        }
        {ready && error && <Message negative icon='warning' header='Error' content={error} />}
      </Segment>
    )
  }
}

export default DomainList
