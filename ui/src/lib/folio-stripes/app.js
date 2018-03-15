import { observable, computed } from 'mobx'
import 'whatwg-fetch'
import "react-table/react-table.css"

class App {
  @observable stripes = {}
  @computed get okapi () { return this.stripes.okapi }
  @computed get user () { return this.stripes.user.user }
  
  hasPerm = (perm) => {
    return this.stripes.hasPerm (perm)
  }
  
  log = (message) => {
    this.stripes.logger.log('erm', message)
  }
}
export default new App()