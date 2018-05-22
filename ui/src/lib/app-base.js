import { observable, computed, toJS, action } from 'mobx'
import restful, { fetchBackend } from 'restful.js'
import queryString from 'query-string'

let history
let lastLocationRef = null
let qsObject = {}

const KIWT_URI = '/kiwt'
const KIWT_CONFIG = `${KIWT_URI}/config`
const KIWT_SCHEMA = `${KIWT_CONFIG}/schema`

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
  getResourceType = (theType) => {
    
    // New promise.
    if (this.apiConfig.resources) {
      return Promise.resolve(this.apiConfig.resources[theType.toLowerCase()].baseUri.substring(1))
    } else {

      const me = this
      // Only access the descriptor directly in this else stanza. Use .apiConfig everywhere else.
      
      // Need to fetch the config first.
      return this.fetchJSON (this.apiConfig.root + KIWT_CONFIG).then((jsonData) => {

        let resources = {}
        Object.keys(jsonData.resources).forEach((key) => {
          resources[key.toLowerCase()] = jsonData.resources[key]
        })
        
        me.apiDescriptor.resources = resources
        
        return me.apiDescriptor.resources[theType.toLowerCase()].baseUri.substring(1)
      })
    }
  }
  
  @action.bound
  getResourceSchema = (theType) => {
    let schemaUrl = this.apiConfig.root + KIWT_SCHEMA + `/${theType.toLowerCase()}`
    this.fetchJSON (schemaUrl).then((jsonData) => {
      this.log (jsonData)
    })
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
  
  fetchJSON = (url, conf) => {
    return this.fetch(url, conf).then( (response) => ( response.json() ))
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
