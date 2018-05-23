import React from 'react'
import { hot } from 'react-hot-loader'
import Agreements from './agreements'
import Route from 'react-router-dom/Route'

const Routes = ({app, ...props}) => (
  <Route {...props} path="/agreements/:resourceId?" render={() => ( <Agreements app={app} /> )} />
  <Route {...props} path="/agreements/:resourceId?" render={() => ( <Agreements app={app} /> )} />
  <Route {...props} path="/agreements/:resourceId?" render={() => ( <Agreements app={app} /> )} />
)

export default hot(module)(Routes);