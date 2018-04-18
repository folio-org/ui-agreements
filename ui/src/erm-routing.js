import React, {Component} from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import Home from './home'
import Dash from './dash'
import app from './lib/folio-stripes/app'

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
    return (
      <div className="erm" >
        <Switch >
          <Route history={this.props.history} path="/dash" render={() => <Dash app={app} />} />
          <Route history={this.props.history} path={`${this.props.match.path}`} render={() => <Home app={app} />} />
          <Route component={() => { NoMatch(); }} />
        </Switch>
      </div>
    )
  }
}

export default ERMRouting
