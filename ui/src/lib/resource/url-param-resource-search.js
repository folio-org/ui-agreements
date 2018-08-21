import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { hot } from 'react-hot-loader';
import ReactTable from 'react-table';
import selectTableHOC from 'react-table/lib/hoc/selectTable'
import treeTableHOC from "react-table/lib/hoc/treeTable"


import ResourceBasedComponent from './resource-based-component';

const TableHOC = selectTableHOC(ReactTable);

@observer
class UrlParamResourceSearch extends ResourceBasedComponent {

  
  static propTypes = {
    resource: PropTypes.string.isRequired,
    fieldsToSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
    columnDef: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleRowClicked: React.PropTypes.func,
    keyField: React.PropTypes.string,
    selection: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.updateStateFromParams()
  }

  
  @action.bound
  updateStateFromParams = (urlPars) => {
    urlPars = urlPars || this.app.queryStringObject
    let num
    if (urlPars.perPage) {
      num = parseInt(urlPars.perPage)
      this.perPage = (num === NaN ? 10 : num)
    }
    if (urlPars.page) {
      num = parseInt(urlPars.page)
      this.page = (num === NaN ? 10 : num)
    }
  }
  
  @observable perPage = 50
  @observable page = 1
  @observable totalPages = 1
  @observable total = 0
  @observable selection = this.props.selection || []
  
  path = null
  @action.bound
  updateParamsFromUrl = (location) => {
    
    if (!location || location.pathname == this.path) {

      let urlPars = this.app.queryStringObject
      this.updateStateFromParams(urlPars)
      
      // Constant params to feed to the backend.
      const constants = {
        stats: true, // This asks the backend to supply search stats. Page, totals etc.
        perPage: this.perPage,
        page: this.page
      }
      
      let newParams = Object.assign({}, this.fetchParams, urlPars, constants)
      if (newParams.term) {
        newParams.match = this.props.fieldsToSearch
      }
      
      this.fetchParams = newParams
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
  
  @computed get responseData() {
    if (this.data) {
      return this.data.body().data()
    } 

    return {}
  }
  
  /**
   * The results, although a collection come though as an object. With state information and the results as a property.
   */
  contextObjectCallback = (theType) => {
    
    let theTarget = this.app.api.custom(theType)
    return theTarget
  }
  remoteDataCallback = (dataContext, parameters) => {
    let results = dataContext.get(parameters)
    return results
  }
  
  onDataFetched() {
    let num
    if (this.responseData.perPage) {
      num = parseInt(body.perPage)
      this.perPage = (num === NaN ? 10 : num)
    }
    
    if (this.responseData.page) {
      num = parseInt(this.responseData.page)
      this.page = (num === NaN ? 1 : num)
    }

    if (this.responseData.totalPages) {
      num = parseInt(this.responseData.totalPages)
      this.totalPages = (num === NaN ? 1 : num)
    }
    
    if (this.responseData.total) {
      num = parseInt(this.responseData.total)
      this.total = (num === NaN ? 0 : num)
    }

    if (this.responseData.totalPages) {
      num = parseInt(this.responseData.totalPages)
      this.totalPages = (num === NaN ? 1 : num)
    }
  }
  
  @computed get tableRows() {    
    return this.responseData.results ? this.responseData.results.map((entity) => {
      return entity
    }) : []
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
          page: state.page + 1,
          sort: state.sorted.map((sort => (`${sort.id};${sort.desc ? 'desc' : 'asc'}`)))
        })
        
        this.app.addToQueryString( params )
      }
    }
  }
  
  @action.bound
  toggleSelection = (key, shift, row) => {

    // console.log("toggleSelection(%o,%o%,%o)",key, shift, row);

    // start off with the existing state
    const keyIndex = this.selection.indexOf(key);
    // check to see if the key exists
    if (keyIndex >= 0) {
      console.log("toggle off %o",key);
      // it does exist so we will remove it using destructing
      this.selection = [
        ...this.selection.slice(0, keyIndex),
        ...this.selection.slice(keyIndex + 1)
      ];
    } else {
      console.log("toggle on %o",key);
      // it does not exist so add it
      this.selection.push(key);
    }

    // Steve: This causes the checkbox to display when checked - appreciate it's possibly not the
    // mobx way.
    this.setState({});
  };

  @action.bound
  isSelected = key => {
    return this.selection.includes(key);
  };

  @action.bound
  selectAll = () => {
  };

  @action.bound
  toggleAll = () => {
  };

  @action.bound
  logSelection = () => {
    console.log("selection:", this.selection);
  };

  @action.bound
  doSort = (newSorted, column, shiftKey) => {
  }
  
  render() {
    
    let paginate = this.totalPages > 1
    let minRows = paginate ? undefined : (this.total < 1 ? 5 : this.total % this.perPage)
    
    return (
      <TableHOC
        keyField={this.props.keyField}
        columns={this.props.columnDef.slice()}
        selectAll="true"
        selectType="checkbox"
        toggleSelection={this.toggleSelection}
        isSelected={this.isSelected}
        selectAll={this.selectAll}
        toggleAll={this.toggleAll}
        noDataText="No results found"
        manual // Forces table not to paginate or sort automatically, so we can handle it server-side
        showPagination={paginate}
        // showPaginationTop={paginate}
        showPaginationBottom={paginate}
        showPageSizeOptions={paginate}
        minRows={minRows}
        data={this.tableRows}
        pages={this.totalPages} // Display the total number of pages
        defaultPageSize={this.perPage}
        loading={this.working} // Display the loading overlay when we need it
        onFetchData={this.fetchTableData} // Request new data when things change
        className="-striped -highlight"
        getTdProps={(state, rowInfo, column, instance) => {
          return {
            onClick: (e, handleOriginal) => {
              // console.log("A Td Element was clicked!");
              // console.log("TD clicked it produced this event:", e);
              // console.log("It was in this column:", column);
              // console.log("It was in this row:", rowInfo);
              // console.log("It was in this table instance:", instance);
              // IMPORTANT! React-Table uses onClick internally to trigger
              // events like expanding SubComponents and pivots.
              // By default a custom 'onClick' handler will override this functionality.
              // If you want to fire the original onClick handler, call the
              // 'handleOriginal' function.
              if (handleOriginal) {
                handleOriginal();
              }
            }
          };
        }}
        getTrProps={(state, rowInfo, column) => {
          return {
            onClick: (e, handleOriginal) => {

              console.log("Row clicked",e,rowInfo);
              if (this.props.handleRowClicked) {
                this.props.handleRowClicked(e,rowInfo)
              }

              if (handleOriginal) {
                handleOriginal();
              }
            }
          };
        }}
          >{(state, makeTable, instance) => {
            let results = state.data.length < 1 ? 'No results found' : `Showing ${state.data.length} results`
            return (
              <div>
		<div>
		  <div className="pull-left"><h2>{results}</h2></div>
		  <div className='pull-right'>X selected</div>
		  <div className="clearfix"></div>
		</div>
                {makeTable()}
              </div>
            )
          }}
      </TableHOC>
    )
  }
}

export default hot(module)(UrlParamResourceSearch)
