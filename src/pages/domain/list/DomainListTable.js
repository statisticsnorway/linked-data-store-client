import React, { Component } from 'react'
import ReactTable from 'react-table-6'

import { LanguageContext } from '../../../utilities/context/LanguageContext'
import { MESSAGES, TABLE } from '../../../enum'

class DomainListTable extends Component {
  filterMethod = (filter, row) => {
    const id = filter.pivotId || filter.id

    return row[id] !== undefined && typeof row[id] === 'string' ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase()) : true
  }

  render () {
    const { columns, data } = this.props

    let language = this.context.value

    return (
      <ReactTable
        className='-highlight'
        sortable
        filterable
        defaultFilterMethod={this.filterMethod}
        resizable={false}
        data={data}
        columns={columns}
        defaultPageSize={20}
        noDataText={MESSAGES.NOTHING_FOUND[language]}
        previousText={TABLE.PREVIOUS[language]}
        nextText={TABLE.NEXT[language]}
        ofText={TABLE.OF[language]}
        pageText={TABLE.PAGE[language]}
        loadingText={TABLE.LOADING[language]}
        rowsText={TABLE.ROWS[language]}
      />
    )
  }
}

DomainListTable.contextType = LanguageContext

export default DomainListTable
