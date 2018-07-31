import React, {Component} from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import Dash from './dash'
import Nav from './components/nav'
import Kb from './modules/kb'

import { observer } from 'mobx-react'
import * as mobx from 'mobx'
const {observable, computed, autorun, action} = mobx

@observer
class Routing extends Component {
  
  @observable app
  
  constructor (props) {
    super (props)
    let AppClass = require('./lib/folio-stripes/app').default
    this.app = new AppClass(props)
  }
  
  render() {
    let {match, history, location} = this.props

    // This block of code automatically creates routes based on folio permissions.
    // see get modules() in olf-erm-ui/ui/src/lib/folio-stripes/app.js for details
    // This is how we magically create routes for enabled modules.

    let mods = this.app.modules.values().map((entry, index) => {
      let ModRoutes = entry.routes
      return (<ModRoutes key={`erm-lazy-routes-${index}`} {...this.props} app={this.app} />)
    })
    
    return (
      <div className="erm" >
        <Nav match={match} color="light" sticky="top" light expand="lg" className='justify-content-center' location={location} />
        <div className="pt-4" >
          <Switch>
            <Route history={history} exact path={match.path} render={() => <Dash app={this.app} />} />
            { mods }
            <Route history={history} exact path={match.path+'/kb'} render={() => <Kb app={this.app} />} />
          </Switch>
       </div>
      </div>
    )
  }
}

export default Routing
