import React, {Component} from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import Home from './home'
import Dash from './dash'
import Packages from './packages'
import Platforms from './platforms'
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
    // Steve: Can you add a comment here explaining how the default route works here, or what mechanism
    // is in force that causes the Home page to be rendered. I can't make the NoMatch route work.
    console.log("Here %o",this.props);
    return (
      <div className="erm" >
        <Switch >
          <Route history={this.props.history} path="/erm/platforms" render={() => <Platforms app={app} />} />
          <Route history={this.props.history} path="/erm/packages" render={() => <Packages app={app} />} />
          <Route history={this.props.history} path="/erm/dash" render={() => <Dash app={app} />} />
          <Route history={this.props.history} path="/erm" render={() => <Home app={app} />} />
          <Route component={() => { NoMatch(); }} />
        </Switch>
      </div>
    )
  }
}

export default ERMRouting
