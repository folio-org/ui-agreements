import { observable, computed, toJS , extendObservable} from 'mobx'
import AppBase from '../app-base'

const PERM_REGEX = /^(((module\.)?(@olf\/)?erm-stripes)|(olf-erm))\.(([^\.]*)\.?(.*))$/

/**
 * OKAPI and Stripes specific app.
 */
class App extends AppBase {
  
  @observable stripes = {}
  
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
  
  constructor(props) {
    super(props)
    this.stripes = props.stripes
  }
  
  @computed
  get ourPerms() {
    
    // Temporary defaults.
    const defaults = [
      'olf-erm.agreements.user'
    ]
    
    return defaults.concat(this.allPerms.filter(item => (
      PERM_REGEX.test(item)
    )))
  }
  
  @observable theModules = new Map()  

  @computed
  get modules() {
    
    let theModules = this.theModules
    
    this.ourPerms.forEach( item => {
      let m = item.match(PERM_REGEX)
      if (m) {
        
        // Only add double nested perms as potential modules.
        if (typeof m[8] !== 'undefined' && m[8]) {
          
          // Attempt to load a module chunk. If we fail then don't add as module.
          // We should still log the failure but chances are this nested permission
          // does not translate to a module.
          let modName = m[7]
          if (modName) {
            import(`../../modules/${modName}`).then(mod => {
              
              // ES6 module should get default.
              let routes = mod.default
              if (routes) {
              
                // Use match groups to build a module entry.
                let entry = theModules.get(modName)
                if (!entry) {
                  entry = {
                    name: modName,
                    modPerms: [m[8]], // init as empty array.
                    routes: routes
                  }
                  
                  theModules.set(modName, entry)
                } else {
                  entry.modPerms.push(m[8])
                }
                
                this.log(`Loaded module ${modName}.`)
              }
            }).catch(error => {
              this.log(`Could not load module ${modName}.`, error)
            });
          }
        }
      }
    })
    
    return this.theModules
  }
  
  @computed
  get allPerms() {
    let stripesPerms = this.stripes.user.perms
    return Object.keys(stripesPerms).filter(perm => stripesPerms[perm] === true)
  }
  
  hasPerm = (perm) => {
    return this.stripes.hasPerm (perm)
  }
  
  log = (...args) => {
    this.stripes.logger.log.apply(this.stripes.logger, ['erm'].concat(...args))
  }
}

export default App

