import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Divider, Header, Icon, Message, Segment } from 'semantic-ui-react'

import DomainListTable from './DomainListTable'
import { LanguageContext } from '../../../utilities/context/LanguageContext'
import { extractStringFromObject, producers } from '../../../producers/Producers'
import { getData } from '../../../utilities'
import { ERRORS, MESSAGES, UI } from '../../../enum'

class DomainList extends Component {
  state = {
    error: false,
    ready: false
  }

  componentDidMount () {
    const { domain, lds } = this.props
    const schemaUrl = `${lds.url}${domain.path}`
    const dataUrl = `${lds.url}/${lds.namespace}/${domain.name}`

    let language = this.context.value

    getData(schemaUrl).then(schema =>
      getData(dataUrl).then(data =>
        this.setState({
          columns: this.mapColumns(domain, lds.producer, schema.definitions[domain.name].properties),
          data: this.mapData(Array.isArray(data) ? data : [data], language, lds.producer),
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
        <Link to={`${domain.route}/${props.original.id}/view`}>
          {props.value}
        </Link>
        :
        `${props.value}`,
      Header: properties[header] ? properties[header].displayName : '',
      headerStyle: { fontWeight: '700' }
    }))

  mapData = (data, language, producer) =>
    data.map(item => {
      const dataEntry = {}

      producers[producer].tableHeaders.forEach(header => {
        dataEntry[header] = item[header] ? extractStringFromObject(item[header], producer, language) : ''
      })

      return dataEntry
    })

  render () {
    const { columns, data, displayName, error, ready } = this.state
    const { domain, location } = this.props

    let language = this.context.value

    return (
      <Segment basic loading={!ready}>
        {ready && error && <Message negative icon='warning' header={ERRORS.ERROR[language]} content={error} />}
        {ready && !error &&
        <div>
          <Header as='h1' icon={{ name: 'table', color: 'teal' }} content={displayName} />
          {location && location.state && location.state.wasSaved &&
          <Message positive icon='check' content={`${MESSAGES.WAS_SAVED[language]} (${location.state.wasSaved})`} />
          }
          <DomainListTable columns={columns} data={data} />
          <Divider hidden />
          <Link to={`${domain.route}/new/edit`}>
            <Button animated color='teal' floated='right' disabled={!!error || !ready}>
              <Button.Content visible>
                {`${UI.CREATE_NEW[language]} ${displayName}`}
              </Button.Content>
              <Button.Content hidden>
                <Icon fitted name='pencil alternate' />
              </Button.Content>
            </Button>
          </Link>
        </div>
        }
      </Segment>
    )
  }
}

DomainList.contextType = LanguageContext

export default DomainList
