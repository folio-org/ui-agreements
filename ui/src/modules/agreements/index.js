import React from 'react'
import { hot } from 'react-hot-loader'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import Agreements from './agreements'
import EditAgreement from './edit-agreement'

const Routes = ({app, match, ...props}) => (
  <Switch>
    <Route {...props} exact path={`${match.path}/agreements/`} render={(p) => (<Agreements {...p} app={app} />)} />
    <Route {...props} exact path={`${match.path}/agreements/:resourceId`} render={(p) => (<EditAgreement {...p} app={app} />)} />
  </Switch>
)

export default hot(module)(Routes);
