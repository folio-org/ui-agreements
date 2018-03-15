import restful, { fetchBackend } from 'restful.js'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { observable, action, computed, runInAction } from 'mobx'
import ReactTable from "react-table"
import 'whatwg-fetch'

@observer
class ResourceBasedComponent extends Component {
  static PropTypes = {
    resourceType: PropTypes.string.isRequired
  }
  
  constructor (props) {
    super(props)
    this.resourceType = props.resourceType
    this.url = props.url ? props.url : 'https://jsonplaceholder.typicode.com'
  }

  
  @observable resourceType
  @observable url
  @observable columns = [
    {
      Header: "Names",
      accessor: "name"
    },
    {
      Header: "Email",
      accessor: "email"
    },
    {
      Header: "Phone Nu",
      accessor: "phone"
    },
  ]
  
  @computed get api() {
    return restful(this.url, fetchBackend(fetch))
  }
  
  @computed get dataContext() {
    return this.api.all(this.resourceType)
  }
  
  @observable working = false
  
  @observable data
  
  @action.bound
  async fetchData() {
    this.working = true
    const remoteData = await this.dataContext.getAll()
    runInAction(() => {
      this.data = remoteData
      this.working = false
    })
  }
  
  @computed get rows() {
    if (this.data) {
      return this.data.body().map((entity) => {
        return entity.data()
      })
    }
    
    return []
  }
  
  componentWillMount() {
    this.fetchData()
  }
  
  render() {
    return (
      <ReactTable
        columns={this.columns.slice()}
        manual // Forces table not to paginate or sort automatically, so we can handle it server-side
        data={this.rows}
        pages={1} // Display the total number of pages
        loading={this.working} // Display the loading overlay when we need it
        onFetchData={this.fetchData} // Request new data when things change
        filterable
        defaultPageSize={10}
        className="-striped -highlight"
      >{(state, makeTable, instance) => {
        return (
          <div>
            <h2>Showing {state.data.length} results</h2>
            {makeTable()}
          </div>
        )
      }}</ReactTable>
    )
  }
}

export default ResourceBasedComponent
