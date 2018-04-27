import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observable, autorun, action, runInAction, computed, toJS } from 'mobx'

class ResourceBasedComponent extends Component {
  
  static propTypes = {
    resource: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Promise)
    ]).isRequired,
    app: PropTypes.object.isRequired,
    fetchParams: PropTypes.object
  }
  
  constructor (props) {
    super(props)
    this.app = props.app
    this.setDataContext ( props.resource )
    
    this.fetchParams = props.fetchParams
  }
    
  @observable app
  @observable dataContext
  @observable working = false
  @observable data
  @observable fPars = new Map()
  
  set fetchParams (pars) {
    if (pars) {
      this.fPars.replace(pars)
    }
  }
  
  @computed
  get fetchParams () {
    return toJS(this.fPars)
  }
  
  @action.bound
  setDataContext( context ) {
    if (typeof context === 'string') {
      this.dataContext = this.app.getResourceType(context).then((theType) => (this.app.api.all(theType)))
    } else {
      this.dataContext = context
    }
  }
  
  /**
   * Async function short-hand for promise / callback notation.
   * Fetches the data using the current data context and the supplied params. 
   */
  @action.bound
  fetchData = autorun(async () => {
    
    // Ensure we take a local reference to the val we want to watch before the await below.
    // MobX will not pick up the variables usage within the await.
    let pars = this.fetchParams
    
    if (this.dataContext) {
      this.working = true
      const remoteData = await this.dataContext.then((dc) => (dc.getAll(pars)))
      
      // The run in action ensures that the code within is executed after the await has finished, and within this context.
      runInAction(() => {
        this.data = remoteData
        this.working = false
      })
    }
  }, {delay: 200})
}

export default ResourceBasedComponent
