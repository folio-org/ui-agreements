import React from 'react'
import { hot } from 'react-hot-loader'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import Kb from './kb'

const Routes = ({app, match, ...props}) => (
  <Switch>
    <Route {...props} exact path={`${match.path}/kb/`} render={(p) => (<Kb {...p} app={app} />)} />
  </Switch>
)

export default hot(module)(Routes);
