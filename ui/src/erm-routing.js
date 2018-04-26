import React, {Component} from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import Agreements from './agreements'
import Dash from './dash'
import app from './lib/folio-stripes/app'
import Nav from './layout/nav'

import * as mobx from 'mobx'
const {observable, autorun, action} = mobx

class ERMRouting extends Component {
  
  constructor (props) {
    super (props)
    app.init (props)
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
    app.log("routing %o",this.props)
    
    let {match} = this.props
    
    return (
      <div className="erm" >
        <Nav app={app} />
        <Switch >
          <Route history={this.props.history} exact path={match.path} render={() => <Dash app={app} />} />
          <Route history={this.props.history} path={match.path + '/agreements/:resourceId?'} render={() => <Agreements app={app} />} />
          <Route component={() => { NoMatch(); }} />
        </Switch>
      </div>
    )
  }
}

export default ERMRouting
