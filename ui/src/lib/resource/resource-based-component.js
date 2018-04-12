import restful, { fetchBackend } from 'restful.js'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observable, action, computed, runInAction } from 'mobx'
import 'whatwg-fetch'


class ResourceBasedComponent extends Component {
  static PropTypes = {
    resourceType: PropTypes.string.isRequired,
    params: PropTypes.function,
    app: PropTypes.object.isRequired
  }
  
  constructor (props) {
    super(props)
    this.res = props.resourceType
    this.app = props.app
  }
  
  @observable app
  @observable res
  @computed get resourceType() {
    return this.app.apiConfig.resources[this.res].baseUri.substring(1)
  }
  @computed get url() {
    return this.app.apiConfig.root
  }
  @observable working = false
  
  @computed get api() {
    return restful(this.url, fetchBackend(fetch)).addRequestInterceptor((config) => {
      const { headers } = config

      // just return modified arguments
      return {
        headers : Object.assign(headers, 
          this.app.apiConfig.headers
        )
      }
    })
  }
  
  @computed get dataContext() {
    return this.api.all(this.resourceType)
  }
  
  @observable data
    
  @action.bound
  async fetchData(params) {
    this.working = true
    
    const remoteData = await this.dataContext.getAll(params)
    
    // The run in action ensures that the code within is executed after the await has finished, and within this context.
    runInAction(() => {
      this.data = remoteData
      this.working = false
    })
  }
}

export default ResourceBasedComponent
