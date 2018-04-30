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
    console.log("routing %o",this.props)
    
    let {match, history, location} = this.props
    
    return (
      <div className="erm" >
        <Nav match={match} color="light" sticky="top" light expand="lg" className='justify-content-center' location={location} />
        <div className="pt-4" >
          <Switch >
            <Route history={history} exact path={match.path} render={() => <Dash app={app} />} />
            <Route history={history} path={match.path + '/agreements/:resourceId?'} render={() => <Agreements app={app} />} />
            <Route component={() => { this.NoMatch(); }} />
          </Switch>
       </div>
      </div>
    )
  }
}

export default ERMRouting
