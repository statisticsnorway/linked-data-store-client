import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Divider, Grid, Header, Icon, Input, Message, Popup, Segment } from 'semantic-ui-react'

import DomainListTable from './DomainListTable'
import { LanguageContext } from '../../../utilities/context/LanguageContext'
import { extractStringFromObject, producers } from '../../../producers/Producers'
import { getData, truncateString } from '../../../utilities'
import { API, ERRORS, MESSAGES, UI } from '../../../enum'

class DomainList extends Component {
  state = {
    error: false,
    ready: false
  }

  componentDidMount () {
    this.load()
  }

  componentDidUpdate (prevProps) {
    const { params } = this.props

    if (prevProps.params.domain !== params.domain) {
      this.reload()
    }
  }

  load = () => {
    const { lds, location, params } = this.props
    const schemaUrl = `${lds.url}/${lds.namespace}/${params.domain}${API.SCHEMA_QUERY}`
    const dataUrl = `${lds.url}/${lds.namespace}/${params.domain}`

    let language = this.context.value

    getData(schemaUrl).then(schema =>
      getData(dataUrl).then(data =>
        this.setState({
          columns: this.mapColumns(params.domain, lds.producer, schema.definitions[params.domain].properties),
          data: this.mapData(Array.isArray(data) ? data : [data], params.domain, language, lds.producer),
          displayName: schema.definitions[params.domain].displayName,
          description: schema.definitions[params.domain].description,
          error: false,
          ready: true
        }, () => {
          if (location && location.state && location.state.wasSaved) {
            const element = document.getElementsByName('idSearch')
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set

            nativeInputValueSetter.call(element[0], location.state.wasSaved)

            element[0].dispatchEvent(new Event('input', { bubbles: true }))
          }
        })
      ).catch(error =>
        this.setState({
          error: error.toString(),
          ready: true
        })
      )
    ).catch(error =>
      this.setState({
        error: error.toString(),
        ready: true
      })
    )
  }

  reload = () => {
    this.setState({
      error: false,
      ready: false
    }, () => {
      this.load()
    })
  }

  handleCellPopup = (props, truncationLength) => props.value.length > truncationLength ?
    <Popup basic flowing trigger={<div>{truncateString(props.value, truncationLength)}</div>}>
      {props.value}
    </Popup>
    :
    props.value

  handleCellHeader = (props, truncationLength) => Array.isArray(props.value) ?
    <Popup basic flowing trigger={
      <div>{props.value.map(value => <p key={value}>{truncateString(value, truncationLength)}</p>)}</div>
    }>
      <div>{props.value.map(value => <p key={value}>{value}</p>)}</div>
    </Popup>
    :
    this.handleCellPopup(props, truncationLength)

  mapColumns = (domain, producer, properties) => {
    const headers = producers[producer].tableHeaders.hasOwnProperty(domain) ? domain : 'default'
    const truncationLength = 200 / producers[producer].tableHeaders[headers].length

    return producers[producer].tableHeaders[headers].map(header => ({
      accessor: header,
      Cell: props => header === 'id' ?
        <Link to={`/${producer}/${domain}/${props.original.id}/${API.VIEWS.VIEW}`}>
          {props.value}
        </Link>
        :
        this.handleCellHeader(props, truncationLength)
      ,
      Header: properties[header] ? properties[header].displayName : '',
      headerStyle: { fontWeight: '700' },
      Filter: ({ filter, onChange }) => (
        <Input
          disabled={header === 'agentInRoles'}
          name={`${header}Search`}
          onChange={event => onChange(event.target.value)}
          value={filter ? filter.value : ''}
          placeholder={UI.SEARCH[this.context.value]}
          fluid
        />
      )
    }))
  }

  mapData = (data, domain, language, producer) => {
    const headers = producers[producer].tableHeaders.hasOwnProperty(domain) ? domain : 'default'

    return data.map(item => {
      const dataEntry = {}

      producers[producer].tableHeaders[headers].forEach(header => {
        if (item.hasOwnProperty(header)) {
          if (Array.isArray(item[header]) && !item[header].every(value => typeof value === 'string')) {
            dataEntry[header] = extractStringFromObject(item[header], producer, language)
          } else {
            dataEntry[header] = item[header]
          }
        } else {
          dataEntry[header] = ''
        }
      })

      return dataEntry
    })
  }

  render () {
    const { columns, data, description, displayName, error, ready } = this.state
    const { lds, location, params } = this.props

    let language = this.context.value

    return (
      <Segment basic loading={!ready}>
        {ready && error && <Message negative icon='warning' header={ERRORS.ERROR[language]} content={error} />}
        {ready && !error &&
        <>
          <Header as='h1' icon={{ name: 'table', color: 'teal' }} dividing content={displayName}
                  subheader={description} />
          {location && location.state && location.state.wasSaved &&
          <Message positive icon='check' content={`${MESSAGES.WAS_SAVED[language]}`} />
          }
          <Grid columns='equal'>
            <Grid.Column verticalAlign='middle'>
              <Popup basic flowing
                     trigger={<Icon link size='large' name='sync' color='blue' onClick={this.load} />}>
                <Icon color='blue' name='info circle' />
                {MESSAGES.REFRESH_DOMAIN_LIST[language]}
              </Popup>
            </Grid.Column>
            <Grid.Column>
              <Link to={`/${lds.producer}/${params.domain}/${API.VIEWS.NEW}/${API.VIEWS.EDIT}`}>
                <Button animated color='teal' floated='right' disabled={!!error || !ready}>
                  <Button.Content visible>
                    {`${UI.CREATE_NEW[language]} ${displayName}`}
                  </Button.Content>
                  <Button.Content hidden>
                    <Icon fitted name='pencil alternate' />
                  </Button.Content>
                </Button>
              </Link>
            </Grid.Column>
          </Grid>
          <Divider hidden style={{ marginBottom: 0 }} />
          <Icon disabled name='hashtag' color='teal' />
          {data.length}
          <DomainListTable columns={columns} data={data} />
        </>
        }
      </Segment>
    )
  }
}

DomainList.contextType = LanguageContext

export default DomainList
