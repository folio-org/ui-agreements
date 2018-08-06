import React from 'react'
import { hot } from 'react-hot-loader'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import PackagesComponent from './packagesComponent'


const Routes = ({app, match, ...props}) => (
  <Switch>
    <Route {...props} exact path={match.path+'/packages'} render={() => <PackagesComponent app={app} />} />
  </Switch>
)

export default hot(module)(Routes);

