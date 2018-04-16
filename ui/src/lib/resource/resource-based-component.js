import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observable, action, computed, runInAction } from 'mobx'


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
  @observable working = false
  
  @computed get dataContext() {
    return this.app.getResourceType(this.res).then((theType)=> (this.app.api.all(theType)))
  }
  
  @observable data
    
  @action.bound
  async fetchData(params) {
    this.working = true
    
    const remoteData = await this.dataContext.then((dataContext) => (dataContext.getAll(params)))
    
    // The run in action ensures that the code within is executed after the await has finished, and within this context.
    runInAction(() => {
      this.data = remoteData
      this.working = false
    })
  }
}

export default ResourceBasedComponent
