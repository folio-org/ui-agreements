import React from 'react'
import ResourceBasedComponent from './resource-based-component'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { observable, action, computed, runInAction } from 'mobx'
import { hot } from 'react-hot-loader'
import ReactTable from "react-table"

@observer
class ResourceBasedTable extends ResourceBasedComponent {
  
  static PropTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
  }
  
  constructor (props) {
    super(props)
    this.columns = props.columns
  }
  
  @observable columns = []
  
  @computed get rows() {
    if (this.data) {
      return this.data.body().map((entity) => {
        return entity.data()
      })
    }
    
    return []
  }

  @action.bound
  fetchTableData(state) {
    let params = {
      perPage : state.pageSize,
      page: state.page + 1
    }
    
    super.fetchData(params)
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
            
            let results = state.data.length > 0 ? 'No results found' : `Showing ${state.data.length} results`
            
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
