import React from 'react'
import { hot } from 'react-hot-loader'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import KbEntries from './kb-entries'
import EditKbEntry from './edit-kb-entry'

const Routes = ({app, match, ...props}) => (
  <Switch>
    <Route {...props} exact path={`${match.path}/kb/`} render={(p) => (<KbEntries {...p} app={app} />)} />
    <Route {...props} exact path={`${match.path}/kb/:resourceId`} render={(p) => (<KbEntry {...p} app={app} />)} />
  </Switch>
)

export default hot(module)(Routes);
