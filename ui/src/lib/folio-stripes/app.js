import { observable, computed } from 'mobx'

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
        SubscriptionAgreement:{
          baseUri: "/sas",
          identifierProps: ["id"]
        },
        RemoteKB:{
          baseUri:"/kbs",
          identifierProps:["id"]
        },
        Package: {
          baseUri: "/packages",
          identifierProps: ["id"]
        }
      }
    }
    if (this.okapi.token) apiDescriptor.headers['X-Okapi-Token'] = this.okapi.token
    return apiDescriptor
  }
  
  hasPerm = (perm) => {
    return this.stripes.hasPerm (perm)
  }
  
  log = (message) => {
    this.stripes.logger.log('erm', message)
  }
}
export default new App()