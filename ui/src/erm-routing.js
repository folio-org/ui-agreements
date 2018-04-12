import React, {Component} from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import Home from './home'
import app from './lib/folio-stripes/app'

import * as mobx from 'mobx'
const {observable, autorun, action} = mobx

class ERMRouting extends Component {
  
  constructor (props) {
    super (props)
    app.stripes = props.stripes
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
          <Route path={`${this.props.match.path}`} render={() => <Home/>} />
          <Route component={() => { NoMatch(); }} />
        </Switch>
      </div>
    )
  }
}

export default ERMRouting
