import { observable, computed, toJS } from 'mobx'
import AppBase from '../app-base'

/**
 * OKAPI and Stripes specific app.
 */
class App extends AppBase {
  
  @observable stripes = {}
  
  init(props) {
    super.init(props)
    this.stripes = props.stripes
  }
  
  hasPerm = (perm) => {
    return this.stripes.hasPerm (perm)
  }
  
  log = () => {
    this.stripes.logger.log.call(this.stripes.logger, ['erm'].concat(...arguments))
  }
  
  @computed get okapi () { return this.stripes.okapi }
  @computed get user () { return this.stripes.user.user }
  
  @computed get apiConfig () {
    this.apiDescriptor = Object.assign({}, toJS(this.appConfig.api || {}), {
      root: this.okapi.url,
      headers: {
        'X-Okapi-Tenant': this.okapi.tenant,
      }
    })
    if (this.okapi.token) this.apiDescriptor.headers['X-Okapi-Token'] = this.okapi.token
    return this.apiDescriptor
  }
}

export default new App()

