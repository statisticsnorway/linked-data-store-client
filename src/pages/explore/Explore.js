import React, { Component } from 'react'

import ExploreView from './ExploreView'
import {
  createUiSchema,
  extractDomainFromEndpoint,
  extractTypeFromEndpoint,
  getData,
  lowerCaseFirst,
  stringToColor,
  upperCaseFirst
} from '../../utilities'
import { API } from '../../enum'

const grouping = ['common', 'unique']

const isThere = (value, array) => {
  return array.find(thing => thing === value)
}

class Explore extends Component {
  state = {
    error: false,
    ready: false
  }

  // TODO: Reduce Cognitive Complexity
  componentDidMount () {
    const { domains, lds } = this.props

    getData(`${lds.url}/${lds.namespace}${API.SCHEMA_QUERY_EMBED}`).then(schemas => {
      Promise.all(
        domains.map(domain => {
          return getData(`${lds.url}/${lds.namespace}/${domain.name}`).then(response => {
            if (Array.isArray(response)) {
              return response
            } else {
              return [response]
            }
          }).catch(error => {
            return [error.toString()]
          })
        })
      ).then(responses => {
        const data = {}
        const usedIds = {}
        const instancesData = {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: []
          }]
        }
        const unusedData = {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: []
          }]
        }

        domains.forEach((domain, index) => {
          const responseLength = responses[index].length
          const uiSchema = createUiSchema(schemas[index].definitions, lds, domain.name)

          data[domain.name] = {
            connectsTo: [],
            storage: responses[index],
            uiSchema: uiSchema,
            unused: []
          }

          grouping.forEach(group => {
            Object.keys(uiSchema[group]).forEach(property => {
              if (uiSchema[group][property].input.hasOwnProperty('links')) {
                const types = []
                let count = 0

                uiSchema[group][property].input.links.forEach(link => {
                  types.push(extractDomainFromEndpoint(link))
                })

                if (responseLength > 0) {
                  responses[index].forEach(response => {
                    if (response.hasOwnProperty(property)) {
                      if (Array.isArray(response[property])) {
                        count = count + response[property].length
                      } else {
                        count = count + 1
                      }
                    }
                  })
                }

                const connection = {
                  name: upperCaseFirst(property),
                  types: types,
                  count: count,
                  identifier: property
                }

                data[domain.name].connectsTo.push(connection)
              }
            })
          })

          if (responseLength > 0) {
            instancesData.labels.push(domain.name)
            instancesData.datasets[0].data.push(responses[index].length)
            instancesData.datasets[0].backgroundColor.push(stringToColor(domain.name))
          }
        })

        Object.keys(data).forEach(domain => {
          usedIds[domain] = []
        })

        Object.keys(data).forEach(domain => {
          data[domain].storage.forEach(stored => {
            data[domain].connectsTo.forEach(connection => {
              connection.types.forEach(type => {
                if (stored.hasOwnProperty(lowerCaseFirst(type))) {
                  if (Array.isArray(stored[lowerCaseFirst(type)])) {
                    stored[lowerCaseFirst(type)].forEach(innerType => {
                      data[innerType].storage.forEach(checker => {
                        if (checker.id === extractDomainFromEndpoint(stored[lowerCaseFirst(innerType)])) {
                          if (!isThere(checker.id, usedIds[innerType])) {
                            usedIds[innerType].push(checker.id)
                          }
                        }
                      })
                    })
                  } else {
                    data[type].storage.forEach(checker => {
                      if (checker.id === extractDomainFromEndpoint(stored[lowerCaseFirst(type)])) {
                        if (!isThere(checker.id, usedIds[type])) {
                          usedIds[type].push(checker.id)
                        }
                      }
                    })
                  }
                }
              })

              if (stored.hasOwnProperty(connection.identifier) && !data.hasOwnProperty(upperCaseFirst(connection.identifier))) {
                if (Array.isArray(stored[connection.identifier])) {
                  stored[connection.identifier].forEach(thing => {
                    const id = extractDomainFromEndpoint(thing)
                    const type = extractTypeFromEndpoint(thing)

                    data[type].storage.forEach(checker => {
                      if (checker.id === id) {
                        if (!isThere(checker.id, usedIds[type])) {
                          usedIds[type].push(checker.id)
                        }
                      }
                    })
                  })
                } else {
                  const id = extractDomainFromEndpoint(stored[connection.identifier])
                  const type = extractTypeFromEndpoint(stored[connection.identifier])

                  data[type].storage.forEach(checker => {
                    if (checker.id === id) {
                      if (!isThere(checker.id, usedIds[type])) {
                        usedIds[type].push(checker.id)
                      }
                    }
                  })
                }
              }
            })
          })
        })

        Object.keys(usedIds).forEach(domain => {
          if (usedIds[domain].length > 0) {
            const ids = data[domain].storage.map(entry => entry.id)
            const unused = ids.filter(id => !usedIds[domain].includes(id))

            data[domain].unused = unused

            if (unused.length > 0) {
              unusedData.labels.push(domain)
              unusedData.datasets[0].data.push(unused.length)
              unusedData.datasets[0].backgroundColor.push(stringToColor(domain))
            }
          }
        })

        this.setState({
          data: data,
          instancesData: instancesData,
          ready: true,
          unusedData: unusedData
        })
      })
    }).catch(error => {
      this.setState({
        error: error.toString(),
        ready: true
      })
    })
  }

  render () {
    const { lds } = this.props

    return <ExploreView {...this.state} producer={lds.producer} />
  }
}

export default Explore
