import { observable, computed, extendObservable } from 'mobx'
import restful, { fetchBackend } from 'restful.js'
import queryString from 'query-string'

class App {
  
  @observable stripes = {}
  @observable appConfig = require('../../config').default
  history
  
  @computed get okapi () { return this.stripes.okapi }
  @computed get user () { return this.stripes.user.user }
  
  apiDescriptor = {}
  @computed get apiConfig () {
    Object.assign(this.apiDescriptor, {
      root: this.okapi.url,
      headers: {
        'X-Okapi-Tenant': this.okapi.tenant,
      }
    })
    if (this.okapi.token) this.apiDescriptor.headers['X-Okapi-Token'] = this.okapi.token
    return this.apiDescriptor
  }
  
  getResourceType = (theType) => {
    
    const me = this
    
    // New promise.
    if (this.apiConfig.resources) {
      return Promise.resolve(this.apiConfig.resources[theType.toLowerCase()].baseUri.substring(1))
    } else {
      
      // Only access the descriptor directly in tis else stanza. Use .apiConfig everywhere else.
      
      // Need to fetch the config first.
      return this.fetch (this.apiDescriptor.root + '/kiwt/config').then((response) => {
        
        return response.json()
        
      }).then((jsonData) => {

        me.apiDescriptor.resources = {}
        Object.keys(jsonData.resources).forEach((key) => {
          me.apiDescriptor.resources[key.toLowerCase()] = jsonData.resources[key]
        })
        
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
    
    Object.keys(this.apiConfig.headers).forEach ((key) => {
      conf.headers[key] = this.apiConfig.headers[key]
    })
    
    // DO an internal fetch so append the headers.
    return fetch(url, conf)
  }
  
  @computed get url() {
    return this.apiConfig.root
  }
  
  @computed get api() {
    
    let app = this
    
    let api = restful(this.url, fetchBackend(this.fetch))
    api.addRequestInterceptor((config) => {
      
      /**
       * Restful js seems to encode the url parameter names.. Lets try and
       * do that bit manually here.
       */
      const { params, url } = config
      const encParams = app.queryString().stringify (params)

      // just return modified arguments
      return { params: null, url: `${url}${encParams ? '?' + encParams : ''}` }
    })
    return api
  }
  
  hasPerm = (perm) => {
    return this.stripes.hasPerm (perm)
  }
  
  log = (message) => {
    this.stripes.logger.log('erm', message)
  }
  
  queryString = () => ({
      parse: (theString) => (queryString.parse(theString, this.appConfig.queryString)),
      stringify: (object) => (queryString.stringify(object, this.appConfig.queryString))
  })
  
  @computed get queryStringObject() {    
    return this.queryString().parse( this.history.location.search )
  }
  
  init = (props) => {
    this.stripes = props.stripes
    this.history = props.history
    this.history.location = extendObservable(this.history.location, {search: this.history.location.search})
  }
  
  addToQueryString = ( obj ) => {
    let qs = this.queryStringObject
    qs = Object.assign({}, qs, obj)
    this.history.push({search: `?${this.queryString().stringify(qs)}` })
  }
}
export default new App()