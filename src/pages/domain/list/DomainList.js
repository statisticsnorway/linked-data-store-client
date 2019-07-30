import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Divider, Header, Icon, Input, Message, Popup, Segment } from 'semantic-ui-react'

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
    const schemaUrl = `${lds.url}/${lds.namespace}/${params.domain}?schema`
    const dataUrl = `${lds.url}/${lds.namespace}/${params.domain}`

    let language = this.context.value

    getData(schemaUrl).then(schema =>
      getData(dataUrl).then(data =>
        this.setState({
          columns: this.mapColumns(params.domain, lds.producer, schema.definitions[params.domain].properties),
          data: this.mapData(Array.isArray(data) ? data : [data], language, lds.producer),
          displayName: schema.definitions[params.domain].displayName,
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

  reload = () => {
    this.setState({
      error: false,
      ready: false
    }, () => {
      this.load()
    })
  }

  mapColumns = (domain, producer, properties) =>
    producers[producer].tableHeaders.map(header => ({
      accessor: header,
      Cell: props => header === 'id' ?
        <Link to={`/${producer}/${domain}/${props.original.id}/view`}>
          {props.value}
        </Link>
        :
        props.value,
      Header: properties[header] ? properties[header].displayName : '',
      headerStyle: { fontWeight: '700' },
      Filter: ({ filter, onChange }) => (
        <Input
          name={`${header}Search`}
          onChange={event => onChange(event.target.value)}
          value={filter ? filter.value : ''}
          placeholder={UI.SEARCH[this.context.value]}
          fluid
        />
      )
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
    const { lds, location, params } = this.props

    let language = this.context.value

    return (
      <Segment basic loading={!ready}>
        {ready && error && <Message negative icon='warning' header={ERRORS.ERROR[language]} content={error} />}
        {ready && !error &&
        <>
          <Header as='h1' icon={{ name: 'table', color: 'teal' }} content={displayName} />
          {location && location.state && location.state.wasSaved &&
          <Message positive icon='check' content={`${MESSAGES.WAS_SAVED[language]}`} />
          }
          <DomainListTable columns={columns} data={data} />
          <Divider hidden />
          <Popup basic flowing
                 trigger={
                   <Icon link name='sync' color='blue' onClick={this.load} />
                 }>
            <Icon color='blue' name='info circle' />
            {MESSAGES.REFRESH_DOMAIN_LIST[language]}
          </Popup>
          <Link to={`/${lds.producer}/${params.domain}/new/edit`}>
            <Button animated color='teal' floated='right' disabled={!!error || !ready}>
              <Button.Content visible>
                {`${UI.CREATE_NEW[language]} ${displayName}`}
              </Button.Content>
              <Button.Content hidden>
                <Icon fitted name='pencil alternate' />
              </Button.Content>
            </Button>
          </Link>
        </>
        }
      </Segment>
    )
  }
}

DomainList.contextType = LanguageContext

export default DomainList
