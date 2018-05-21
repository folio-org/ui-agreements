import React, {Component} from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import Dash from './dash'
import app from './lib/folio-stripes/app'
import Nav from './layout/nav'

import { observer } from 'mobx-react'
import * as mobx from 'mobx'
const {observable, computed, autorun, action} = mobx

let theApp

@observer
class ERMRouting extends Component {
  
  constructor (props) {
    super (props)
    if (!theApp) {
      theApp = app
      theApp.init (props)
    }
  }
    
  @computed
  get modules () {
    
    // Grab each module from the app.
    let instProps = Object.assign({app: theApp}, this.props)
    
    return theApp.modules.values().map(entry => {
      // Create an instance of the module class.
      let mod = new entry.theClass(instProps)
      return mod
    })
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
    let defaultRouterProps = {
      match: this.props.match,
      history: this.props.history,
      location: this.props.location
    }
    
    // primary nav
    let primaryNav = []
    
    // All modules
    let moduleRoutes = []

    let count = 0;
    this.modules.forEach(mod => {
      let routes = mod.routes
      Object.keys(routes).forEach( path => {
        let route = routes[path]
        let routeProps = Object.assign({key: `lazy-route-${count}`, path: match.path + path}, defaultRouterProps)
        let componentProps = Object.assign({app: theApp}, this.props)
        
        // render or component
        if (typeof route.render === 'function') {
          routeProps.render = route.render(componentProps)
        } else if (typeof route.component === 'function') {
          routeProps.component = route.component(componentProps)
        }
        
        moduleRoutes.push(
          <Route {...routeProps} />
        )
        count++
      })
    })
    
    return (
      <div className="erm" >
        <Nav match={match} color="light" sticky="top" light expand="lg" className='justify-content-center' location={location} />
        <div className="pt-4" >
          <Switch >
            <Route key="" history={history} exact path={match.path} render={() => <Dash app={theApp} />} />
            { moduleRoutes }
            <Route render={ this.NoMatch } />
          </Switch>
       </div>
      </div>
    )
  }
}

export default ERMRouting
