import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Bar, Doughnut, Pie } from 'react-chartjs-2'
import { Checkbox, Container, Grid, Header, Icon, List, Message, Popup, Segment, Tab, Table } from 'semantic-ui-react'

import { ERRORS, TABLE, UI } from '../../enum'

const pieOptions = {
  legend: {
    position: 'bottom',
    labels: {
      usePointStyle: true
    }
  }
}

const barOptions = {
  legend: {
    display: false
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }],
    xAxes: [{
      ticks: {
        autoSkip: false
      }
    }]
  }
}

const tableHeaderIcons = [
  {name: 'file', color: 'blue'},
  {name: 'hashtag', color: 'blue'},
  {name: 'unlinkify', color: 'red'},
  {name: 'linkify', color: 'green'}
]

class ExploreView extends Component {
  state = {
    showEmpty: false
  }

  chartTab = (chartData) => {

    const panes = [
      {
        menuItem: 'Bar', render: () =>
          <Tab.Pane as={Container}><Bar data={chartData} options={barOptions} /></Tab.Pane>
      },
      {
        menuItem: 'Doughnut', render: () =>
          <Tab.Pane as={Container}><Doughnut data={chartData} options={pieOptions} /></Tab.Pane>
      },
      {
        menuItem: 'Pie', render: () =>
          <Tab.Pane as={Container}><Pie data={chartData} options={pieOptions} /></Tab.Pane>
      }
    ]

    return <Tab menu={{secondary: true, pointing: true}} panes={panes} />
  }

  toggleShowEmpty = () => {
    this.setState({showEmpty: !this.state.showEmpty})
  }

  render () {
    const {showEmpty} = this.state
    const {data, error, instancesData, languageCode, producer, ready, unusedData} = this.props

    return (
      <Segment basic loading={!ready}>
        {ready && error && <Message negative icon='warning' header={ERRORS.ERROR[languageCode]} content={error} />}
        {ready && !error &&
        <div>
          <Header as='h1' content={UI.EXPLORE[languageCode]} dividing />
          <Grid columns='equal'>
            <Grid.Column>
              <Checkbox checked={showEmpty} label={UI.SHOW_ALL[languageCode]} onChange={this.toggleShowEmpty} toggle />
              <Table celled collapsing compact='very'>
                <Table.Header>
                  <Table.Row>
                    {TABLE.EXPLORE_HEADERS[languageCode].map((header, index) =>
                      <Table.HeaderCell key={header} singleLine>
                        <Icon name={tableHeaderIcons[index].name} color={tableHeaderIcons[index].color} />
                        {header}
                      </Table.HeaderCell>
                    )}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {Object.keys(data).map((domain, index) =>
                    <Table.Row key={index} warning={data[domain].storage.length < 1}
                               style={{display: !showEmpty && data[domain].storage.length < 1 ? 'none' : ''}}>
                      <Table.Cell><Link to={`${producer}/${domain}`}>{domain}</Link></Table.Cell>
                      <Table.Cell textAlign='center'>{data[domain].storage.length}</Table.Cell>
                      <Table.Cell textAlign='center'>
                        {data[domain].unused.length > 0 ?
                          <Popup flowing hideOnScroll position='top center'
                                 trigger={<span>{data[domain].unused.length}</span>}>
                            {data[domain].unused.map(id => <p key={id}>{id}</p>)}
                          </Popup>
                          : data[domain].unused.length
                        }
                      </Table.Cell>
                      <Table.Cell>
                        <List bulleted>
                          {data[domain].connectsTo.map((connection, index) =>
                            <List.Item key={index}>
                              {data[domain].storage.length > 0 && <b>{`${connection.count} `}</b>}
                              {`${connection.name}`}
                              {connection.types.length > 1 && <i>{` (${connection.types.join(', ')})`}</i>}
                            </List.Item>
                          )}
                        </List>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </Grid.Column>
            <Grid.Column textAlign='center'>
              <Header as='h2' content={UI.INSTANCE_COUNT[languageCode]} />
              {this.chartTab(instancesData)}
              <Header as='h2' content={UI.UNUSED_COUNT[languageCode]} />
              {this.chartTab(unusedData)}
            </Grid.Column>
          </Grid>
        </div>
        }
      </Segment>
    )
  }
}

export default ExploreView
