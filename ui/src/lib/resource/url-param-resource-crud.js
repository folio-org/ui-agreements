import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'
import { hot } from 'react-hot-loader'
import ReactTable from 'react-table'

import ResourceBasedComponent from './resource-based-component'

@observer
class UrlParamResourceCrud extends ResourceBasedComponent {
  
  static propTypes = {
    resource: PropTypes.string.isRequired,
    fieldsToSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
    columnDef: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  constructor (props) {
    super(props)
  }
  
  path = null
  
  @observable perPage = 10
  @observable page = 1
  
  @action.bound
  updateParamsFromUrl = (location) => {
    
    if (!location || location.pathname == this.path) {
      
      let newPars = this.app.queryStringObject
      this.fetchParams = Object.assign({}, this.fetchParams, newPars, { match: this.props.fieldsToSearch })
    }
    
    if (this.fetchParams.perPage) {
      this.perPage = this.fetchParams.perPage
    }
    
    if (this.fetchParams.page) {
      this.page = this.fetchParams.page
    }
    
    this.path = (location || window.location).pathname
  }
  
  stopListening = null
  componentWillUnmount() {
    if ( typeof this.stopListening == 'function' ) {
      this.app.log('Removing URL listener')
      this.stopListening()
      this.stopListening = null
    }
  }
  
  @computed get tableRows() {
    if (this.data) {
      return this.data.body().map((entity) => {
        return entity.data()
      })
    }
    
    return []
  }
  
  fetchTableData = (state) => {
    
    if (typeof this.stopListening !== 'function') {

      // We init data first.
      this.updateParamsFromUrl()
      this.app.log('Adding URL listener')
      this.stopListening = this.app.addHistoryListener(this.updateParamsFromUrl)
      
    } else {
      
      // This is a table change not startup.
      if (this.app && state) {
        let params = Object.assign({term : this.fetchParams.term}, {
          perPage : state.pageSize,
          page: state.page + 1
        })
        this.app.addToQueryString( params )
      }
    }
  }
  
  render() {
    return (
      <ReactTable
        columns={this.props.columnDef.slice()}
        noDataText="No results found"
        manual // Forces table not to paginate or sort automatically, so we can handle it server-side
        data={this.tableRows}
        pages={1} // Display the total number of pages
        loading={this.working} // Display the loading overlay when we need it
        onFetchData={this.fetchTableData} // Request new data when things change
        defaultPageSize={parseInt(this.perPage || 10)}
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


let routerEntry = ( { router, ...comp } ) => (
  ( { match } ) => (
      <UrlParamResourceCrud {...comp} routerMatch={match} />
  )
)

export { routerEntry }

export default hot(module)(UrlParamResourceCrud)
