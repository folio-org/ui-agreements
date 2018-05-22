import React, {Component} from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import Dash from './dash'
import Nav from './components/nav'

import { observer } from 'mobx-react'
import * as mobx from 'mobx'
const {observable, computed, autorun, action} = mobx

@observer
class ERMRouting extends Component {
  
  @observable app
  
  constructor (props) {
    super (props)
    let AppClass = require('./lib/folio-stripes/app').default
    this.app = new AppClass(props)
  }
  
  render() {
    let {match, history, location} = this.props
    let mods = this.app.modules.values().map((entry, index) => {
      let ModRoutes = entry.routes
      return (<ModRoutes key={`erm-lazy-routes-${index}`} {...this.props} app={this.app} />)
    })
    
    return (
      <div className="erm" >
        <Nav match={match} color="light" sticky="top" light expand="lg" className='justify-content-center' location={location} />
        <div className="pt-4" >
          <Switch >
            <Route history={history} exact path={match.path} render={() => <Dash app={this.app} />} />
            { mods }
          </Switch>
       </div>
      </div>
    )
  }
}

export default ERMRouting
