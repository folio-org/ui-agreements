import { observable, computed } from 'mobx'
import restful, { fetchBackend } from 'restful.js'
import 'whatwg-fetch'

class App {
  @observable stripes = {}
  @computed get okapi () { return this.stripes.okapi }
  @computed get user () { return this.stripes.user.user }
  @computed get apiConfig () {
    let apiDescriptor = {
      root: this.okapi.url,
      headers: {
        'X-Okapi-Tenant': this.okapi.tenant,
      },
      resources:{
        subscriptionagreement:{
          baseUri: "/sas",
          identifierProps: ["id"]
        },
        remotekb:{
          baseUri:"/kbs",
          identifierProps:["id"]
        },
        package: {
          baseUri: "/packages",
          identifierProps: ["id"]
        }
      }
    }
    if (this.okapi.token) apiDescriptor.headers['X-Okapi-Token'] = this.okapi.token
    return apiDescriptor
  }
  
  getResourceType = (theType) => (
    this.apiConfig.resources[theType.toLowerCase()].baseUri.substring(1)
  );

  
  @computed get url() {
    return this.apiConfig.root
  }
  
  @computed get api() {
    return restful(this.url, fetchBackend(fetch)).addRequestInterceptor((config) => {
      const { headers } = config

      // just return modified arguments
      return {
        headers : Object.assign(headers, 
          this.apiConfig.headers
        )
      }
    })
  }
  
  hasPerm = (perm) => {
    return this.stripes.hasPerm (perm)
  }
  
  log = (message) => {
    this.stripes.logger.log('erm', message)
  }
}
export default new App()