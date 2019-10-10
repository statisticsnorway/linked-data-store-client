import React, { Component } from 'react'
import { request } from 'graphql-request'
import humanize from 'humanize-graphql-response'
import { Divider, Message, Segment } from 'semantic-ui-react'

import { LanguageContext } from '../../../utilities/context/LanguageContext'
import { ERRORS, UI } from '../../../enum'

const query = /* GraphQL */ `
  query getStatisticalProgramById($id: ID!) {
    StatisticalProgramById(id: $id) {
      statisticalProgramCycles {
        edges {
          node {
            name {languageText}
            description {languageText}
            businessProcesses {
              edges {
                node {
                  name {languageText}
                  description {languageText}
                  previousBusinessProcess {
                    name {languageText}
                    description {languageText}
                    processSteps {
                      edges {
                        node {
                          name {languageText}
                          technicalPackageID
                          codeBlocks {
                            codeBlockIndex
                            codeBlockTitle
                            codeBlockType
                            codeBlockValue
                          }
                        }
                      }
                    }
                  }
                  processSteps {
                    edges {
                      node {
                        name {languageText}
                        description {languageText}
                        technicalPackageID
                        codeBlocks {
                          codeBlockIndex
                          codeBlockTitle
                          codeBlockType
                          codeBlockValue
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

class DomainLinks extends Component {
  state = {
    error: false,
    info: false,
    process: {},
    ready: false
  }

  componentDidMount () {
    const { domain, id, lds } = this.props

    request(`${lds.url}/graphql`, query, { id: id }).then(response => {
      this.setState({
        error: false,
        info: false,
        process: humanize(response[domain + 'ById']),
        ready: true
      })
    }).catch(error => {
      const process = error.response.hasOwnProperty('errors') && error.response.hasOwnProperty('data') ?
        humanize(error.response.data[domain + 'ById']) : {}

      const info = error.response.hasOwnProperty('errors') ? error.response.errors : false

      this.setState({
        error: error.response.hasOwnProperty('errors') && error.response.hasOwnProperty('data') ? false : error.toString(),
        info: info,
        process: process,
        ready: true
      })
    })
  }

  render () {
    const { error, info, process, ready } = this.state

    let language = this.context.value

    return (
      <Segment basic loading={!ready}>
        <Divider />
        {ready && error && <Message negative icon='warning' header={ERRORS.ERROR[language]} content={error} />}
        {ready && info && info.map((info, index) =>
          <Message key={index} info icon='info' header={UI.INFO[language]} content={info.message} />
        )}
        {ready && !error && <pre>{JSON.stringify(process, null, 2)}</pre>}
      </Segment>
    )
  }
}

DomainLinks.contextType = LanguageContext

export default DomainLinks
