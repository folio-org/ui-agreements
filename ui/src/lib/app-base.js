import { observable, computed, toJS, action } from 'mobx'
import restful, { fetchBackend } from 'restful.js'
import queryString from 'query-string'

let history
let lastLocationRef = null
let qsObject = {}

class AppBase {
  
  constructor(props) {
    history = props.history
  }
  
  get allPerms() {
    return []
  }
  
  hasPerm = (perm) => {
    return false
  }
  
  log = (...args) => {
    window.console.log.call(window, ...args)
  }
  
  @observable appConfig = require('../config').default

  get user () { return null }
  
  @observable apiDescriptor = {}
  
  @computed get apiConfig () {
    if (!this.apiDescriptor) {
      this.apiDescriptor = Object.assign({}, toJS(this.appConfig.api || {}))
    }
    return this.apiDescriptor
  }
  
  @action.bound
  getResourceType = async (theType) => {
    
    // New promise.
    if (this.apiConfig.resources) {
      return Promise.resolve(this.apiConfig.resources[theType.toLowerCase()].baseUri.substring(1))
    } else {

      const me = this
      // Only access the descriptor directly in this else stanza. Use .apiConfig everywhere else.
      
      // Need to fetch the config first.
      return this.fetch (this.apiConfig.root + '/kiwt/config').then((response) => {
        
        return response.json()
        
      }).then((jsonData) => {

        let resources = {}
        Object.keys(jsonData.resources).forEach((key) => {
          resources[key.toLowerCase()] = jsonData.resources[key]
        })
        
        me.apiDescriptor.resources = resources
        
        return me.apiDescriptor.resources[theType.toLowerCase()].baseUri.substring(1)
      })
    }
  }
  
  fetch = (url, conf) => {
    
    conf = conf || {headers: {}}
    
    if (!conf.headers) {
      // Add a headers object
      conf.headers = {}
    }
    
    // Merge the dereferenced headers.
    Object.assign (conf.headers, toJS(this.apiConfig.headers))
    
    // DO an internal fetch so append the headers.
    return fetch(url, conf)
  }
  
  @computed get url() {
    return this.apiConfig.root
  }
  
  @computed get api() {
    
    let api = restful(this.url, fetchBackend(this.fetch))
    api.addRequestInterceptor((config) => {
      
      /**
       * Restful js seems to encode the url parameter names.. Lets try and
       * do that bit manually here.
       */
      const { params, url } = config
      const encParams = this.queryString().stringify (params)

      // just return modified arguments
      return { params: null, url: `${url}${encParams ? '?' + encParams : ''}` }
    })
    return api
  }
  
  queryString = () => ({
      parse: (theString) => (queryString.parse(theString, this.appConfig.queryString)),
      stringify: (object) => (queryString.stringify(object, this.appConfig.queryString))
  })
  
  get queryStringObject() {
    let currentRef = history.location.key
    if (currentRef !== lastLocationRef) {
      qsObject =  this.queryString().parse( history.location.search )
      lastLocationRef = currentRef
    }
    
    return qsObject
  }
  
  addToQueryString = ( obj ) => {
    let qs = this.queryStringObject
    qs = Object.assign({}, toJS(qs), obj)
    history.push({search: `?${this.queryString().stringify(qs)}` })
  }
  
  addHistoryListener = ( locationListener ) => ( history.listen ( locationListener ) )
}

export default AppBase;
