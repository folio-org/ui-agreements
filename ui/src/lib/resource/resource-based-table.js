import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { observable, action, computed, runInAction } from 'mobx'
import { hot } from 'react-hot-loader'
import ReactTable from 'react-table'

import ResourceBasedComponent from './resource-based-component'

@observer
class ResourceBasedTable extends ResourceBasedComponent {
  
  static PropTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    searchIn: PropTypes.arrayOf(PropTypes.string)
  }
  
  constructor (props) {
    super(props)
    this.columns = props.columns
    this.searchIn = props.searchIn
  }
  
  searchIn = []
  columns = []
  
  @computed get rows() {
    if (this.data) {
      return this.data.body().map((entity) => {
        return entity.data()
      })
    }
    
    return []
  }
  
  lastUri = null
  stopListening = null
  componentWillMount() {
    this.app.log(`Adding URL listener`)
    this.stopListening = this.app.history.listen((location, action) => {
      this.fetchData({'match': this.searchIn})
    })
  }
  
  componentWillUnmount() {
    if (this.stopListening) {
      this.app.log(`Removing URL listener`)
      this.stopListening()
      this.stopListeneing = null
    }
  }

  @action.bound
  fetchTableData(state) {
    if (state) {
      let params = {
        perPage : state.pageSize,
        page: state.page + 1
      }
      
      // Default is to use query string params. Set them here.
      this.app.addToQueryString(params)
    }
  }  
  
  render() {
    return (
      <ReactTable
        columns={this.columns.slice()}
        noDataText="No results found"
        manual // Forces table not to paginate or sort automatically, so we can handle it server-side
        data={this.rows}
        pages={1} // Display the total number of pages
        loading={this.working} // Display the loading overlay when we need it
        onFetchData={this.fetchTableData} // Request new data when things change
//        filterable
        defaultPageSize={10}
        className="-striped -highlight"
          >{(state, makeTable, instance) => {
            
            let results = state.data.length < 1 ? 'No results found' : `Showing ${state.data.length} results`
            
            return (
              <div>
                <h2>{results}</h2>
                {makeTable()}
              </div>
            )
          }}
      </ReactTable>
    )
  }
}

export default hot(module)(ResourceBasedTable)
