import React, { Component } from 'react'
import ReactTable from 'react-table'

import { MESSAGES, TABLE } from '../../../enum'

class DomainListTable extends Component {
  filterMethod = (filter, row) => {
    const id = filter.pivotId || filter.id

    return row[id] !== undefined ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase()) : true
  }

  render () {
    const {columns, data, languageCode} = this.props

    return (
      <ReactTable
        className='-highlight'
        sortable
        filterable
        defaultFilterMethod={this.filterMethod}
        resizable={false}
        data={data}
        columns={columns}
        defaultPageSize={15}
        noDataText={MESSAGES.NOTHING_FOUND[languageCode]}
        previousText={TABLE.PREVIOUS[languageCode]}
        nextText={TABLE.NEXT[languageCode]}
        ofText={TABLE.OF[languageCode]}
        pageText={TABLE.PAGE[languageCode]}
        loadingText={TABLE.LOADING[languageCode]}
        rowsText={TABLE.ROWS[languageCode]}
      />
    )
  }
}

export default DomainListTable
