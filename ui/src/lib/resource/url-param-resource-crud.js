import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { observable, action, computed, runInAction } from 'mobx'
import { hot } from 'react-hot-loader'
import ReactTable from 'react-table'

import ResourceBasedComponent from './resource-based-component'

@observer
class UrlParamResourceCrud extends ResourceBasedComponent {
  
  static propTypes = {
    resourceName: PropTypes.string.isRequired,
    fieldsToSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
    columnDef: PropTypes.arrayOf(PropTypes.object).isRequired,
//    routerMatch: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.updateParamsFromUrl()
  }
  
//  routerParams
  
  @computed get rows() {
    if (this.data) {
      return this.data.body().map((entity) => {
        return entity.data()
      })
    }
    
    return []
  }
  
  @action.bound
  updateParamsFromUrl = () => {
    let newPars = this.app.queryStringObject
    this.fetchParams = Object.assign(this.fetchParams, newPars, { match: this.props.fieldsToSearch })
  }
  
  stopListening = null
  componentWillMount() {
    this.app.log('Adding URL listener')
    this.stopListening = this.app.addHistoryListener(this.updateParamsFromUrl)
  }
  
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
  
  fetchTableData(state) {
    if (this.app && state) {
      let params = Object.assign({}, this.fetchParams, {
        perPage : state.pageSize,
        page: state.page + 1
      })
      this.app.addToQueryString( params )
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
        defaultPageSize={this.fetchParams && this.fetchParams.perPage ? parseInt(this.fetchParams.perPage) : 10}
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
