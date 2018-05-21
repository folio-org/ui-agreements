import React, {Component} from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import Dash from './dash'
import Nav from './layout/nav'

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
  
  NoMatch() {
    return (
      <div>
        <h2>Uh-oh!</h2>
        <p>How did you get to <tt>{location.pathname}</tt>?</p>
      </div>
    )
  }
  
  render() {
    this.app.log("routing %o",this.props)
    let {match, history, location} = this.props
    let mods = this.app.modules.values().map((entry, index) => {
      let ModRoutes = entry.routes
      
      return (<ModRoutes key={`lazy-routes-${index}`} {...this.props} app={this.app} />)
    })
    
    
    return (
      <div className="erm" >
        <Nav match={match} color="light" sticky="top" light expand="lg" className='justify-content-center' location={location} />
        <div className="pt-4" >
          <Switch >
            <Route key="" history={history} exact path={match.path} render={() => <Dash app={this.app} />} />
            { mods }
            <Route render={ this.NoMatch } />
          </Switch>
       </div>
      </div>
    )
  }
}

export default ERMRouting
