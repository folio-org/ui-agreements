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
    if (props.fetchParams) {
      this.fetchParams = props.fetchParams
    }
  }
    
  @observable app
  @observable working = false
  @observable data
  @observable fPars = new Map()

  dataContext
  
  @computed
  get fetchParams () {
    return toJS(this.fPars)
  }
  
  set fetchParams (pars) {
    if (pars) {
      this.fPars.replace(pars)
    }
  }
  
  componentWillMount() {
    this.setDataContext ( this.props.resource )
  }
  
  contextObjectCallback = (theType) => {
    let co = this.app.api.all(theType)
    return co
  }
  
  setDataContext( context ) {
    if (typeof context === 'string') {
      this.dataContext = this.app.getResourceType(context).then(this.contextObjectCallback)
    } else {
      this.dataContext = context
    }
  }
  
  remoteDataCallback = (dataContext, parameters) => (dataContext)
  
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
      const remoteData = await this.dataContext.then(
        (dataContext) => (this.remoteDataCallback(dataContext, pars))
      )
      
      // The run in action ensures that the code within is executed after the await has finished, and within this context.
      runInAction(() => {
        this.data = remoteData
        this.working = false
        this.onDataFetched()
      })
    }
  })
  
  onDataFetched() {
    
  }
}

export default ResourceBasedComponent
