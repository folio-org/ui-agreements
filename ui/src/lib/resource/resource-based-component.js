import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observable, action, computed, runInAction } from 'mobx'

class ResourceBasedComponent extends Component {
  static PropTypes = {
    resource: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Promise)
    ]).isRequired,
    app: PropTypes.object.isRequired
  }
  
  constructor (props) {
    super(props)
    this.app = props.app
    this.setDataContext ( props.resource )
  }
  
  setDataContext = ( context ) => {
    if (typeof context === 'string') {
      this.dataContext = this.app.getResourceType(context).then((theType) => (this.app.api.all(theType)))
    } else {
      this.dataContext = context
    }
  }
  
  @observable.shallow app
  @observable dataContext
  @observable working = false
  
  @observable data
    
  @action.bound
  async fetchData(params) {
    this.working = true
    
    // Default to using the query string params.
    params = Object.assign({}, this.app.queryStringObject, params)
    
    const remoteData = await this.dataContext.then((dc) => (dc.getAll(params)))
    
    // The run in action ensures that the code within is executed after the await has finished, and within this context.
    runInAction(() => {
      this.data = remoteData
      this.working = false
    })
  }
}

export default ResourceBasedComponent
